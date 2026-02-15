const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a skill name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  category: {
    type: String,
    required: [true, 'Please provide a skill category'],
    enum: ['Frontend', 'Backend', 'Database', 'Tools & Technologies', 'Design', 'Soft Skills', 'Other'],
    default: 'Other'
  },
  proficiency: {
    type: Number,
    required: [true, 'Please provide proficiency level'],
    min: [0, 'Proficiency cannot be less than 0'],
    max: [100, 'Proficiency cannot be more than 100'],
    default: 50
  },
  icon: {
    type: String,
    trim: true
  },
  color: {
    type: String,
    default: '#3B82F6'
  },
  yearsOfExperience: {
    type: Number,
    min: 0,
    default: 0
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  projects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for sorting and filtering
skillSchema.index({ category: 1, order: 1 });
skillSchema.index({ isActive: 1 });

module.exports = mongoose.model('Skill', skillSchema);
