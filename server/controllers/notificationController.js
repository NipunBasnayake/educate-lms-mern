const Notification = require('../models/Notification');
const Instructor = require('../models/Instructor');

// Create a new notification
exports.createNotification = async (req, res) => {
  try {
    const { recipient, recipientType, message, type } = req.body;

    // Restrict creation to SuperAdmin or Instructor
    if (req.user.role !== 'SuperAdmin' && req.user.role !== 'Instructor') {
      return res.status(403).json({ message: 'Only SuperAdmin or Instructor can create notifications' });
    }

    // Ensure recipientType is valid
    if (!['Student', 'Instructor', 'SuperAdmin'].includes(recipientType)) {
      return res.status(400).json({ message: 'Invalid recipient type' });
    }

    // Ensure notification type is valid
    if (!['announcement', 'grade', 'deadline', 'message'].includes(type)) {
      return res.status(400).json({ message: 'Invalid notification type' });
    }

    const notification = new Notification({
      recipient,
      recipientType,
      message,
      type
    });

    await notification.save();

    // If recipient is Instructor, update their notifications array
    if (recipientType === 'Instructor') {
      const instructor = await Instructor.findById(recipient);
      if (instructor) {
        instructor.notifications.push(notification._id);
        await instructor.save();
      }
    }

    res.status(201).json({ message: 'Notification created successfully', notification });
  } catch (error) {
    res.status(500).json({ message: 'Error creating notification', error: error.message });
  }
};

// Get all notifications for the authenticated user
exports.getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipient: req.user.id,
      recipientType: req.user.role
    }).sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
};

// Get all notifications (SuperAdmin only)
exports.getAllNotifications = async (req, res) => {
  try {
    if (req.user.role !== 'SuperAdmin') {
      return res.status(403).json({ message: 'Only SuperAdmin can view all notifications' });
    }

    const notifications = await Notification.find()
      .populate('recipient', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
};

// Get notification by ID
exports.getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id)
      .populate('recipient', 'name email');

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Ensure user is the recipient or SuperAdmin
    if (req.user.role !== 'SuperAdmin' && notification.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this notification' });
    }

    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notification', error: error.message });
  }
};

// Mark notification as read
exports.markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Ensure user is the recipient or SuperAdmin
    if (req.user.role !== 'SuperAdmin' && notification.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this notification' });
    }

    notification.read = true;
    await notification.save();

    res.status(200).json({ message: 'Notification marked as read', notification });
  } catch (error) {
    res.status(500).json({ message: 'Error updating notification', error: error.message });
  }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Ensure user is the recipient or SuperAdmin
    if (req.user.role !== 'SuperAdmin' && notification.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this notification' });
    }

    // Remove notification from Instructor's notifications array if applicable
    if (notification.recipientType === 'Instructor') {
      const instructor = await Instructor.findById(notification.recipient);
      if (instructor) {
        instructor.notifications.pull(notification._id);
        await instructor.save();
      }
    }

    await notification.deleteOne();

    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting notification', error: error.message });
  }
};