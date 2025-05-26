const mongoose = require('mongoose');
const Unit = require('../models/Unit');

// Custom error class for consistent error handling
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Reusable validation functions
const validateObjectId = (id, name = 'ID') => {
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, `Invalid ${name}`);
  }
};

const validateRequiredFields = (fields, data) => {
  for (const field of fields) {
    if (!data[field]) {
      throw new ApiError(400, `${field} is required`);
    }
  }
};

const validateObjectIdArray = (array, name) => {
  if (array && !array.every(id => mongoose.isValidObjectId(id))) {
    throw new ApiError(400, `Invalid ${name} ID(s)`);
  }
};

// Reusable function to find unit by ID
const findUnitById = async (id, populateOptions = []) => {
  validateObjectId(id, 'unit ID');
  const unit = await Unit.findById(id)
    .populate(populateOptions)
    .lean();
  if (!unit) {
    throw new ApiError(404, 'Unit not found');
  }
  return unit;
};

// Common populate options (removed discussions.user)
const populateOptions = [
  { path: 'course', select: 'title description' },
  { path: 'subUnits', select: 'title order' },
  { path: 'lessons', select: 'title content' },
  { path: 'assessments', select: 'title type' },
  { path: 'exams', select: 'title date' }
];

// Create a new unit
exports.createUnit = async (req, res) => {
  try {
    const { title, course, order, subUnits, lessons, assessments, exams, studyMaterials } = req.body;

    // Validate inputs
    validateRequiredFields(['title', 'course', 'order'], { title, course, order });
    validateObjectId(course, 'course ID');
    validateObjectIdArray(subUnits, 'subUnit');
    validateObjectIdArray(lessons, 'lesson');
    validateObjectIdArray(assessments, 'assessment');
    validateObjectIdArray(exams, 'exam');

    const unit = new Unit({
      title,
      course,
      order,
      subUnits: subUnits || [],
      lessons: lessons || [],
      assessments: assessments || [],
      exams: exams || [],
      studyMaterials: studyMaterials || [],
      discussions: []
    });

    await unit.save();
    return res.status(201).json({
      success: true,
      message: 'Unit created successfully',
      data: {
        id: unit._id,
        title,
        course,
        order,
        subUnits: unit.subUnits,
        lessons: unit.lessons,
        assessments: unit.assessments,
        exams: unit.exams,
        studyMaterials: unit.studyMaterials
      }
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
      error: error.message
    });
  }
};

// Get all units
exports.getAllUnits = async (req, res) => {
  try {
    const { page = 1, limit = 10, course } = req.query;
    const query = {};

    // Add course filter if provided
    if (course) {
      validateObjectId(course, 'course ID');
      query.course = course;
    }

    console.log('Query:', query, 'Page:', page, 'Limit:', limit); // Debugging log

    const units = await Unit.find(query)
      .populate(populateOptions)
      .limit(Number(limit))
      .skip((page - 1) * Number(limit))
      .sort({ order: 1 })
      .lean();

    const total = await Unit.countDocuments(query);

    console.log('Units found:', units.length, 'Total:', total); // Debugging log

    return res.status(200).json({
      success: true,
      data: units,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error in getAllUnits:', error); // Debugging log
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
      error: error.message
    });
  }
};

// Get unit by ID
exports.getUnitById = async (req, res) => {
  try {
    const unit = await findUnitById(req.params.id, populateOptions);
    return res.status(200).json({ success: true, data: unit });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
      error: error.message
    });
  }
};

