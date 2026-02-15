const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getAllMessages,
  getMessageById,
  createMessage,
  updateMessageStatus,
  deleteMessage,
  replyToMessage,
  getUnreadCount,
  markAsSpam
} = require('../controllers/messageController');
const { protect, authorize } = require('../middleware/auth');
const { validate, sanitizeInput } = require('../middleware/validator');

// Validation rules
const messageValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 50 }).withMessage('Name cannot exceed 50 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('subject')
    .trim()
    .notEmpty().withMessage('Subject is required')
    .isLength({ max: 100 }).withMessage('Subject cannot exceed 100 characters'),
  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ max: 2000 }).withMessage('Message cannot exceed 2000 characters')
];

// Public routes
router.post('/', sanitizeInput, messageValidation, validate, createMessage);

// Protected routes (admin only)
router.use(protect);
router.use(authorize('admin'));

router.get('/', getAllMessages);
router.get('/unread-count', getUnreadCount);
router.get('/:id', getMessageById);
router.put('/:id/status', updateMessageStatus);
router.post('/:id/reply', replyToMessage);
router.post('/:id/spam', markAsSpam);
router.delete('/:id', deleteMessage);

module.exports = router;
