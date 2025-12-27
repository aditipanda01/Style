import connectDB from '../../utils/db.js';
import Design from '../../../models/Design.js';
import { authenticateToken } from '../../utils/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({
      success: false,
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: 'Only DELETE method allowed'
      }
    });
  }

  try {
    await connectDB();

    return new Promise((resolve) => {
      authenticateToken(req, res, async () => {
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

          const userId = req.userId;

          // Find the design
          const design = await Design.findById(designId);

          if (!design) {
            return res.status(404).json({
              success: false,
              error: {
                code: 'NOT_FOUND',
                message: 'Design not found'
              }
            });
          }

          // Check if user owns the design
          if (design.userId.toString() !== userId.toString()) {
            return res.status(403).json({
              success: false,
              error: {
                code: 'FORBIDDEN',
                message: 'You can only delete your own designs'
              }
            });
          }

          // Delete the design
          await Design.findByIdAndDelete(designId);

          console.log(`✅ Design ${designId} deleted by user ${userId}`);

          res.status(200).json({
            success: true,
            message: 'Design deleted successfully',
            data: {
              designId: designId
            }
          });
          resolve();
        } catch (error) {
          console.error('Delete design error:', error);
          res.status(500).json({
            success: false,
            error: {
              code: 'INTERNAL_ERROR',
              message: 'Failed to delete design'
            }
          });
          resolve();
        }
      });
    });
  } catch (error) {
    console.error('Delete design API error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Server error'
      }
    });
  }
}

