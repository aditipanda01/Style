import connectDB from "../utils/db.js";
import User from "../../models/User.js";
import { generateToken } from "../utils/auth.js";
import Joi from "joi";

// Validation schema
const registerSchema = Joi.object({
  userType: Joi.string().valid('individual', 'company').required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().pattern(/^\+[1-9]\d{1,14}$/).required(),
  
  // Individual fields
  firstName: Joi.when('userType', {
    is: 'individual',
    then: Joi.string().required(),
    otherwise: Joi.optional()
  }),
  lastName: Joi.when('userType', {
    is: 'individual',
    then: Joi.string().required(),
    otherwise: Joi.optional()
  }),
  username: Joi.when('userType', {
    is: 'individual',
    then: Joi.string().alphanum().min(3).max(30).required(),
    otherwise: Joi.optional()
  }),
  bio: Joi.string().max(500).optional(),
  location: Joi.string().max(100).optional(),
  
  // Company fields
  companyName: Joi.when('userType', {
    is: 'company',
    then: Joi.string().required(),
    otherwise: Joi.optional()
  }),
  companyAddress: Joi.when('userType', {
    is: 'company',
    then: Joi.object({
      street: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      country: Joi.string().required(),
      zipCode: Joi.string().required()
    }).required(),
    otherwise: Joi.optional()
  }),
  companyDescription: Joi.string().max(1000).optional(),
  website: Joi.string().uri().optional(),
  establishedYear: Joi.number().integer().min(1800).max(new Date().getFullYear()).optional()
});

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
    // Connect to database
    await connectDB();

    // Validate request body
    const { error, value } = registerSchema.validate(req.body);
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

    const userData = value;

    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'CONFLICT',
          message: 'User with this email already exists'
        }
      });
    }

    // Check if username already exists (for individuals)
    if (userData.userType === 'individual' && userData.username) {
      const existingUsername = await User.findOne({ username: userData.username });
      if (existingUsername) {
        return res.status(409).json({
          success: false,
          error: {
            code: 'CONFLICT',
            message: 'Username already taken'
          }
        });
      }
    }

    // Create new user
    const user = new User(userData);
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id, user.userType, user.email);

    // Prepare response data (exclude password)
    const responseUser = user.toObject();
    delete responseUser.password;

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: responseUser,
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.code === 11000) {
      // Duplicate key error
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
        message: 'Registration failed'
      }
    });
  }
}