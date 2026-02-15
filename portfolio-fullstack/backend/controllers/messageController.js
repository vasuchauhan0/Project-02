const Message = require('../models/Message');
const { sendEmail } = require('../utils/emailService');

// @desc    Get all messages
// @route   GET /api/messages
// @access  Private (Admin)
exports.getAllMessages = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      category,
      priority,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    // Build query
    const query = {};
    if (status) query.status = status;
    if (category) query.category = category;
    if (priority) query.priority = priority;
    query.isSpam = false; // Don't show spam by default

    // Execute query with pagination
    const messages = await Message.find(query)
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count
    const count = await Message.countDocuments(query);

    res.status(200).json({
      success: true,
      data: messages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get all messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching messages',
      error: error.message
    });
  }
};

// @desc    Get message by ID
// @route   GET /api/messages/:id
// @access  Private (Admin)
exports.getMessageById = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Mark as read if it's new
    if (message.status === 'new') {
      await message.markAsRead();
    }

    res.status(200).json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error('Get message error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching message',
      error: error.message
    });
  }
};

// @desc    Create new message (Contact form submission)
// @route   POST /api/messages
// @access  Public
exports.createMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message, category } = req.body;

    // Get client info
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    // Create message
    const newMessage = await Message.create({
      name,
      email,
      phone,
      subject,
      message,
      category,
      ipAddress,
      userAgent
    });

    // Send confirmation email to user
    try {
      await sendEmail({
        to: email,
        subject: 'Message Received - We\'ll Get Back to You Soon!',
        text: `Hi ${name},\n\nThank you for reaching out! We have received your message and will get back to you as soon as possible.\n\nYour message:\n${message}\n\nBest regards,\nPortfolio Team`
      });
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      // Continue even if email fails
    }

    // Send notification to admin
    try {
      await sendEmail({
        to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
        subject: `New Contact Message: ${subject}`,
        text: `New message received from ${name} (${email}):\n\n${message}\n\nCategory: ${category}\nPhone: ${phone || 'N/A'}`
      });
    } catch (emailError) {
      console.error('Error sending admin notification:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Message sent successfully! We\'ll get back to you soon.',
      data: {
        id: newMessage._id,
        name: newMessage.name,
        email: newMessage.email,
        subject: newMessage.subject
      }
    });
  } catch (error) {
    console.error('Create message error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending message. Please try again later.',
      error: error.message
    });
  }
};

// @desc    Update message status
// @route   PUT /api/messages/:id/status
// @access  Private (Admin)
exports.updateMessageStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['new', 'read', 'replied', 'archived'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Message status updated',
      data: message
    });
  } catch (error) {
    console.error('Update message status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating message status',
      error: error.message
    });
  }
};

// @desc    Reply to message
// @route   POST /api/messages/:id/reply
// @access  Private (Admin)
exports.replyToMessage = async (req, res) => {
  try {
    const { replyMessage } = req.body;

    if (!replyMessage) {
      return res.status(400).json({
        success: false,
        message: 'Reply message is required'
      });
    }

    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Send reply email
    try {
      await sendEmail({
        to: message.email,
        subject: `Re: ${message.subject}`,
        text: `Hi ${message.name},\n\n${replyMessage}\n\nBest regards,\nPortfolio Team`
      });

      // Update message
      await message.markAsReplied(replyMessage);

      res.status(200).json({
        success: true,
        message: 'Reply sent successfully',
        data: message
      });
    } catch (emailError) {
      console.error('Error sending reply email:', emailError);
      return res.status(500).json({
        success: false,
        message: 'Error sending reply email'
      });
    }
  } catch (error) {
    console.error('Reply to message error:', error);
    res.status(500).json({
      success: false,
      message: 'Error replying to message',
      error: error.message
    });
  }
};

// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Private (Admin)
exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting message',
      error: error.message
    });
  }
};

// @desc    Get unread messages count
// @route   GET /api/messages/unread-count
// @access  Private (Admin)
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Message.getUnreadCount();

    res.status(200).json({
      success: true,
      data: { count }
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching unread count',
      error: error.message
    });
  }
};

// @desc    Mark message as spam
// @route   POST /api/messages/:id/spam
// @access  Private (Admin)
exports.markAsSpam = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    await message.markAsSpam();

    res.status(200).json({
      success: true,
      message: 'Message marked as spam'
    });
  } catch (error) {
    console.error('Mark as spam error:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking message as spam',
      error: error.message
    });
  }
};
