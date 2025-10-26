import mongoose from "mongoose";

const collaborationSchema = new mongoose.Schema({
  designId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Design',
    required: true
  },
  designerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined', 'completed'],
    default: 'pending'
  },
  message: {
    type: String,
    required: true,
    maxlength: 1000
  },
  proposedTerms: {
    budget: {
      type: Number,
      min: 0
    },
    timeline: {
      type: String,
      maxlength: 100
    },
    deliverables: [{
      type: String,
      maxlength: 200
    }],
    additionalNotes: {
      type: String,
      maxlength: 500
    }
  },
  
  // Communication
  messages: [{
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      required: true,
      maxlength: 1000
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    attachments: [{
      type: String
    }]
  }],
  
  // Notifications
  smsNotificationSent: {
    type: Boolean,
    default: false
  },
  emailNotificationSent: {
    type: Boolean,
    default: false
  },
  
  // Completion
  completedAt: Date,
  
  // Response tracking
  respondedAt: Date,
  responseMessage: {
    type: String,
    maxlength: 1000
  }
}, {
  timestamps: true
});

// Indexes for better performance
collaborationSchema.index({ designerId: 1, status: 1, createdAt: -1 });
collaborationSchema.index({ companyId: 1, status: 1, createdAt: -1 });
collaborationSchema.index({ designId: 1 });
collaborationSchema.index({ status: 1, createdAt: -1 });

// Virtual for latest message
collaborationSchema.virtual('latestMessage').get(function() {
  if (this.messages && this.messages.length > 0) {
    return this.messages[this.messages.length - 1];
  }
  return null;
});

// Virtual for messages count
collaborationSchema.virtual('messagesCount').get(function() {
  return this.messages ? this.messages.length : 0;
});

// Virtual for duration (if completed)
collaborationSchema.virtual('duration').get(function() {
  if (this.completedAt && this.createdAt) {
    const diffTime = Math.abs(this.completedAt - this.createdAt);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
  return null;
});

// Ensure virtual fields are serialized
collaborationSchema.set('toJSON', { virtuals: true });

// Pre-save middleware to set respondedAt when status changes from pending
collaborationSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status !== 'pending' && !this.respondedAt) {
    this.respondedAt = new Date();
  }
  
  if (this.status === 'completed' && !this.completedAt) {
    this.completedAt = new Date();
  }
  
  next();
});

const Collaboration = mongoose.model('Collaboration', collaborationSchema);
export default Collaboration;