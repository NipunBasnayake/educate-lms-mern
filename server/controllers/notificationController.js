const Notification = require('../models/Notification');
const mongoose = require('mongoose');

// Create a new notification
exports.createNotification = async (req, res) => {
  try {
    const { recipient, recipientType, message, type } = req.body;

    // Validate required fields
    if (!recipient || !recipientType || !message || !type) {
      return res.status(400).json({ success: false, message: 'Recipient, recipientType, message, and type are required' });
    }

    // Validate recipientType
    if (!['Student', 'Instructor', 'SuperAdmin'].includes(recipientType)) {
      return res.status(400).json({ success: false, message: 'Invalid recipientType' });
    }

    // Validate type
    if (!['announcement', 'grade', 'deadline', 'message'].includes(type)) {
      return res.status(400).json({ success: false, message: 'Invalid notification type' });
    }

    // Restrict creation to Instructors and SuperAdmins
    if (!['Instructor', 'SuperAdmin'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Only Instructors and SuperAdmins can create notifications' });
    }

    // Validate recipient ObjectId
    if (!mongoose.Types.ObjectId.isValid(recipient)) {
      return res.status(400).json({ success: false, message: 'Invalid recipient ID' });
    }

    const notification = new Notification({
      recipient,
      recipientType,
      message,
      type,
      createdBy: req.user.id
    });

    await notification.save();

    res.status(201).json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating notification', error: error.message });
  }
};

// Get all notifications (with optional filters)
exports.getNotifications = async (req, res) => {
  try {
    const { recipientId, type, read } = req.query;
    let query = {};

    if (recipientId) {
      if (!mongoose.Types.ObjectId.isValid(recipientId)) {
        return res.status(400).json({ success: false, message: 'Invalid recipient ID' });
      }
      query.recipient = recipientId;
    }

    if (type) {
      if (!['announcement', 'grade', 'deadline', 'message'].includes(type)) {
        return res.status(400).json({ success: false, message: 'Invalid notification type' });
      }
      query.type = type;
    }

    if (read !== undefined) {
      query.read = read === 'true';
    }

    // Restrict students and instructors to only see their own notifications
    if (['Student', 'Instructor'].includes(req.user.role)) {
      query.recipient = req.user.id;
      query.recipientType = req.user.role;
    }

    const notifications = await Notification.find(query)
      .populate('recipient', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching notifications', error: error.message });
  }
};

// Get notification by ID
exports.getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id)
      .populate('recipient', 'name');

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    // Restrict students and instructors to only see their own notifications
    if (['Student', 'Instructor'].includes(req.user.role) && notification.recipient.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching notification', error: error.message });
  }
};

// Update notification (e.g., mark as read)
exports.updateNotification = async (req, res) => {
  try {
    const { read, message, type } = req.body;

    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    // Restrict students and instructors to only updating their own notifications
    if (['Student', 'Instructor'].includes(req.user.role) && notification.recipient.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    // Restrict students and instructors to only updating the read status
    if (['Student', 'Instructor'].includes(req.user.role) && (message || type)) {
      return res.status(403).json({ success: false, message: 'Students and Instructors can only update read status' });
    }

    // Validate type if provided
    if (type && !['announcement', 'grade', 'deadline', 'message'].includes(type)) {
      return res.status(400).json({ success: false, message: 'Invalid notification type' });
    }

    const updateData = {
      ...(read !== undefined && { read }),
      ...(message && { message }),
      ...(type && { type }),
      updatedBy: req.user.id,
      updatedAt: Date.now()
    };

    const updatedNotification = await Notification.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .populate('recipient', 'name');

    res.status(200).json({ success: true, data: updatedNotification });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating notification', error: error.message });
  }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    // Restrict students and instructors to only deleting their own notifications
    if (['Student', 'Instructor'].includes(req.user.role) && notification.recipient.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    await notification.deleteOne();

    res.status(200).json({ success: true, message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting notification', error: error.message });
  }
};