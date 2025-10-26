import connectDB from "../utils/db.js";
import Collaboration from "../../models/Collaboration.js";
import Design from "../../models/Design.js";
import User from "../../models/User.js";
import Notification from "../../models/Notification.js";
import { authenticateToken, requireCompany } from "../utils/auth.js";
//import { sendCollaborationRequestSMS } from "../utils/sms.js";
import Joi from "joi";

// Validation schemas
const createCollaborationSchema = Joi.object({
  designId: Joi.string().required(),
  message: Joi.string().max(1000).required(),
  proposedTerms: Joi.object({
    budget: Joi.number().min(0).optional(),
    timeline: Joi.string().max(100).optional(),
    deliverables: Joi.array().items(Joi.string().max(200)).max(10).optional(),
    additionalNotes: Joi.string().max(500).optional()
  }).optional()
});

const querySchema = Joi.object({
  status: Joi.string().valid('pending', 'accepted', 'declined', 'completed').optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(20)
});

export default async function handler(req, res) {
  try {
    await connectDB();

    if (req.method === 'GET') {
      return await getCollaborations(req, res);
    } else if (req.method === 'POST') {
      return await createCollaboration(req, res);
    } else {
      return res.status(405).json({
        success: false,
        error: {
          code: 'METHOD_NOT_ALLOWED',
          message: 'Only GET and POST methods allowed'
        }
      });
    }
  } catch (error) {
    console.error('Collaborations API error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Server error'
      }
    });
  }
}

async function getCollaborations(req, res) {
  return new Promise((resolve) => {
    authenticateToken(req, res, async () => {
      try {
        const { error, value } = querySchema.validate(req.query);
        if (error) {
          return res.status(400).json({
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Invalid query parameters',
              details: error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
              }))
            }
          });
        }

        const { status, page, limit } = value;
        const { type } = req.query; // 'sent' or 'received'
        const userId = req.userId;
        const skip = (page - 1) * limit;

        // Build query based on user type and request type
        let query = {};
        
        if (type === 'sent') {
          // Collaborations sent by this user (companies send requests)
          query.companyId = userId;
        } else if (type === 'received') {
          // Collaborations received by this user (designers receive requests)
          query.designerId = userId;
        } else {
          // All collaborations involving this user
          query.$or = [
            { designerId: userId },
            { companyId: userId }
          ];
        }

        if (status) {
          query.status = status;
        }

        // Get collaborations with populated data
        const collaborations = await Collaboration.find(query)
          .populate('designId', 'title images category')
          .populate('designerId', 'firstName lastName username profilePicture userType')
          .populate('companyId', 'companyName companyLogo userType')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit);

        // Get total count for pagination
        const totalItems = await Collaboration.countDocuments(query);
        const totalPages = Math.ceil(totalItems / limit);

        res.status(200).json({
          success: true,
          data: {
            collaborations,
            pagination: {
              currentPage: page,
              totalPages,
              totalItems,
              itemsPerPage: limit,
              hasNext: page < totalPages,
              hasPrev: page > 1
            }
          }
        });
        resolve();
      } catch (error) {
        console.error('Get collaborations error:', error);
        res.status(500).json({
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Failed to get collaborations'
          }
        });
        resolve();
      }
    });
  });
}

async function createCollaboration(req, res) {
  return new Promise((resolve) => {
    authenticateToken(req, res, async () => {
      // Apply company requirement middleware
      if (req.user.userType !== 'company') {
        return res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Only companies can send collaboration requests'
          }
        });
      }

      try {
        // Validate request body
        const { error, value } = createCollaborationSchema.validate(req.body);
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

        const { designId, message, proposedTerms } = value;
        const companyId = req.userId;

        // Find the design and verify it exists and is available for collaboration
        const design = await Design.findById(designId).populate('userId', 'firstName lastName username phone userType');
        if (!design) {
          return res.status(404).json({
            success: false,
            error: {
              code: 'NOT_FOUND',
              message: 'Design not found'
            }
          });
        }

        if (!design.isAvailableForCollab) {
          return res.status(400).json({
            success: false,
            error: {
              code: 'BAD_REQUEST',
              message: 'Design is not available for collaboration'
            }
          });
        }

        // Check if company is trying to collaborate on their own design
        if (design.userId._id.toString() === companyId) {
          return res.status(400).json({
            success: false,
            error: {
              code: 'BAD_REQUEST',
              message: 'Cannot collaborate on your own design'
            }
          });
        }

        // Check if there's already a pending collaboration request
        const existingCollaboration = await Collaboration.findOne({
          designId,
          companyId,
          designerId: design.userId._id,
          status: 'pending'
        });

        if (existingCollaboration) {
          return res.status(409).json({
            success: false,
            error: {
              code: 'CONFLICT',
              message: 'Collaboration request already exists for this design'
            }
          });
        }

        // Create collaboration request
        const collaboration = new Collaboration({
          designId,
          designerId: design.userId._id,
          companyId,
          message,
          proposedTerms: proposedTerms || {}
        });

        await collaboration.save();

        // Get company details for notifications
        const company = await User.findById(companyId).select('companyName');

        // Create notification for designer
        await Notification.createNotification({
          userId: design.userId._id,
          type: 'collaboration_request',
          title: 'New Collaboration Request',
          message: `${company.companyName} wants to collaborate on your design "${design.title}"`,
          relatedId: collaboration._id,
          relatedModel: 'Collaboration',
          actionUrl: `/dashboard/collaborations/${collaboration._id}`,
          metadata: {
            companyId,
            companyName: company.companyName,
            designTitle: design.title,
            designId
          }
        });

        // Send SMS notification to designer
        if (design.userId.phone) {
          try {
            const smsResult = await sendCollaborationRequestSMS(
              design.userId.phone,
              company.companyName,
              design.title
            );
            
            if (smsResult.success) {
              collaboration.smsNotificationSent = true;
              await collaboration.save();
            }
          } catch (smsError) {
            console.error('SMS notification failed:', smsError);
            // Don't fail the request if SMS fails
          }
        }

        // Populate the collaboration data for response
        await collaboration.populate([
          { path: 'designId', select: 'title images category' },
          { path: 'designerId', select: 'firstName lastName username profilePicture userType' },
          { path: 'companyId', select: 'companyName companyLogo userType' }
        ]);

        res.status(201).json({
          success: true,
          message: 'Collaboration request sent successfully',
          data: collaboration
        });
        resolve();
      } catch (error) {
        console.error('Create collaboration error:', error);
        res.status(500).json({
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Failed to create collaboration request'
          }
        });
        resolve();
      }
    });
  });
}