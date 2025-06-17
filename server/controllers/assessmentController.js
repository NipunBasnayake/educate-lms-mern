const Assessment = require('../models/Assessment');
const Unit = require('../models/Unit');
const mongoose = require('mongoose');

exports.createAssessment = async (req, res) => {
  try {
    const { title, unit, description, dueDate, maxScore, quizlist } = req.body;

    if (!title || !unit || !maxScore) {
      return res.status(400).json({ success: false, message: 'Title, unit, and maxScore are required' });
    }

    const unitExists = await Unit.findById(unit);
    if (!unitExists) {
      return res.status(404).json({ success: false, message: 'Unit not found' });
    }

    const assessmentData = {
      title,
      unit,
      description,
      dueDate,
      maxScore,
      ...(quizlist && { quizlist: Array.isArray(quizlist) ? quizlist : [quizlist] }),
    };

    const assessment = new Assessment(assessmentData);
    await assessment.save();

    await Unit.findByIdAndUpdate(unit, { $push: { assessments: assessment._id } });

    res.status(201).json({ success: true, data: assessment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating assessment', error: error.message });
  }
};

exports.getAssessments = async (req, res) => {
  try {
    const { unitId } = req.query;
    let query = {};

    if (unitId) {
      if (!mongoose.Types.ObjectId.isValid(unitId)) {
        return res.status(400).json({ success: false, message: 'Invalid unit ID' });
      }
      query.unit = unitId;
    }

    const assessments = await Assessment.find(query)
      .populate('unit', 'title')
      .populate('quizlist', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: assessments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching assessments', error: error.message });
  }
};

exports.getAssessmentById = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id)
      .populate('unit', 'title')
      .populate('quizlist', 'title');

    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }

    res.status(200).json({ success: true, data: assessment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching assessment', error: error.message });
  }
};

exports.updateAssessment = async (req, res) => {
  try {
    const { title, unit, description, dueDate, maxScore, quizlist } = req.body;

    if (unit) {
      const unitExists = await Unit.findById(unit);
      if (!unitExists) {
        return res.status(404).json({ success: false, message: 'Unit not found' });
      }
    }

    const updateData = {
      ...(title && { title }),
      ...(unit && { unit }),
      ...(description && { description }),
      ...(dueDate && { dueDate }),
      ...(maxScore && { maxScore }),
      ...(quizlist && { quizlist: Array.isArray(quizlist) ? quizlist : [quizlist] }),
    };

    const assessment = await Assessment.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }

    if (unit && unit !== assessment.unit.toString()) {
      await Unit.findByIdAndUpdate(assessment.unit, { $pull: { assessments: assessment._id } });
      await Unit.findByIdAndUpdate(unit, { $push: { assessments: assessment._id } });
    }

    res.status(200).json({ success: true, data: assessment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating assessment', error: error.message });
  }
};

exports.deleteAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);

    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }

    await Unit.findByIdAndUpdate(assessment.unit, { $pull: { assessments: assessment._id } });

    await assessment.deleteOne();

    res.status(200).json({ success: true, message: 'Assessment deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting assessment', error: error.message });
  }
};