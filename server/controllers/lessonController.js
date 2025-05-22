const mongoose = require('mongoose');
const Lesson = require('../models/Lesson');
const Unit = require('../models/Unit');

exports.createLesson = async (req, res) => {
  try {
    const { title, unit, content, order } = req.body;

    if (!title || !unit || order === undefined) {
      return res.status(400).json({ message: 'Title, unit, and order are required' });
    }

    if (!mongoose.isValidObjectId(unit)) {
      return res.status(400).json({ message: 'Invalid unit ID' });
    }

    if (typeof order !== 'number' || order < 0) {
      return res.status(400).json({ message: 'Order must be a non-negative number' });
    }

    if (req.user.role !== 'SuperAdmin' && req.user.role !== 'Instructor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const unitDoc = await Unit.findById(unit);
    if (!unitDoc) {
      return res.status(404).json({ message: 'Unit not found' });
    }

    const lesson = new Lesson({
      title,
      unit,
      content: content || '',
      order,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await lesson.save();
    res.status(201).json({
      message: 'Lesson created successfully',
      lesson: {
        id: lesson._id,
        title,
        unit,
        content: lesson.content,
        order,
        createdAt: lesson.createdAt,
        updatedAt: lesson.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating lesson', error: error.message });
  }
};

exports.getAllLessons = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'Student') {
      if (!req.user.courses || !req.user.courses.length) {
        return res.status(200).json([]);
      }
      const units = await Unit.find({ course: { $in: req.user.courses } }).select('_id');
      const unitIds = units.map(unit => unit._id);
      query.unit = { $in: unitIds };
    } else if (req.user.role !== 'SuperAdmin' && req.user.role !== 'Instructor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const lessons = await Lesson.find(query)
      .populate('unit', 'title course')
      .populate({
        path: 'unit',
        populate: { path: 'course', select: 'title description' }
      });

    res.status(200).json(lessons);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lessons', error: error.message });
  }
};

exports.getLessonById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid lesson ID' });
    }

    const lesson = await Lesson.findById(req.params.id)
      .populate('unit', 'title course')
      .populate({
        path: 'unit',
        populate: { path: 'course', select: 'title description' }
      });

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    if (req.user.role === 'Student') {
      if (!req.user.courses || !req.user.courses.includes(lesson.unit.course.toString())) {
        return res.status(403).json({ message: 'Access denied' });
      }
    } else if (req.user.role !== 'SuperAdmin' && req.user.role !== 'Instructor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.status(200).json(lesson);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lesson', error: error.message });
  }
};

exports.updateLesson = async (req, res) => {
  try {
    const { title, unit, content, order } = req.body;

    if (unit && !mongoose.isValidObjectId(unit)) {
      return res.status(400).json({ message: 'Invalid unit ID' });
    }

    if (order !== undefined && (typeof order !== 'number' || order < 0)) {
      return res.status(400).json({ message: 'Order must be a non-negative number' });
    }

    if (req.user.role !== 'SuperAdmin' && req.user.role !== 'Instructor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid lesson ID' });
    }

    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    if (unit) {
      const unitDoc = await Unit.findById(unit);
      if (!unitDoc) {
        return res.status(404).json({ message: 'Unit not found' });
      }
    }

    const updateData = {
      title: title || undefined,
      unit: unit || undefined,
      content: content || undefined,
      order: order !== undefined ? order : undefined,
      updatedAt: new Date()
    };

    Object.assign(lesson, updateData);
    await lesson.save();

    res.status(200).json({
      message: 'Lesson updated successfully',
      lesson: {
        id: lesson._id,
        title: lesson.title,
        unit: lesson.unit,
        content: lesson.content,
        order: lesson.order,
        createdAt: lesson.createdAt,
        updatedAt: lesson.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating lesson', error: error.message });
  }
};

exports.deleteLesson = async (req, res) => {
  try {
    if (req.user.role !== 'SuperAdmin' && req.user.role !== 'Instructor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid lesson ID' });
    }

    const lesson = await Lesson.findByIdAndDelete(req.params.id);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    res.status(200).json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting lesson', error: error.message });
  }
};

exports.filterLessons = async (req, res) => {
  try {
    const { unit, order } = req.query;
    const query = {};

    if (req.user.role === 'Student') {
      if (!req.user.courses || !req.user.courses.length) {
        return res.status(200).json([]);
      }
      const units = await Unit.find({ course: { $in: req.user.courses } }).select('_id');
      const unitIds = units.map(unit => unit._id);
      query.unit = { $in: unitIds };
    } else if (req.user.role !== 'SuperAdmin' && req.user.role !== 'Instructor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (unit) {
      if (!mongoose.isValidObjectId(unit)) {
        return res.status(400).json({ message: 'Invalid unit ID' });
      }
      query.unit = unit;
    }

    if (order !== undefined) {
      const orderNum = Number(order);
      if (isNaN(orderNum) || orderNum < 0) {
        return res.status(400).json({ message: 'Order must be a non-negative number' });
      }
      query.order = orderNum;
    }

    const lessons = await Lesson.find(query)
      .populate('unit', 'title course')
      .populate({
        path: 'unit',
        populate: { path: 'course', select: 'title description' }
      });

    res.status(200).json(lessons);
  } catch (error) {
    res.status(500).json({ message: 'Error filtering lessons', error: error.message });
  }
};