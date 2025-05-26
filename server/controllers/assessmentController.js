const Assessment = require('../models/Assessment');
const Unit = require('../models/Unit');
const Course = require('../models/Course');
const mongoose = require('mongoose');

// Create a new assessment
exports.createAssessment = async (req, res) => {
  try {
    const { title, unit, course, description, dueDate, maxScore } = req.body;

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

    const assessment = new Assessment({
      title,
      unit,
      course,
      description,
      dueDate,
      maxScore,
      createdBy: req.user.id,
      updatedBy: req.user.id
    });

    await assessment.save();

    // Update unit's assessments array
    await Unit.findByIdAndUpdate(unit, { $push: { assessments: assessment._id } });

    res.status(201).json({ success: true, data: assessment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating assessment', error: error.message });
  }
};

// Get all assessments (with optional unit or course filter)
exports.getAssessments = async (req, res) => {
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

    const assessments = await Assessment.find(query)
      .populate('unit', 'title')
      .populate('course', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: assessments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching assessments', error: error.message });
  }
};

// Get assessment by ID
exports.getAssessmentById = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id)
      .populate('unit', 'title')
      .populate('course', 'title');

    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }

    res.status(200).json({ success: true, data: assessment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching assessment', error: error.message });
  }
};

// Update assessment
exports.updateAssessment = async (req, res) => {
  try {
    const { title, unit, course, description, dueDate, maxScore } = req.body;

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
      ...(dueDate && { dueDate }),
      ...(maxScore && { maxScore }),
      updatedBy: req.user.id,
      updatedAt: Date.now()
    };

    const assessment = await Assessment.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }

    // If unit is updated, update the assessments array in both old and new units
    if (unit && unit !== assessment.unit.toString()) {
      await Unit.findByIdAndUpdate(assessment.unit, { $pull: { assessments: assessment._id } });
      await Unit.findByIdAndUpdate(unit, { $push: { assessments: assessment._id } });
    }

    res.status(200).json({ success: true, data: assessment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating assessment', error: error.message });
  }
};

// Delete assessment
exports.deleteAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);

    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }

    // Remove assessment reference from unit
    await Unit.findByIdAndUpdate(assessment.unit, { $pull: { assessments: assessment._id } });

    await assessment.deleteOne();

    res.status(200).json({ success: true, message: 'Assessment deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting assessment', error: error.message });
  }
};