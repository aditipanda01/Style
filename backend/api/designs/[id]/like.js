const connectDB = require('../../utils/db');
const Design = require('../../../models/Design');
const User = require('../../../models/User');
const Notification = require('../../../models/Notification');
const { authenticateToken } = require('../../utils/auth');
const { sendDesignLikedSMS } = require('../../utils/sms');

export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'DELETE') {
    return res.status(405).json({
      success: false,
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: 'Only POST and DELETE methods allowed'
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

          // Check if user is trying to like their own design
          if (design.userId._id.toString() === userId) {
            return res.status(400).json({
              success: false,
              error: {
                code: 'BAD_REQUEST',
                message: 'Cannot like your own design'
              }
            });
          }

          const isCurrentlyLiked = design.likes.includes(userId);

          if (req.method === 'POST') {
            // Like the design
            if (isCurrentlyLiked) {
              return res.status(400).json({
                success: false,
                error: {
                  code: 'BAD_REQUEST',
                  message: 'Design already liked'
                }
              });
            }

            // Add like
            design.likes.push(userId);
            await design.save();

            // Get the user who liked the design
            const liker = await User.findById(userId).select('firstName lastName username companyName userType');
            const likerName = liker.userType === 'individual' 
              ? (liker.username || `${liker.firstName} ${liker.lastName}`)
              : liker.companyName;

            // Create notification for design owner
            await Notification.createNotification({
              userId: design.userId._id,
              type: 'design_liked',
              title: 'Design Liked',
              message: `${likerName} liked your design "${design.title}"`,
              relatedId: design._id,
              relatedModel: 'Design',
              actionUrl: `/designs/${design._id}`,
              metadata: {
                likerId: userId,
                likerName,
                designTitle: design.title
              }
            });

            // Send SMS notification (optional, based on user preferences)
            if (design.userId.phone) {
              try {
                await sendDesignLikedSMS(design.userId.phone, likerName, design.title);
              } catch (smsError) {
                console.error('SMS notification failed:', smsError);
                // Don't fail the request if SMS fails
              }
            }

            res.status(200).json({
              success: true,
              message: 'Design liked successfully',
              data: {
                isLiked: true,
                likesCount: design.likes.length
              }
            });
          } else {
            // Unlike the design
            if (!isCurrentlyLiked) {
              return res.status(400).json({
                success: false,
                error: {
                  code: 'BAD_REQUEST',
                  message: 'Design not liked yet'
                }
              });
            }

            // Remove like
            design.likes = design.likes.filter(like => like.toString() !== userId);
            await design.save();

            res.status(200).json({
              success: true,
              message: 'Design unliked successfully',
              data: {
                isLiked: false,
                likesCount: design.likes.length
              }
            });
          }
          resolve();
        } catch (error) {
          console.error('Like/unlike design error:', error);
          res.status(500).json({
            success: false,
            error: {
              code: 'INTERNAL_ERROR',
              message: 'Failed to process like/unlike'
            }
          });
          resolve();
        }
      });
    });
  } catch (error) {
    console.error('Like API error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Server error'
      }
    });
  }
}