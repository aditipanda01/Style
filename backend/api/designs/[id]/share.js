const connectDB = require('../../utils/db');
const Design = require('../../../models/Design');
const User = require('../../../models/User');
const Notification = require('../../../models/Notification');
const { authenticateToken } = require('../../utils/auth');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: 'Only POST method allowed'
      }
    });
  }

  try {
    await connectDB();

    return new Promise((resolve) => {
      authenticateToken(req, res, async () => {
        try {
          const { id: designId } = req.query;
          const userId = req.userId;

          // Find the design
          const design = await Design.findById(designId).populate('userId', 'firstName lastName username companyName phone userType');
          if (!design) {
            return res.status(404).json({
              success: false,
              error: {
                code: 'NOT_FOUND',
                message: 'Design not found'
              }
            });
          }

          // Increment share count
          design.shares = (design.shares || 0) + 1;
          await design.save();

          // Only create notification if it's not the owner sharing their own design
          if (design.userId._id.toString() !== userId) {
            // Get the user who shared the design
            const sharer = await User.findById(userId).select('firstName lastName username companyName userType');
            const sharerName = sharer.userType === 'individual' 
              ? (sharer.username || `${sharer.firstName} ${sharer.lastName}`)
              : sharer.companyName;

            // Create notification for design owner
            await Notification.createNotification({
              userId: design.userId._id,
              type: 'design_shared',
              title: 'Design Shared',
              message: `${sharerName} shared your design "${design.title}"`,
              relatedId: design._id,
              relatedModel: 'Design',
              actionUrl: `/designs/${design._id}`,
              metadata: {
                sharerId: userId,
                sharerName,
                designTitle: design.title
              }
            });
          }

          res.status(200).json({
            success: true,
            message: 'Design shared successfully',
            data: {
              sharesCount: design.shares
            }
          });
          resolve();
        } catch (error) {
          console.error('Share design error:', error);
          res.status(500).json({
            success: false,
            error: {
              code: 'INTERNAL_ERROR',
              message: 'Failed to share design'
            }
          });
          resolve();
        }
      });
    });
  } catch (error) {
    console.error('Share API error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Server error'
      }
    });
  }
}