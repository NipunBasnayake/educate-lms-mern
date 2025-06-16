const Quiz = require('../models/Quiz');
const Unit = require('../models/Unit');
const mongoose = require('mongoose');

// Create a new quiz
exports.createQuiz = async (req, res) => {
  try {
    const { question, options, answer, unit } = req.body;

    // Validate required fields
    if (!question || !options || answer === undefined || !unit) {
      return res.status(400).json({ success: false, message: 'Question, options, answer, and unit are required' });
    }

    // Validate unit exists
    const unitExists = await Unit.findById(unit);
    if (!unitExists) {
      return res.status(404).json({ success: false, message: 'Unit not found' });
    }

    // Validate options array and answer index
    if (!Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ success: false, message: 'Options must be an array with at least 2 items' });
    }
    if (!Number.isInteger(answer) || answer < 0 || answer >= options.length) {
      return res.status(400).json({ success: false, message: 'Answer must be a valid index of the options array' });
    }

    // Create quiz
    const quiz = new Quiz({
      question,
      options,
      answer,
      unit,
    });

    // Save quiz
    const response =  await quiz.save();
    console.log(response);
    // Add quiz to unit's quizzes array
    const response1 =   await Unit.findByIdAndUpdate(unit, { $push: { quizzes: quiz._id } });
    console.log(response1);
    
    res.status(201).json({ success: true, data: quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating quiz', error: error.message });
  }
};

// Get quizzes (with optional unit filter)
exports.getQuizzes = async (req, res) => {
  try {
    const { unitId } = req.query;
    let query = {};

    // Filter by unitId if provided
    if (unitId) {
      if (!mongoose.Types.ObjectId.isValid(unitId)) {
        return res.status(400).json({ success: false, message: 'Invalid unit ID' });
      }
      query.unit = unitId;
    }

    // Fetch quizzes with populated unit
    const quizzes = await Quiz.find(query)
      .populate('unit', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: quizzes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching quizzes', error: error.message });
  }
};

// Get a single quiz by ID
exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('unit', 'title');

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    res.status(200).json({ success: true, data: quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching quiz', error: error.message });
  }
};

// Update a quiz
exports.updateQuiz = async (req, res) => {
  try {
    const { question, options, answer, unit } = req.body;

    // Validate unit if provided
    if (unit) {
      const unitExists = await Unit.findById(unit);
      if (!unitExists) {
        return res.status(404).json({ success: false, message: 'Unit not found' });
      }
    }

    // Validate options and answer if provided
    if (options) {
      if (!Array.isArray(options) || options.length < 2) {
        return res.status(400).json({ success: false, message: 'Options must be an array with at least 2 items' });
      }
    }
    if (answer !== undefined) {
      if (!Number.isInteger(answer) || answer < 0 || (options && answer >= options.length)) {
        return res.status(400).json({ success: false, message: 'Answer must be a valid index of the options array' });
      }
    }

    // Prepare update data
    const updateData = {
      ...(question && { question }),
      ...(options && { options }),
      ...(answer !== undefined && { answer }),
      ...(unit && { unit }),
      // updatedBy: req.user.id, // Uncomment if you add updatedBy to QuizSchema
      updatedAt: Date.now()
    };

    // Update quiz
    const quiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    // Update unit references if unit has changed
    if (unit && unit !== quiz.unit.toString()) {
      await Unit.findByIdAndUpdate(quiz.unit, { $pull: { quizzes: quiz._id } });
      await Unit.findByIdAndUpdate(unit, { $push: { quizzes: quiz._id } });
    }

    res.status(200).json({ success: true, data: quiz });
  } catch (error) {

    res.status(500).json({ success: false, message: 'Error updating quiz', error: error.message });
  }
};

// Delete a quiz
exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    // Remove quiz from unit's quizzes array
    await Unit.findByIdAndUpdate(quiz.unit, { $pull: { quizzes: quiz._id } });

    // Delete quiz
    await quiz.deleteOne();

    res.status(200).json({ success: true, message: 'Quiz deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting quiz', error: error.message });
  }
};