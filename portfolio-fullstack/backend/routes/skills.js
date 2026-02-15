const express = require('express');
const router = express.Router();
const {
  getSkills,
  getSkill,
  createSkill,
  updateSkill,
  deleteSkill,
  getSkillsByCategory,
  reorderSkills
} = require('../controllers/skillController');

const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getSkills);
router.get('/category/:category', getSkillsByCategory);
router.get('/:id', getSkill);

// Protected routes (Admin only)
router.post('/', protect, authorize('admin'), createSkill);
router.put('/reorder', protect, authorize('admin'), reorderSkills);
router.put('/:id', protect, authorize('admin'), updateSkill);
router.delete('/:id', protect, authorize('admin'), deleteSkill);

module.exports = router;