// Update unit
exports.updateUnit = async (req, res) => {
  try {
    const { title, course, order, subUnits, lessons, assessments, exams, studyMaterials } = req.body;

    // Validate inputs if provided
    if (course) validateObjectId(course, 'course ID');
    validateObjectIdArray(subUnits, 'subUnit');
    validateObjectIdArray(lessons, 'lesson');
    validateObjectIdArray(assessments, 'assessment');
    validateObjectIdArray(exams, 'exam');

    const updateData = {
      ...(title && { title }),
      ...(course && { course }),
      ...(order !== undefined && { order }),
      ...(subUnits && { subUnits }),
      ...(lessons && { lessons }),
      ...(assessments && { assessments }),
      ...(exams && { exams }),
      ...(studyMaterials && { studyMaterials }),
      updatedAt: Date.now()
    };

    const unit = await Unit.findOneAndUpdate(
      { _id: req.params.id },
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();

    if (!unit) {
      throw new ApiError(404, 'Unit not found');
    }

    return res.status(200).json({
      success: true,
      message: 'Unit updated successfully',
      data: {
        id: unit._id,
        title: unit.title,
        course: unit.course,
        order: unit.order,
        subUnits: unit.subUnits,
        lessons: unit.lessons,
        assessments: unit.assessments,
        exams: unit.exams,
        studyMaterials: unit.studyMaterials
      }
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
      error: error.message
    });
  }
};

// Delete unit
exports.deleteUnit = async (req, res) => {
  try {
    const unit = await Unit.findByIdAndDelete(req.params.id);
    if (!unit) {
      throw new ApiError(404, 'Unit not found');
    }
    return res.status(200).json({
      success: true,
      message: 'Unit deleted successfully'
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
      error: error.message
    });
  }
};

// Add sub-unit
exports.addSubUnit = async (req, res) => {
  try {
    const { subUnitId } = req.body;
    validateObjectId(subUnitId, 'subUnit ID');

    const unit = await Unit.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { subUnits: subUnitId } },
      { new: true }
    ).lean();

    if (!unit) {
      throw new ApiError(404, 'Unit not found');
    }

    return res.status(200).json({
      success: true,
      message: 'Sub-unit added to unit',
      data: unit
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
      error: error.message
    });
  }
};

// Add lesson
exports.addLesson = async (req, res) => {
  try {
    const { lessonId } = req.body;
    validateObjectId(lessonId, 'lesson ID');

    const unit = await Unit.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { lessons: lessonId } },
      { new: true }
    ).lean();

    if (!unit) {
      throw new ApiError(404, 'Unit not found');
    }

    return res.status(200).json({
      success: true,
      message: 'Lesson added to unit',
      data: unit
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
      error: error.message
    });
  }
};

// Add assessment
exports.addAssessment = async (req, res) => {
  try {
    const { assessmentId } = req.body;
    validateObjectId(assessmentId, 'assessment ID');

    const unit = await Unit.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { assessments: assessmentId } },
      { new: true }
    ).lean();

    if (!unit) {
      throw new ApiError(404, 'Unit not found');
    }

    return res.status(200).json({
      success: true,
      message: 'Assessment added to unit',
      data: unit
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
      error: error.message
    });
  }
};

// Add exam
exports.addExam = async (req, res) => {
  try {
    const { examId } = req.body;
    validateObjectId(examId, 'exam ID');

    const unit = await Unit.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { exams: examId } },
      { new: true }
    ).lean();

    if (!unit) {
      throw new ApiError(404, 'Unit not found');
    }

    return res.status(200).json({
      success: true,
      message: 'Exam added to unit',
      data: unit
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
      error: error.message
    });
  }
};

// Add study material
exports.addStudyMaterial = async (req, res) => {
  try {
    const { url, title, type } = req.body;
    validateRequiredFields(['url', 'title', 'type'], { url, title, type });

    const unit = await Unit.findByIdAndUpdate(
      req.params.id,
      { $push: { studyMaterials: { url, title, type } } },
      { new: true }
    ).lean();

    if (!unit) {
      throw new ApiError(404, 'Unit not found');
    }

    return res.status(200).json({
      success: true,
      message: 'Study material added to unit',
      data: unit
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
      error: error.message
    });
  }
};

// Add discussion
exports.addDiscussion = async (req, res) => {
  try {
    const { question } = req.body;
    validateRequiredFields(['question'], { question });

    const unit = await Unit.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          discussions: {
            question,
            answers: [],
            userType: req.user.role,
            user: req.user.id
          }
        }
      },
      { new: true }
    ).lean();

    if (!unit) {
      throw new ApiError(404, 'Unit not found');
    }

    return res.status(200).json({
      success: true,
      message: 'Discussion added to unit',
      data: unit
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
      error: error.message
    });
  }
};