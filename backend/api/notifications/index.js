import express from "express";
import connectDB from "../utils/db.js";
import Notification from "../../models/Notification.js";
import { authenticateToken } from "../utils/auth.js";
import Joi from "joi";

const router = express.Router();

// Validation schema
const querySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(20),
  unread: Joi.boolean().optional(),
  type: Joi.string().valid(
    'collaboration_request',
    'collaboration_accepted',
    'collaboration_declined',
    'collaboration_completed',
    'new_follower',
    'design_liked',
    'design_saved',
    'design_shared',
    'new_message'
  ).optional()
});

// GET notifications
router.get("/", authenticateToken, async (req, res) => {
  await connectDB();
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

    const { page, limit, unread, type } = value;
    const userId = req.userId;
    const skip = (page - 1) * limit;

    let query = { userId };
    if (unread !== undefined) query.isRead = !unread;
    if (type) query.type = type;

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('relatedId', 'title companyName firstName lastName username')
      .lean();

    const totalItems = await Notification.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);
    const unreadCount = await Notification.getUnreadCount(userId);

    res.status(200).json({
      success: true,
      data: {
        notifications,
        unreadCount,
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
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to get notifications'
      }
    });
  }
});

// PUT mark all as read
router.put("/", authenticateToken, async (req, res) => {
  await connectDB();
  try {
    const userId = req.userId;
    await Notification.markAllAsRead(userId);
    res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to mark notifications as read'
      }
    });
  }
});

export default router;