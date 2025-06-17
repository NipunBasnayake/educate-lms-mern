const Quiz = require('../models/Quiz');
const Unit = require('../models/Unit');
const mongoose = require('mongoose');

// Create a new quiz
exports.createQuiz = async (req, res) => {
  try {
    const { question, options, answer, unit, mark } = req.body;

    // Validate required fields
    if (!question || !options || answer === undefined || !unit) {
      return res.status(400).json({ success: false, message: 'Question, options, answer, and unit are required' });
    }

    // Validate unit exists (now an array)
    if (!Array.isArray(unit)) {
      return res.status(400).json({ success: false, message: 'Unit must be an array of IDs' });
    }
    const unitExists = await Unit.find({ _id: { $in: unit } });
    if (unitExists.length !== unit.length) {
      return res.status(404).json({ success: false, message: 'One or more units not found' });
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
      ...(mark !== undefined && { mark }),
    });

    // Save quiz
    const response = await quiz.save();
    console.log(response);

    // Add quiz to each unit's quizzes array
    for (const unitId of unit) {
      await Unit.findByIdAndUpdate(unitId, { $push: { quizzes: quiz._id } });
    }

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

    // Filter by unitId if provided (match any unit in the array)
    if (unitId) {
      if (!mongoose.Types.ObjectId.isValid(unitId)) {
        return res.status(400).json({ success: false, message: 'Invalid unit ID' });
      }
      query.unit = unitId;
    }

    // Fetch quizzes with populated units
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
    const { question, options, answer, unit, mark } = req.body;

    // Validate unit if provided
    if (unit) {
      if (!Array.isArray(unit)) {
        return res.status(400).json({ success: false, message: 'Unit must be an array of IDs' });
      }
      const unitExists = await Unit.find({ _id: { $in: unit } });
      if (unitExists.length !== unit.length) {
        return res.status(404).json({ success: false, message: 'One or more units not found' });
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

    // Prepare update data
    const updateData = {
      ...(question && { question }),
      ...(options && { options }),
      ...(answer !== undefined && { answer }),
      ...(unit && { unit }),
      ...(mark !== undefined && { mark }),
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
    if (unit && JSON.stringify(unit) !== JSON.stringify(quiz.unit)) {
      for (const oldUnitId of quiz.unit) {
        await Unit.findByIdAndUpdate(oldUnitId, { $pull: { quizzes: quiz._id } });
      }
      for (const newUnitId of unit) {
        await Unit.findByIdAndUpdate(newUnitId, { $push: { quizzes: quiz._id } });
      }
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

    // Remove quiz from all units' quizzes arrays
    for (const unitId of quiz.unit) {
      await Unit.findByIdAndUpdate(unitId, { $pull: { quizzes: quiz._id } });
    }

    // Delete quiz
    await quiz.deleteOne();

    res.status(200).json({ success: true, message: 'Quiz deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting quiz', error: error.message });
  }
};