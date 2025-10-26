import connectDB from "../utils/db.js";
import Design from "../../models/Design.js";
import User from "../../models/User.js";
import Notification from "../../models/Notification.js";
import { authenticateToken, optionalAuth } from "../utils/auth.js";
import Joi from "joi";

// ============================================
// ✅ Validation Schemas
// ============================================
const createDesignSchema = Joi.object({
  title: Joi.string().max(200).required(),
  description: Joi.string().max(1000).allow('').optional(),
  category: Joi.string().valid("dress", "jewellery", "shoes").required(),
  tags: Joi.array().items(Joi.string().max(50)).max(10).optional(),
  isPublic: Joi.boolean().default(true),
  isAvailableForCollab: Joi.boolean().default(false),
  images: Joi.array()
    .items(
      Joi.object({
        url: Joi.string().uri().required(),
        publicId: Joi.string().required(),
        isPrimary: Joi.boolean().default(false),
        resourceType: Joi.string().valid("image", "raw").optional(),
      })
    )
    .min(1)
    .required(),
  inspiration: Joi.string().max(500).allow('').optional(),
  designerPhoto: Joi.object({
    url: Joi.string().uri().required(),
    publicId: Joi.string().required(),
  }).required(),
});

const querySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  category: Joi.string().valid('dress', 'jewellery', 'shoes').optional(),
  search: Joi.string().max(100).optional(),
  userId: Joi.string().optional(),
  sortBy: Joi.string().valid('createdAt', 'likes', 'views', 'saves').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
  tags: Joi.string().optional()
});

// ============================================
// ✅ Main Handler
// ============================================
export default async function handler(req, res) {
  try {
    await connectDB();

    if (req.method === "GET") {
      return await getDesigns(req, res);
    } else if (req.method === "POST") {
      return await createDesign(req, res);
    } else {
      return res.status(405).json({
        success: false,
        error: {
          code: "METHOD_NOT_ALLOWED",
          message: "Only GET and POST methods allowed",
        },
      });
    }
  } catch (error) {
    console.error("Designs API error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Server error",
      },
    });
  }
}

// ============================================
// ✅ GET Designs
// ============================================
async function getDesigns(req, res) {
  return new Promise((resolve) => {
    optionalAuth(req, res, async () => {
      try {
        const { error, value } = querySchema.validate(req.query);
        if (error) {
          return res.status(400).json({
            success: false,
            error: {
              code: "VALIDATION_ERROR",
              message: "Invalid query parameters",
              details: error.details.map((detail) => ({
                field: detail.path.join("."),
                message: detail.message,
              })),
            },
          });
        }

        const { page, limit, category, search, userId, sortBy, sortOrder, tags } = value;
        const skip = (page - 1) * limit;

        let query = { isPublic: true };

        if (category) query.category = category;
        if (userId) {
          query.userId = userId;
          if (req.userId && req.userId.toString() === userId) {
            delete query.isPublic; // Owner sees all
          }
        }
        if (search) {
          query.$or = [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { tags: { $in: [new RegExp(search, "i")] } },
          ];
        }
        if (tags) {
          const tagArray = tags.split(",").map((tag) => tag.trim());
          query.tags = { $in: tagArray };
        }

        let sort = {};
        if (sortBy === "likes") {
          sort = { likesCount: sortOrder === "asc" ? 1 : -1 };
        } else if (sortBy === "saves") {
          sort = { savesCount: sortOrder === "asc" ? 1 : -1 };
        } else {
          sort[sortBy] = sortOrder === "asc" ? 1 : -1;
        }

        console.log('🔍 Design query:', JSON.stringify(query));
        console.log('📊 Sort:', JSON.stringify(sort));

        const designs = await Design.aggregate([
          { $match: query },
          {
            $addFields: {
              likesCount: { $size: { $ifNull: ["$likes", []] } },
              savesCount: { $size: { $ifNull: ["$saves", []] } },
            },
          },
          { $sort: sort },
          { $skip: skip },
          { $limit: limit },
          {
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "user",
              pipeline: [
                {
                  $project: {
                    firstName: 1,
                    lastName: 1,
                    username: 1,
                    companyName: 1,
                    userType: 1,
                    profilePicture: 1,
                    companyLogo: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              user: { $arrayElemAt: ["$user", 0] },
              isLiked: req.userId ? { $in: [req.userId, "$likes"] } : false,
              isSaved: req.userId ? { $in: [req.userId, "$saves"] } : false,
            },
          },
        ]);

        const totalItems = await Design.countDocuments(query);
        const totalPages = Math.ceil(totalItems / limit);

        console.log(`✅ Found ${designs.length} designs (total: ${totalItems})`);

        res.status(200).json({
          success: true,
          data: {
            designs,
            pagination: {
              currentPage: page,
              totalPages,
              totalItems,
              itemsPerPage: limit,
              hasNext: page < totalPages,
              hasPrev: page > 1,
            },
          },
        });
        resolve();
      } catch (error) {
        console.error("Get designs error:", error);
        res.status(500).json({
          success: false,
          error: {
            code: "INTERNAL_ERROR",
            message: "Failed to get designs",
          },
        });
        resolve();
      }
    });
  });
}

// ============================================
// ✅ POST (Create Design)
// ============================================
async function createDesign(req, res) {
  return new Promise((resolve) => {
    authenticateToken(req, res, async () => {
      try {
        console.log('📥 Received design data:', JSON.stringify(req.body, null, 2));

        const { error, value } = createDesignSchema.validate(req.body);
        if (error) {
          console.log("❌ Design validation failed:", error.details);
          return res.status(400).json({
            success: false,
            error: {
              code: "VALIDATION_ERROR",
              message: "Validation failed",
              details: error.details.map((detail) => ({
                field: detail.path.join("."),
                message: detail.message,
              })),
            },
          });
        }

        const designData = {
          ...value,
          userId: req.userId,
        };

        // Ensure at least one primary image
        if (designData.images && designData.images.length > 0) {
          const hasPrimary = designData.images.some((img) => img.isPrimary);
          if (!hasPrimary) designData.images[0].isPrimary = true;
        }

        console.log('💾 Saving design to database...');
        const design = new Design(designData);
        await design.save();

        console.log('✅ Design saved with ID:', design._id);

        await design.populate(
          "userId",
          "firstName lastName username companyName userType profilePicture companyLogo"
        );

        console.log('✅ Design created successfully!');

        res.status(201).json({
          success: true,
          message: "Design created successfully",
          data: design,
        });
        resolve();
      } catch (error) {
        console.error("❌ Create design error:", error);
        res.status(500).json({
          success: false,
          error: {
            code: "INTERNAL_ERROR",
            message: "Failed to create design",
          },
        });
        resolve();
      }
    });
  });
}