import connectDB from '../../utils/db.js';
import Design from '../../../models/Design.js';
import User from '../../../models/User.js';
import Notification from '../../../models/Notification.js';
import { authenticateToken } from '../../utils/auth.js';

export default async function handler(req, res) {
  console.log('🔵 Comment handler called:', {
    method: req.method,
    path: req.path,
    url: req.url,
    params: req.params,
    query: req.query,
    body: req.body
  });

  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: 'Only GET and POST methods allowed'
      }
    });
  }

  try {
    await connectDB();

    if (req.method === 'GET') {
      return await getComments(req, res);
    } else {
      return new Promise((resolve) => {
        authenticateToken(req, res, async () => {
          try {
            const designId = req.params.id || req.query.id;
            
            console.log('🔵 Design ID extracted:', designId);
            console.log('🔵 Comment text:', req.body?.text);
            
            if (!designId) {
              console.log('❌ No design ID found');
              return res.status(400).json({
                success: false,
                error: {
                  code: 'VALIDATION_ERROR',
                  message: 'Design ID is required'
                }
              });
            }
            
            const userId = req.userId;
            const { text } = req.body;

            if (!text || text.trim().length === 0) {
              return res.status(400).json({
                success: false,
                error: {
                  code: 'VALIDATION_ERROR',
                  message: 'Comment text is required'
                }
              });
            }

            if (text.length > 500) {
              return res.status(400).json({
                success: false,
                error: {
                  code: 'VALIDATION_ERROR',
                  message: 'Comment text must be less than 500 characters'
                }
              });
            }

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

            // Get the user who commented
            const commenter = await User.findById(userId).select('firstName lastName username companyName userType');
            const commenterName = commenter.userType === 'individual' 
              ? (commenter.username || `${commenter.firstName} ${commenter.lastName}`)
              : commenter.companyName;

            // Add comment
            design.comments.push({
              userId: userId,
              text: text.trim(),
              createdAt: new Date()
            });
            await design.save();

            // Only create notification if it's not the owner commenting on their own design
            if (design.userId._id.toString() !== userId) {
              // Create notification for design owner
              await Notification.createNotification({
                userId: design.userId._id,
                type: 'design_commented',
                title: 'New Comment',
                message: `${commenterName} commented on your design "${design.title}"`,
                relatedId: design._id,
                relatedModel: 'Design',
                actionUrl: `/designs/${design._id}`,
                metadata: {
                  commenterId: userId,
                  commenterName,
                  designTitle: design.title
                }
              });
            }

            // Populate the comment with user info
            const savedComment = design.comments[design.comments.length - 1];
            await savedComment.populate('userId', 'firstName lastName username companyName userType');

            res.status(200).json({
              success: true,
              message: 'Comment added successfully',
              data: {
                comment: {
                  _id: savedComment._id,
                  userId: {
                    _id: savedComment.userId._id,
                    firstName: savedComment.userId.firstName,
                    lastName: savedComment.userId.lastName,
                    username: savedComment.userId.username,
                    companyName: savedComment.userId.companyName,
                    userType: savedComment.userId.userType
                  },
                  text: savedComment.text,
                  createdAt: savedComment.createdAt
                },
                commentsCount: design.comments.length
              }
            });
            resolve();
          } catch (error) {
            console.error('Add comment error:', error);
            res.status(500).json({
              success: false,
              error: {
                code: 'INTERNAL_ERROR',
                message: 'Failed to add comment'
              }
            });
            resolve();
          }
        });
      });
    }
  } catch (error) {
    console.error('Comment API error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Server error'
      }
    });
  }
}

async function getComments(req, res) {
  try {
    const designId = req.params.id || req.query.id;
    
    if (!designId) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Design ID is required'
        }
      });
    }

    // Find the design and populate comments
    const design = await Design.findById(designId)
      .populate('comments.userId', 'firstName lastName username companyName userType')
      .select('comments');

    if (!design) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Design not found'
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        comments: design.comments || [],
        commentsCount: design.comments ? design.comments.length : 0
      }
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch comments'
      }
    });
  }
}

