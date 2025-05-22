const mongoose = require('mongoose');
const CalendarEvent = require('../models/Calendar');

exports.createCalendarEvent = async (req, res) => {
  try {
    const { title, description, date, type, relatedId, relatedType, recipients, recipientType } = req.body;

    if (!title || !date || !type) {
      return res.status(400).json({ message: 'Title, date, and type are required' });
    }

    if (!['exam', 'assessment', 'event', 'class'].includes(type)) {
      return res.status(400).json({ message: 'Invalid event type' });
    }

    if (relatedId && !mongoose.isValidObjectId(relatedId)) {
      return res.status(400).json({ message: 'Invalid related ID' });
    }
    if (relatedType && !['Exam', 'Assessment', 'Course'].includes(relatedType)) {
      return res.status(400).json({ message: 'Invalid related type' });
    }
    if (relatedId && !relatedType || !relatedId && relatedType) {
      return res.status(400).json({ message: 'Both relatedId and relatedType must be provided together' });
    }

    if (recipients && !recipients.every(id => mongoose.isValidObjectId(id))) {
      return res.status(400).json({ message: 'Invalid recipient ID(s)' });
    }
    if (recipientType && !['Student', 'Instructor'].includes(recipientType)) {
      return res.status(400).json({ message: 'Invalid recipient type' });
    }
    if (recipients && !recipientType || !recipients && recipientType) {
      return res.status(400).json({ message: 'Both recipients and recipientType must be provided together' });
    }

    if (req.user.role !== 'SuperAdmin' && req.user.role !== 'Instructor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const calendarEvent = new CalendarEvent({
      title,
      description: description || '',
      date,
      type,
      relatedId,
      relatedType,
      recipients: recipients || [],
      recipientType,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await calendarEvent.save();
    res.status(201).json({
      message: 'Calendar event created successfully',
      event: {
        id: calendarEvent._id,
        title,
        description: calendarEvent.description,
        date: calendarEvent.date,
        type,
        relatedId: calendarEvent.relatedId,
        relatedType: calendarEvent.relatedType,
        recipients: calendarEvent.recipients,
        recipientType: calendarEvent.recipientType,
        createdAt: calendarEvent.createdAt,
        updatedAt: calendarEvent.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating calendar event', error: error.message });
  }
};

exports.getAllCalendarEvents = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'Student') {
      query.recipients = req.user.id;
    } else if (req.user.role !== 'SuperAdmin' && req.user.role !== 'Instructor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const calendarEvents = await CalendarEvent.find(query)
      .populate('relatedId', 'title description', null, { model: function(doc) {
        return doc.relatedType;
      }})
      .populate('recipients', 'name email', null, { model: function(doc) {
        return doc.recipientType;
      }});

    res.status(200).json(calendarEvents);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching calendar events', error: error.message });
  }
};

exports.getCalendarEventById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid calendar event ID' });
    }

    const calendarEvent = await CalendarEvent.findById(req.params.id)
      .populate('relatedId', 'title description', null, { model: function(doc) {
        return doc.relatedType;
      }})
      .populate('recipients', 'name email', null, { model: function(doc) {
        return doc.recipientType;
      }});

    if (!calendarEvent) {
      return res.status(404).json({ message: 'Calendar event not found' });
    }

    if (req.user.role === 'Student' && !calendarEvent.recipients.includes(req.user.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (req.user.role !== 'SuperAdmin' && req.user.role !== 'Instructor' && req.user.role !== 'Student') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.status(200).json(calendarEvent);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching calendar event', error: error.message });
  }
};

exports.updateCalendarEvent = async (req, res) => {
  try {
    const { title, description, date, type, relatedId, relatedType, recipients, recipientType } = req.body;

    if (!title || !date || !type) {
      return res.status(400).json({ message: 'Title, date, and type are required' });
    }

    if (!['exam', 'assessment', 'event', 'class'].includes(type)) {
      return res.status(400).json({ message: 'Invalid event type' });
    }

    if (relatedId && !mongoose.isValidObjectId(relatedId)) {
      return res.status(400).json({ message: 'Invalid related ID' });
    }
    if (relatedType && !['Exam', 'Assessment', 'Course'].includes(relatedType)) {
      return res.status(400).json({ message: 'Invalid related type' });
    }
    if (relatedId && !relatedType || !relatedId && relatedType) {
      return res.status(400).json({ message: 'Both relatedId and relatedType must be provided together' });
    }

    if (recipients && !recipients.every(id => mongoose.isValidObjectId(id))) {
      return res.status(400).json({ message: 'Invalid recipient ID(s)' });
    }
    if (recipientType && !['Student', 'Instructor'].includes(recipientType)) {
      return res.status(400).json({ message: 'Invalid recipient type' });
    }
    if (recipients && !recipientType || !recipients && recipientType) {
      return res.status(400).json({ message: 'Both recipients and recipientType must be provided together' });
    }

    if (req.user.role !== 'SuperAdmin' && req.user.role !== 'Instructor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid calendar event ID' });
    }

    const calendarEvent = await CalendarEvent.findById(req.params.id);
    if (!calendarEvent) {
      return res.status(404).json({ message: 'Calendar event not found' });
    }

    const updateData = {
      title: title || undefined,
      description: description || undefined,
      date: date || undefined,
      type: type || undefined,
      relatedId: relatedId || undefined,
      relatedType: relatedType || undefined,
      recipients: recipients || undefined,
      recipientType: recipientType || undefined,
      updatedAt: new Date()
    };

    Object.assign(calendarEvent, updateData);
    await calendarEvent.save();

    res.status(200).json({
      message: 'Calendar event updated successfully',
      event: {
        id: calendarEvent._id,
        title: calendarEvent.title,
        description: calendarEvent.description,
        date: calendarEvent.date,
        type: calendarEvent.type,
        relatedId: calendarEvent.relatedId,
        relatedType: calendarEvent.relatedType,
        recipients: calendarEvent.recipients,
        recipientType: calendarEvent.recipientType,
        createdAt: calendarEvent.createdAt,
        updatedAt: calendarEvent.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating calendar event', error: error.message });
  }
};

exports.deleteCalendarEvent = async (req, res) => {
  try {
    if (req.user.role !== 'SuperAdmin' && req.user.role !== 'Instructor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid calendar event ID' });
    }

    const calendarEvent = await CalendarEvent.findByIdAndDelete(req.params.id);
    if (!calendarEvent) {
      return res.status(404).json({ message: 'Calendar event not found' });
    }

    res.status(200).json({ message: 'Calendar event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting calendar event', error: error.message });
  }
};

exports.filterCalendarEvents = async (req, res) => {
  try {
    const { startDate, endDate, type, recipient } = req.query;
    const query = {};

    if (req.user.role === 'Student') {
      query.recipients = req.user.id;
    } else if (req.user.role !== 'SuperAdmin' && req.user.role !== 'Instructor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    if (type && ['exam', 'assessment', 'event', 'class'].includes(type)) {
      query.type = type;
    } else if (type) {
      return res.status(400).json({ message: 'Invalid event type' });
    }


    if (recipient) {
      if (!mongoose.isValidObjectId(recipient)) {
        return res.status(400).json({ message: 'Invalid recipient ID' });
      }
      query.recipients = recipient;
    }

    const calendarEvents = await CalendarEvent.find(query)
      .populate('relatedId', 'title description', null, { model: function(doc) {
        return doc.relatedType;
      }})
      .populate('recipients', 'name email', null, { model: function(doc) {
        return doc.recipientType;
      }});

    res.status(200).json(calendarEvents);
  } catch (error) {
    res.status(500).json({ message: 'Error filtering calendar events', error: error.message });
  }
};