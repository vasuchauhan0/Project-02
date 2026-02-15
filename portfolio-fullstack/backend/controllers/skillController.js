const Skill = require('../models/Skill');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all skills
// @route   GET /api/skills
// @access  Public
exports.getSkills = async (req, res, next) => {
  try {
    const { category, isActive } = req.query;
    
    let query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }
    
    const skills = await Skill.find(query)
      .populate('createdBy', 'name email')
      .sort({ order: 1, createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: skills.length,
      data: skills
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single skill
// @route   GET /api/skills/:id
// @access  Public
exports.getSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('projects', 'title thumbnail');
    
    if (!skill) {
      return next(new ErrorResponse(`Skill not found with id of ${req.params.id}`, 404));
    }
    
    res.status(200).json({
      success: true,
      data: skill
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new skill
// @route   POST /api/skills
// @access  Private (Admin)
exports.createSkill = async (req, res, next) => {
  try {
    req.body.createdBy = req.user.id;
    
    const skill = await Skill.create(req.body);
    
    res.status(201).json({
      success: true,
      data: skill
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update skill
// @route   PUT /api/skills/:id
// @access  Private (Admin)
exports.updateSkill = async (req, res, next) => {
  try {
    let skill = await Skill.findById(req.params.id);
    
    if (!skill) {
      return next(new ErrorResponse(`Skill not found with id of ${req.params.id}`, 404));
    }
    
    skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: skill
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete skill
// @route   DELETE /api/skills/:id
// @access  Private (Admin)
exports.deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);
    
    if (!skill) {
      return next(new ErrorResponse(`Skill not found with id of ${req.params.id}`, 404));
    }
    
    await skill.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get skills by category
// @route   GET /api/skills/category/:category
// @access  Public
exports.getSkillsByCategory = async (req, res, next) => {
  try {
    const skills = await Skill.find({ 
      category: req.params.category,
      isActive: true 
    }).sort({ order: 1, proficiency: -1 });
    
    res.status(200).json({
      success: true,
      count: skills.length,
      data: skills
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk update skill orders
// @route   PUT /api/skills/reorder
// @access  Private (Admin)
exports.reorderSkills = async (req, res, next) => {
  try {
    const { skills } = req.body; // Array of { id, order }
    
    const updatePromises = skills.map(({ id, order }) => 
      Skill.findByIdAndUpdate(id, { order }, { new: true })
    );
    
    await Promise.all(updatePromises);
    
    res.status(200).json({
      success: true,
      message: 'Skills reordered successfully'
    });
  } catch (error) {
    next(error);
  }
};
