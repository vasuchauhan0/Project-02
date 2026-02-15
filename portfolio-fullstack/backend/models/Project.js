const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a project title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a project description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [200, 'Short description cannot be more than 200 characters']
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    public_id: String,
    alt: String
  }],
  thumbnail: {
    type: String,
    required: [true, 'Please provide a project thumbnail']
  },
  technologies: [{
    type: String,
    required: true
  }],
  category: {
    type: String,
    required: true,
    enum: ['Web Development', 'Mobile App', 'UI/UX Design', 'Full Stack', 'Frontend', 'Backend', 'Other']
  },
  tags: [{
    type: String
  }],
  liveUrl: {
    type: String,
    match: [
      /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
      'Please provide a valid URL'
    ]
  },
  githubUrl: {
    type: String,
    match: [
      /^(https?:\/\/)?(www\.)?github\.com\/[\w-]+\/[\w.-]+\/?$/,
      'Please provide a valid GitHub URL'
    ]
  },
  status: {
    type: String,
    enum: ['In Progress', 'Completed', 'On Hold', 'Archived'],
    default: 'Completed'
  },
  featured: {
    type: Boolean,
    default: false
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  clientName: {
    type: String
  },
  teamSize: {
    type: Number,
    min: 1
  },
  myRole: {
    type: String
  },
  challenges: [{
    type: String
  }],
  solutions: [{
    type: String
  }],
  results: {
    type: String
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  priority: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for search and sorting
projectSchema.index({ title: 'text', description: 'text', tags: 'text' });
projectSchema.index({ featured: -1, priority: -1, createdAt: -1 });

// Method to increment views
projectSchema.methods.incrementViews = async function() {
  this.views += 1;
  await this.save();
};

// Method to increment likes
projectSchema.methods.incrementLikes = async function() {
  this.likes += 1;
  await this.save();
};

module.exports = mongoose.model('Project', projectSchema);
