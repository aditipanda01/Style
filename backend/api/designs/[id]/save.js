const connectDB = require('../../utils/db');
const Design = require('../../../models/Design');
const User = require('../../../models/User');
const Notification = require('../../../models/Notification');
const { authenticateToken } = require('../../utils/auth');

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

          // Check if user is trying to save their own design
          if (design.userId._id.toString() === userId) {
            return res.status(400).json({
              success: false,
              error: {
                code: 'BAD_REQUEST',
                message: 'Cannot save your own design'
              }
            });
          }

          const isCurrentlySaved = design.saves.includes(userId);

          if (req.method === 'POST') {
            // Save the design
            if (isCurrentlySaved) {
              return res.status(400).json({
                success: false,
                error: {
                  code: 'BAD_REQUEST',
                  message: 'Design already saved'
                }
              });
            }

            // Add save
            design.saves.push(userId);
            await design.save();

            // Get the user who saved the design
            const saver = await User.findById(userId).select('firstName lastName username companyName userType');
            const saverName = saver.userType === 'individual' 
              ? (saver.username || `${saver.firstName} ${saver.lastName}`)
              : saver.companyName;

            // Create notification for design owner
            await Notification.createNotification({
              userId: design.userId._id,
              type: 'design_saved',
              title: 'Design Saved',
              message: `${saverName} saved your design "${design.title}"`,
              relatedId: design._id,
              relatedModel: 'Design',
              actionUrl: `/designs/${design._id}`,
              metadata: {
                saverId: userId,
                saverName,
                designTitle: design.title
              }
            });

            res.status(200).json({
              success: true,
              message: 'Design saved successfully',
              data: {
                isSaved: true,
                savesCount: design.saves.length
              }
            });
          } else {
            // Unsave the design
            if (!isCurrentlySaved) {
              return res.status(400).json({
                success: false,
                error: {
                  code: 'BAD_REQUEST',
                  message: 'Design not saved yet'
                }
              });
            }

            // Remove save
            design.saves = design.saves.filter(save => save.toString() !== userId);
            await design.save();

            res.status(200).json({
              success: true,
              message: 'Design unsaved successfully',
              data: {
                isSaved: false,
                savesCount: design.saves.length
              }
            });
          }
          resolve();
        } catch (error) {
          console.error('Save/unsave design error:', error);
          res.status(500).json({
            success: false,
            error: {
              code: 'INTERNAL_ERROR',
              message: 'Failed to process save/unsave'
            }
          });
          resolve();
        }
      });
    });
  } catch (error) {
    console.error('Save API error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Server error'
      }
    });
  }
}