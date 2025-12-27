import connectDB from '../../utils/db.js';
import User from '../../../models/User.js';
import Notification from '../../../models/Notification.js';
import { authenticateToken } from '../../utils/auth.js';

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
          const userId = req.userId;
          const targetUserId = req.params.id || req.query.id;

          if (!targetUserId) {
            return res.status(400).json({
              success: false,
              error: {
                code: 'VALIDATION_ERROR',
                message: 'User ID is required'
              }
            });
          }

          // Can't follow yourself
          if (userId === targetUserId) {
            return res.status(400).json({
              success: false,
              error: {
                code: 'BAD_REQUEST',
                message: 'Cannot follow yourself'
              }
            });
          }

          // Get both users
          const currentUser = await User.findById(userId);
          const targetUser = await User.findById(targetUserId);

          if (!currentUser || !targetUser) {
            return res.status(404).json({
              success: false,
              error: {
                code: 'NOT_FOUND',
                message: 'User not found'
              }
            });
          }

          const isFollowing = currentUser.following.includes(targetUserId);

          if (req.method === 'POST') {
            // Follow user
            if (isFollowing) {
              return res.status(400).json({
                success: false,
                error: {
                  code: 'BAD_REQUEST',
                  message: 'Already following this user'
                }
              });
            }

            currentUser.following.push(targetUserId);
            targetUser.followers.push(userId);
            await currentUser.save();
            await targetUser.save();

            // Create notification
            const followerName = currentUser.userType === 'individual' 
              ? (currentUser.username || `${currentUser.firstName} ${currentUser.lastName}`)
              : currentUser.companyName;

            await Notification.createNotification({
              userId: targetUserId,
              type: 'new_follower',
              title: 'New Follower',
              message: `${followerName} started following you`,
              relatedId: userId,
              relatedModel: 'User',
              actionUrl: `/profile`,
              metadata: {
                followerId: userId,
                followerName
              }
            });

            res.status(200).json({
              success: true,
              message: 'User followed successfully',
              data: {
                isFollowing: true,
                followersCount: targetUser.followers.length,
                followingCount: currentUser.following.length
              }
            });
          } else {
            // Unfollow user
            if (!isFollowing) {
              return res.status(400).json({
                success: false,
                error: {
                  code: 'BAD_REQUEST',
                  message: 'Not following this user'
                }
              });
            }

            currentUser.following = currentUser.following.filter(
              id => id.toString() !== targetUserId
            );
            targetUser.followers = targetUser.followers.filter(
              id => id.toString() !== userId
            );
            await currentUser.save();
            await targetUser.save();

            res.status(200).json({
              success: true,
              message: 'User unfollowed successfully',
              data: {
                isFollowing: false,
                followersCount: targetUser.followers.length,
                followingCount: currentUser.following.length
              }
            });
          }
          resolve();
        } catch (error) {
          console.error('Follow/unfollow error:', error);
          res.status(500).json({
            success: false,
            error: {
              code: 'INTERNAL_ERROR',
              message: 'Failed to process follow/unfollow'
            }
          });
          resolve();
        }
      });
    });
  } catch (error) {
    console.error('Follow API error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Server error'
      }
    });
  }
}

