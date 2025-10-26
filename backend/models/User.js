import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  userType: {
    type: String,
    enum: ['individual', 'company'],
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phone: {
    type: String,
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  
  // Individual User Fields
  firstName: {
    type: String,
    required: function() { return this.userType === 'individual'; }
  },
  lastName: {
    type: String,
    required: function() { return this.userType === 'individual'; }
  },
  username: {
    type: String,
    unique: true,
    sparse: true,
    required: function() { return this.userType === 'individual'; }
  },
  bio: {
    type: String,
    maxlength: 500
  },
  profilePicture: {
    type: String,
    default: ''
  },
  dateOfBirth: Date,
  location: String,
  
  // Company Fields
  companyName: {
    type: String,
    required: function() { return this.userType === 'company'; }
  },
  companyAddress: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  companyDescription: {
    type: String,
    maxlength: 1000
  },
  companyLogo: {
    type: String,
    default: ''
  },
  website: String,
  establishedYear: Number,
  
  // Common Stats
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  totalLikes: {
    type: Number,
    default: 0
  },
  totalSaves: {
    type: Number,
    default: 0
  },
  totalShares: {
    type: Number,
    default: 0
  },
  
  // Timestamps
  lastLogin: Date
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Get full name for individuals
userSchema.virtual('fullName').get(function() {
  if (this.userType === 'individual') {
    return `${this.firstName} ${this.lastName}`;
  }
  return this.companyName;
});

// Get display name
userSchema.virtual('displayName').get(function() {
  if (this.userType === 'individual') {
    return this.username || this.fullName;
  }
  return this.companyName;
});

// Ensure virtual fields are serialized
userSchema.set('toJSON', { virtuals: true });

const User = mongoose.model('User', userSchema);
export default User;