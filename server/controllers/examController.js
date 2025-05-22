const mongoose = require('mongoose');
const Exam = require('../models/Exam');

exports.createExam = async (req, res) => {
  try {
    const { title, unit, course, description, date, maxScore } = req.body;

    if (!title || !unit || !course || !maxScore) {
      return res.status(400).json({ message: 'Title, unit, course, and maxScore are required' });
    }

    if (!mongoose.isValidObjectId(unit)) {
      return res.status(400).json({ message: 'Invalid unit ID' });
    }
    if (!mongoose.isValidObjectId(course)) {
      return res.status(400).json({ message: 'Invalid course ID' });
    }

    if (typeof maxScore !== 'number' || maxScore <= 0) {
      return res.status(400).json({ message: 'maxScore must be a positive number' });
    }

    if (date && isNaN(new Date(date).getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    if (req.user.role !== 'SuperAdmin' && req.user.role !== 'Instructor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const exam = new Exam({
      title,
      unit,
      course,
      description: description || '',
      date: date || undefined,
      maxScore,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await exam.save();
    res.status(201).json({
      message: 'Exam created successfully',
      exam: {
        id: exam._id,
        title,
        unit,
        course,
        description: exam.description,
        date: exam.date,
        maxScore,
        createdAt: exam.createdAt,
        updatedAt: exam.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating exam', error: error.message });
  }
};

exports.getAllExams = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'Student') {
      if (!req.user.courses || !req.user.courses.length) {
        return res.status(200).json([]);
      }
      query.course = { $in: req.user.courses };
    } else if (req.user.role !== 'SuperAdmin' && req.user.role !== 'Instructor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const exams = await Exam.find(query)
      .populate('unit', 'title order')
      .populate('course', 'title description');

    res.status(200).json(exams);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching exams', error: error.message });
  }
};

exports.getExamById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid exam ID' });
    }

    const exam = await Exam.findById(req.params.id)
      .populate('unit', 'title order')
      .populate('course', 'title description');

    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    if (req.user.role === 'Student') {
      if (!req.user.courses || !req.user.courses.includes(exam.course.toString())) {
        return res.status(403).json({ message: 'Access denied' });
      }
    } else if (req.user.role !== 'SuperAdmin' && req.user.role !== 'Instructor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.status(200).json(exam);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching exam', error: error.message });
  }
};

exports.updateExam = async (req, res) => {
  try {
    const { title, unit, course, description, date, maxScore } = req.body;

    if (unit && !mongoose.isValidObjectId(unit)) {
      return res.status(400).json({ message: 'Invalid unit ID' });
    }
    if (course && !mongoose.isValidObjectId(course)) {
      return res.status(400).json({ message: 'Invalid course ID' });
    }

    if (maxScore !== undefined && (typeof maxScore !== 'number' || maxScore <= 0)) {
      return res.status(400).json({ message: 'maxScore must be a positive number' });
    }

    if (date && isNaN(new Date(date).getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    if (req.user.role !== 'SuperAdmin' && req.user.role !== 'Instructor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid exam ID' });
    }

    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    const updateData = {
      title: title || undefined,
      unit: unit || undefined,
      course: course || undefined,
      description: description || undefined,
      date: date || undefined,
      maxScore: maxScore || undefined,
      updatedAt: new Date()
    };

    Object.assign(exam, updateData);
    await exam.save();

    res.status(200).json({
      message: 'Exam updated successfully',
      exam: {
        id: exam._id,
        title: exam.title,
        unit: exam.unit,
        course: exam.course,
        description: exam.description,
        date: exam.date,
        maxScore: exam.maxScore,
        createdAt: exam.createdAt,
        updatedAt: exam.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating exam', error: error.message });
  }
};

exports.deleteExam = async (req, res) => {
  try {
    if (req.user.role !== 'SuperAdmin' && req.user.role !== 'Instructor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid exam ID' });
    }

    const exam = await Exam.findByIdAndDelete(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    res.status(200).json({ message: 'Exam deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting exam', error: error.message });
  }
};

exports.filterExams = async (req, res) => {
  try {
    const { unit, course, startDate, endDate } = req.query;
    const query = {};

    if (req.user.role === 'Student') {
      if (!req.user.courses || !req.user.courses.length) {
        return res.status(200).json([]);
      }
      query.course = { $in: req.user.courses };
    } else if (req.user.role !== 'SuperAdmin' && req.user.role !== 'Instructor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (unit) {
      if (!mongoose.isValidObjectId(unit)) {
        return res.status(400).json({ message: 'Invalid unit ID' });
      }
      query.unit = unit;
    }

    if (course) {
      if (!mongoose.isValidObjectId(course)) {
        return res.status(400).json({ message: 'Invalid course ID' });
      }
      query.course = course;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        if (isNaN(new Date(startDate).getTime())) {
          return res.status(400).json({ message: 'Invalid startDate format' });
        }
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        if (isNaN(new Date(endDate).getTime())) {
          return res.status(400).json({ message: 'Invalid endDate format' });
        }
        query.date.$lte = new Date(endDate);
      }
    }

    const exams = await Exam.find(query)
      .populate('unit', 'title order')
      .populate('course', 'title description');

    res.status(200).json(exams);
  } catch (error) {
    res.status(500).json({ message: 'Error filtering exams', error: error.message });
  }
};