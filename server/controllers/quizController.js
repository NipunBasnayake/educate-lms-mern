const Quiz = require('../models/Quiz');
const Unit = require('../models/Unit');
const mongoose = require('mongoose');

// Create a new quiz
exports.createQuiz = async (req, res) => {
  try {
    const { question, options, answer, unit, mark } = req.body;

    // Validate required fields
    if (!question || !options || answer === undefined || !unit || mark === undefined) {
      return res.status(400).json({ success: false, message: 'Question, options, answer, unit, and mark are required' });
    }

    // Validate unit exists
    if (!mongoose.Types.ObjectId.isValid(unit)) {
      return res.status(400).json({ success: false, message: 'Invalid unit ID' });
    }
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

    // Check for unique question
    const existingQuiz = await Quiz.findOne({ question });
    if (existingQuiz) {
      return res.status(400).json({ success: false, message: 'Question must be unique' });
    }

    // Create quiz
    const quiz = new Quiz({
      question,
      options,
      answer,
      unit,
      mark,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Save quiz
    const response = await quiz.save();

    // Add quiz to unit's quizzes array
    await Unit.findByIdAndUpdate(unit, { $push: { quizzes: quiz._id } });

    res.status(201).json({ success: true, data: quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating quiz', error: error.message });
  }
};

// Get quizzes by unit ID from path parameter
exports.getQuizzes = async (req, res) => {
  try {
    const { id: unitId } = req.params;

    // Validate unit ID
    if (!mongoose.Types.ObjectId.isValid(unitId)) {
      return res.status(400).json({ success: false, message: 'Invalid unit ID' });
    }

    // Verify unit exists
    const unitExists = await Unit.findById(unitId);
    if (!unitExists) {
      return res.status(404).json({ success: false, message: 'Unit not found' });
    }

    // Fetch quizzes for the specified unit
    const quizzes = await Quiz.find({ unit: unitId })
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
    const { question, options, answer, unit, mark } = req.body;

    // Validate unit if provided
    if (unit) {
      if (!mongoose.Types.ObjectId.isValid(unit)) {
        return res.status(400).json({ success: false, message: 'Invalid unit ID' });
      }
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
      const currentQuiz = await Quiz.findById(req.params.id);
      const optionArray = options || currentQuiz.options;
      if (!Number.isInteger(answer) || answer < 0 || answer >= optionArray.length) {
        return res.status(400).json({ success: false, message: 'Answer must be a valid index of the options array' });
      }
    }

    // Check for unique question if changed
    if (question) {
      const existingQuiz = await Quiz.findOne({ question, _id: { $ne: req.params.id } });
      if (existingQuiz) {
        return res.status(400).json({ success: false, message: 'Question must be unique' });
      }
    }

    // Validate mark if provided
    if (mark === undefined && !Object.keys(req.body).length) {
      return res.status(400).json({ success: false, message: 'At least one field must be provided for update' });
    }

    // Prepare update data
    const updateData = {
      ...(question && { question }),
      ...(options && { options }),
      ...(answer !== undefined && { answer }),
      ...(unit && { unit }),
      ...(mark !== undefined && { mark }),
      updatedAt: Date.now(),
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

    // Update unit reference if unit has changed
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