import connectDB from "../utils/db.js";
import User from "../../models/User.js";
import Design from "../../models/Design.js";
import Collaboration from "../../models/Collaboration.js";
import { authenticateToken } from "../utils/auth.js";
import Joi from "joi";

// Validation schema for profile update
const updateProfileSchema = Joi.object({
  // Individual fields
  firstName: Joi.string().max(50).optional(),
  lastName: Joi.string().max(50).optional(),
  username: Joi.string().alphanum().min(3).max(30).optional(),
  bio: Joi.string().max(500).optional(),
  profilePicture: Joi.string().uri().optional(),
  location: Joi.string().max(100).optional(),
  
  // Company fields
  companyName: Joi.string().max(100).optional(),
  companyAddress: Joi.object({
    street: Joi.string().max(100).optional(),
    city: Joi.string().max(50).optional(),
    state: Joi.string().max(50).optional(),
    country: Joi.string().max(50).optional(),
    zipCode: Joi.string().max(20).optional()
  }).optional(),
  companyDescription: Joi.string().max(1000).optional(),
  companyLogo: Joi.string().uri().optional(),
  website: Joi.string().uri().optional(),
  establishedYear: Joi.number().integer().min(1800).max(new Date().getFullYear()).optional(),
  
  // Common fields
  phone: Joi.string().pattern(/^\+[1-9]\d{1,14}$/).optional()
});

export default async function handler(req, res) {
  try {
    // Connect to database
    await connectDB();

    if (req.method === 'GET') {
      // Get user profile
      return await getUserProfile(req, res);
    } else if (req.method === 'PUT') {
      // Update user profile
      return await updateUserProfile(req, res);
    } else {
      return res.status(405).json({
        success: false,
        error: {
          code: 'METHOD_NOT_ALLOWED',
          message: 'Only GET and PUT methods allowed'
        }
      });
    }
  } catch (error) {
    console.error('Profile API error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Server error'
      }
    });
  }
}

async function getUserProfile(req, res) {
  // Apply authentication middleware
  return new Promise((resolve) => {
    authenticateToken(req, res, async () => {
      try {
        const userId = req.userId;

        // Get user with populated data
        const user = await User.findById(userId)
          .select('-password')
          .populate('followers', 'firstName lastName username companyName userType profilePicture companyLogo')
          .populate('following', 'firstName lastName username companyName userType profilePicture companyLogo');

        if (!user) {
          return res.status(404).json({
            success: false,
            error: {
              code: 'NOT_FOUND',
              message: 'User not found'
            }
          });
        }

        // Get user statistics
        const designsCount = await Design.countDocuments({ userId, isPublic: true });
        const collaborationsCount = await Collaboration.countDocuments({
          $or: [
            { designerId: userId },
            { companyId: userId }
          ],
          status: { $in: ['accepted', 'completed'] }
        });

        const completedCollaborationsCount = await Collaboration.countDocuments({
          $or: [
            { designerId: userId },
            { companyId: userId }
          ],
          status: 'completed'
        });

        // Calculate total engagement from user's designs
        const userDesigns = await Design.find({ userId }).select('likes saves shares views');
        const totalLikes = userDesigns.reduce((sum, design) => sum + (design.likes?.length || 0), 0);
        const totalSaves = userDesigns.reduce((sum, design) => sum + (design.saves?.length || 0), 0);
        const totalShares = userDesigns.reduce((sum, design) => sum + (design.shares || 0), 0);
        const totalViews = userDesigns.reduce((sum, design) => sum + (design.views || 0), 0);

        // Update user stats if they've changed
        if (user.totalLikes !== totalLikes || user.totalSaves !== totalSaves || user.totalShares !== totalShares) {
          await User.findByIdAndUpdate(userId, {
            totalLikes,
            totalSaves,
            totalShares
          });
        }

        const profileData = {
          ...user.toObject(),
          stats: {
            designsCount,
            collaborationsCount,
            completedCollaborationsCount,
            totalLikes,
            totalSaves,
            totalShares,
            totalViews,
            followersCount: user.followers?.length || 0,
            followingCount: user.following?.length || 0
          }
        };

        res.status(200).json({
          success: true,
          data: profileData
        });
        resolve();
      } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Failed to get profile'
          }
        });
        resolve();
      }
    });
  });
}

async function updateUserProfile(req, res) {
  // Apply authentication middleware
  return new Promise((resolve) => {
    authenticateToken(req, res, async () => {
      try {
        const userId = req.userId;

        // Validate request body
        const { error, value } = updateProfileSchema.validate(req.body);
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

        const updateData = value;

        // Check if username is being updated and is unique
        if (updateData.username) {
          const existingUser = await User.findOne({ 
            username: updateData.username,
            _id: { $ne: userId }
          });
          
          if (existingUser) {
            return res.status(409).json({
              success: false,
              error: {
                code: 'CONFLICT',
                message: 'Username already taken'
              }
            });
          }
        }

        // Update user profile
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          updateData,
          { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
          return res.status(404).json({
            success: false,
            error: {
              code: 'NOT_FOUND',
              message: 'User not found'
            }
          });
        }

        res.status(200).json({
          success: true,
          message: 'Profile updated successfully',
          data: updatedUser
        });
        resolve();
      } catch (error) {
        console.error('Update profile error:', error);
        
        if (error.code === 11000) {
          const field = Object.keys(error.keyPattern)[0];
          return res.status(409).json({
            success: false,
            error: {
              code: 'CONFLICT',
              message: `${field} already exists`
            }
          });
        }

        res.status(500).json({
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Failed to update profile'
          }
        });
        resolve();
      }
    });
  });
}