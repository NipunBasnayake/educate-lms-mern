const Exam = require('../models/Exam');
const Unit = require('../models/Unit');
const Course = require('../models/Course');
const mongoose = require('mongoose');

// Create a new exam
exports.createExam = async (req, res) => {
  try {
    const { title, unit, course, description, date, maxScore } = req.body;

    // Validate required fields
    if (!title || !unit || !course || !maxScore) {
      return res.status(400).json({ success: false, message: 'Title, unit, course, and maxScore are required' });
    }

    // Validate unit and course exist
    const unitExists = await Unit.findById(unit);
    if (!unitExists) {
      return res.status(404).json({ success: false, message: 'Unit not found' });
    }

    const courseExists = await Course.findById(course);
    if (!courseExists) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Validate that unit belongs to the course
    if (unitExists.course.toString() !== course) {
      return res.status(400).json({ success: false, message: 'Unit does not belong to the specified course' });
    }

    const exam = new Exam({
      title,
      unit,
      course,
      description,
      date,
      maxScore,
      createdBy: req.user.id,
      updatedBy: req.user.id
    });

    await exam.save();

    // Update unit's exams array
    await Unit.findByIdAndUpdate(unit, { $push: { exams: exam._id } });

    res.status(201).json({ success: true, data: exam });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating exam', error: error.message });
  }
};

// Get all exams (with optional unit or course filter)
exports.getExams = async (req, res) => {
  try {
    const { unitId, courseId } = req.query;
    let query = {};

    if (unitId) {
      if (!mongoose.Types.ObjectId.isValid(unitId)) {
        return res.status(400).json({ success: false, message: 'Invalid unit ID' });
      }
      query.unit = unitId;
    }

    if (courseId) {
      if (!mongoose.Types.ObjectId.isValid(courseId)) {
        return res.status(400).json({ success: false, message: 'Invalid course ID' });
      }
      query.course = courseId;
    }

    const exams = await Exam.find(query)
      .populate('unit', 'title')
      .populate('course', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: exams });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching exams', error: error.message });
  }
};

// Get exam by ID
exports.getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id)
      .populate('unit', 'title')
      .populate('course', 'title');

    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }

    res.status(200).json({ success: true, data: exam });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching exam', error: error.message });
  }
};

// Update exam
exports.updateExam = async (req, res) => {
  try {
    const { title, unit, course, description, date, maxScore } = req.body;

    // Validate unit and course if provided
    if (unit) {
      const unitExists = await Unit.findById(unit);
      if (!unitExists) {
        return res.status(404).json({ success: false, message: 'Unit not found' });
      }
    }

    if (course) {
      const courseExists = await Course.findById(course);
      if (!courseExists) {
        return res.status(404).json({ success: false, message: 'Course not found' });
      }
    }

    // If both unit and course are provided, validate they match
    if (unit && course) {
      const unitDoc = await Unit.findById(unit);
      if (unitDoc.course.toString() !== course) {
        return res.status(400).json({ success: false, message: 'Unit does not belong to the specified course' });
      }
    }

    const updateData = {
      ...(title && { title }),
      ...(unit && { unit }),
      ...(course && { course }),
      ...(description && { description }),
      ...(date && { date }),
      ...(maxScore && { maxScore }),
      updatedBy: req.user.id,
      updatedAt: Date.now()
    };

    const exam = await Exam.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }

    // If unit is updated, update the exams array in both old and new units
    if (unit && unit !== exam.unit.toString()) {
      await Unit.findByIdAndUpdate(exam.unit, { $pull: { exams: exam._id } });
      await Unit.findByIdAndUpdate(unit, { $push: { exams: exam._id } });
    }

    res.status(200).json({ success: true, data: exam });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating exam', error: error.message });
  }
};

// Delete exam
exports.deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }

    // Remove exam reference from unit
    await Unit.findByIdAndUpdate(exam.unit, { $pull: { exams: exam._id } });

    await exam.deleteOne();

    res.status(200).json({ success: true, message: 'Exam deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting exam', error: error.message });
  }
};