const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getFeaturedProjects,
  getProjectsByCategory,
  searchProjects,
  incrementProjectViews,
  likeProject,
  getGithubRepos
} = require('../controllers/projectController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { validate, sanitizeInput } = require('../middleware/validator');

// Validation rules
const projectValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
  body('thumbnail')
    .notEmpty().withMessage('Thumbnail is required')
    .isURL().withMessage('Thumbnail must be a valid URL'),
  body('technologies')
    .isArray({ min: 1 }).withMessage('At least one technology is required'),
  body('category')
    .notEmpty().withMessage('Category is required')
    .isIn(['Web Development', 'Mobile App', 'UI/UX Design', 'Full Stack', 'Frontend', 'Backend', 'Other'])
    .withMessage('Invalid category')
];

// Public routes
router.get('/', optionalAuth, getAllProjects);
router.get('/featured', getFeaturedProjects);
router.get('/category/:category', getProjectsByCategory);
router.get('/search', searchProjects);
router.get('/github-repos', getGithubRepos);
router.get('/:id', optionalAuth, getProjectById);
router.post('/:id/view', incrementProjectViews);
router.post('/:id/like', likeProject);

// Protected routes (admin only)
router.use(protect);
router.use(authorize('admin'));

router.post('/', sanitizeInput, projectValidation, validate, createProject);
router.put('/:id', sanitizeInput, projectValidation, validate, updateProject);
router.delete('/:id', deleteProject);

module.exports = router;
