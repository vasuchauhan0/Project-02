const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    trim: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  phone: {
    type: String,
    trim: true,
    match: [
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
      'Please provide a valid phone number'
    ]
  },
  subject: {
    type: String,
    required: [true, 'Please provide a subject'],
    trim: true,
    maxlength: [100, 'Subject cannot be more than 100 characters']
  },
  message: {
    type: String,
    required: [true, 'Please provide a message'],
    trim: true,
    maxlength: [2000, 'Message cannot be more than 2000 characters']
  },
  category: {
    type: String,
    enum: ['General Inquiry', 'Project Proposal', 'Job Opportunity', 'Collaboration', 'Feedback', 'Other'],
    default: 'General Inquiry'
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied', 'archived'],
    default: 'new'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  isSpam: {
    type: Boolean,
    default: false
  },
  repliedAt: {
    type: Date
  },
  replyMessage: {
    type: String
  },
  attachments: [{
    filename: String,
    url: String,
    size: Number
  }],
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Index for searching and filtering
messageSchema.index({ status: 1, createdAt: -1 });
messageSchema.index({ email: 1 });
messageSchema.index({ name: 'text', subject: 'text', message: 'text' });

// Method to mark as read
messageSchema.methods.markAsRead = async function() {
  this.status = 'read';
  await this.save();
};

// Method to mark as replied
messageSchema.methods.markAsReplied = async function(replyText) {
  this.status = 'replied';
  this.repliedAt = Date.now();
  this.replyMessage = replyText;
  await this.save();
};

// Static method to get unread count
messageSchema.statics.getUnreadCount = async function() {
  return await this.countDocuments({ status: 'new' });
};

// Static method to mark spam
messageSchema.methods.markAsSpam = async function() {
  this.isSpam = true;
  this.status = 'archived';
  await this.save();
};

module.exports = mongoose.model('Message', messageSchema);
