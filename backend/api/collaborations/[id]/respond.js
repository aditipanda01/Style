const connectDB = require('../../utils/db');
const Collaboration = require('../../../models/Collaboration');
const User = require('../../../models/User');
const Notification = require('../../../models/Notification');
const { authenticateToken } = require('../../utils/auth');
const { sendCollaborationAcceptedSMS, sendCollaborationDeclinedSMS } = require('../../utils/sms');
const Joi = require('joi');

// Validation schema
const respondSchema = Joi.object({
  action: Joi.string().valid('accept', 'decline').required(),
  message: Joi.string().max(1000).optional()
});

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({
      success: false,
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: 'Only PUT method allowed'
      }
    });
  }

  try {
    await connectDB();

    return new Promise((resolve) => {
      authenticateToken(req, res, async () => {
        try {
          const { id: collaborationId } = req.query;
          const userId = req.userId;

          // Validate request body
          const { error, value } = respondSchema.validate(req.body);
          if (error) {
            return res.status(400).json({
              success: false,
              error: {
                code: 'VALIDATION_ERROR',
                message: 'Validation failed',
                details: error.details.map(detail => ({
                  field: detail.path.join('.'),
                  message: detail.message
                }))
              }
            });
          }

          const { action, message } = value;

          // Find the collaboration
          const collaboration = await Collaboration.findById(collaborationId)
            .populate('designId', 'title')
            .populate('designerId', 'firstName lastName username phone userType')
            .populate('companyId', 'companyName phone userType');

          if (!collaboration) {
            return res.status(404).json({
              success: false,
              error: {
                code: 'NOT_FOUND',
                message: 'Collaboration not found'
              }
            });
          }

          // Check if user is the designer (only designers can respond)
          if (collaboration.designerId._id.toString() !== userId) {
            return res.status(403).json({
              success: false,
              error: {
                code: 'FORBIDDEN',
                message: 'Only the designer can respond to collaboration requests'
              }
            });
          }

          // Check if collaboration is still pending
          if (collaboration.status !== 'pending') {
            return res.status(400).json({
              success: false,
              error: {
                code: 'BAD_REQUEST',
                message: `Collaboration request has already been ${collaboration.status}`
              }
            });
          }

          // Update collaboration status
          const newStatus = action === 'accept' ? 'accepted' : 'declined';
          collaboration.status = newStatus;
          collaboration.responseMessage = message || '';
          collaboration.respondedAt = new Date();

          await collaboration.save();

          // Get designer name for notifications
          const designerName = collaboration.designerId.userType === 'individual'
            ? (collaboration.designerId.username || `${collaboration.designerId.firstName} ${collaboration.designerId.lastName}`)
            : collaboration.designerId.companyName;

          // Create notification for company
          const notificationType = action === 'accept' ? 'collaboration_accepted' : 'collaboration_declined';
          const notificationTitle = action === 'accept' ? 'Collaboration Accepted' : 'Collaboration Declined';
          const notificationMessage = action === 'accept'
            ? `${designerName} accepted your collaboration request for "${collaboration.designId.title}"`
            : `${designerName} declined your collaboration request for "${collaboration.designId.title}"`;

          await Notification.createNotification({
            userId: collaboration.companyId._id,
            type: notificationType,
            title: notificationTitle,
            message: notificationMessage,
            relatedId: collaboration._id,
            relatedModel: 'Collaboration',
            actionUrl: `/dashboard/collaborations/${collaboration._id}`,
            metadata: {
              designerId: collaboration.designerId._id,
              designerName,
              designTitle: collaboration.designId.title,
              action,
              responseMessage: message
            }
          });

          // Send SMS notification to company
          if (collaboration.companyId.phone) {
            try {
              if (action === 'accept') {
                await sendCollaborationAcceptedSMS(
                  collaboration.companyId.phone,
                  designerName,
                  collaboration.designId.title
                );
              } else {
                await sendCollaborationDeclinedSMS(
                  collaboration.companyId.phone,
                  designerName,
                  collaboration.designId.title
                );
              }
            } catch (smsError) {
              console.error('SMS notification failed:', smsError);
              // Don't fail the request if SMS fails
            }
          }

          // If accepted, create initial message in collaboration
          if (action === 'accept' && message) {
            collaboration.messages.push({
              senderId: userId,
              message: message,
              timestamp: new Date()
            });
            await collaboration.save();
          }

          res.status(200).json({
            success: true,
            message: `Collaboration request ${action}ed successfully`,
            data: {
              collaboration: {
                _id: collaboration._id,
                status: collaboration.status,
                respondedAt: collaboration.respondedAt,
                responseMessage: collaboration.responseMessage
              }
            }
          });
          resolve();
        } catch (error) {
          console.error('Respond to collaboration error:', error);
          res.status(500).json({
            success: false,
            error: {
              code: 'INTERNAL_ERROR',
              message: 'Failed to respond to collaboration request'
            }
          });
          resolve();
        }
      });
    });
  } catch (error) {
    console.error('Collaboration respond API error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Server error'
      }
    });
  }
}