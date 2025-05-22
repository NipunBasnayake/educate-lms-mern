const mongoose = require('mongoose');
const Unit = require('../models/Unit');

// Create a new unit (restricted to SuperAdmin or Instructor)
exports.createUnit = async (req, res) => {
  try {
    const { title, course, order, subUnits, lessons, assessments, exams, studyMaterials } = req.body;

    // Validate required fields
    if (!title || !course || !order) {
      return res.status(400).json({ message: 'Title, course, and order are required' });
    }

    // Validate course ID
    if (!mongoose.isValidObjectId(course)) {
      return res.status(400).json({ message: 'Invalid course ID' });
    }

    // Validate array fields for valid ObjectIds
    if (subUnits && !subUnits.every(id => mongoose.isValidObjectId(id))) {
      return res.status(400).json({ message: 'Invalid subUnit ID(s)' });
    }
    if (lessons && !lessons.every(id => mongoose.isValidObjectId(id))) {
      return res.status(400).json({ message: 'Invalid lesson ID(s)' });
    }
    if (assessments && !assessments.every(id => mongoose.isValidObjectId(id))) {
      return res.status(400).json({ message: 'Invalid assessment ID(s)' });
    }
    if (exams && !exams.every(id => mongoose.isValidObjectId(id))) {
      return res.status(400).json({ message: 'Invalid exam ID(s)' });
    }

    // Check if user is SuperAdmin or Instructor
    if (req.user.role !== 'SuperAdmin' && req.user.role !== 'Instructor') {
      return res.status(403).json({ message: 'Access denied' });
    }

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
    res.status(201).json({ 
      message: 'Unit created successfully', 
      unit: { 
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
    res.status(500).json({ message: 'Error creating unit', error: error.message });
  }
};

// Get all units (accessible to SuperAdmin and Instructor)
exports.getAllUnits = async (req, res) => {
  try {
    // Check if user is SuperAdmin or Instructor
    if (req.user.role !== 'SuperAdmin' && req.user.role !== 'Instructor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const units = await Unit.find()
      .populate('course', 'title description')
      .populate('subUnits', 'title order')
      .populate('lessons', 'title content')
      .populate('assessments', 'title type')
      .populate('exams', 'title date')
      .populate({
        path: 'discussions.user',
        select: 'name email',
        model: function(doc) {
          return doc.discussions.userType === 'Instructor' ? 'Instructor' : 'Student';
        }
      });
    res.status(200).json(units);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching units', error: error.message });
  }
};

// Get unit by ID (accessible to SuperAdmin or Instructor)
exports.getUnitById = async (req, res) => {
  try {
    // Check if user is SuperAdmin or Instructor
    if (req.user.role !== 'SuperAdmin' && req.user.role !== 'Instructor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid unit ID' });
    }

    const unit = await Unit.findById(req.params.id)
      .populate('course', 'title description')
      .populate('subUnits', 'title order')
      .populate('lessons', 'title content')
      .populate('assessments', 'title type')
      .populate('exams', 'title date')
      .populate({
        path: 'discussions.user',
        select: 'name email',
        model: function(doc) {
          return doc.discussions.userType === 'Instructor' ? 'Instructor' : 'Student';
        }
      });

    if (!unit) {
      return res.status(404).json({ message: 'Unit not found' });
    }

    res.status(200).json(unit);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching unit', error: error.message });
  }
};

// Update unit (accessible to SuperAdmin or Instructor)
exports.updateUnit = async (req, res) => {
  try {
    const { title, course, order, subUnits, lessons, assessments, exams, studyMaterials } = req.body;

    // Validate ObjectIds if provided
    if (course && !mongoose.isValidObjectId(course)) {
      return res.status(400).json({ message: 'Invalid course ID' });
    }
    if (subUnits && !subUnits.every(id => mongoose.isValidObjectId(id))) {
      return res.status(400).json({ message: 'Invalid subUnit ID(s)' });
    }
    if (lessons && !lessons.every(id => mongoose.isValidObjectId(id))) {
      return res.status(400).json({ message: 'Invalid lesson ID(s)' });
    }
    if (assessments && !assessments.every(id => mongoose.isValidObjectId(id))) {
      return res.status(400).json({ message: 'Invalid assessment ID(s)' });
    }
    if (exams && !exams.every(id => mongoose.isValidObjectId(id))) {
      return res.status(400).json({ message: 'Invalid exam ID(s)' });
    }

    const updateData = { 
      title: title || undefined, 
      course: course || undefined, 
      order: order || undefined, 
      subUnits: subUnits || undefined, 
      lessons: lessons || undefined, 
      assessments: assessments || undefined, 
      exams: exams || undefined, 
      studyMaterials: studyMaterials || undefined, 
      updatedAt: Date.now() 
    };

    // Check if user is SuperAdmin or Instructor
    if (req.user.role !== 'SuperAdmin' && req.user.role !== 'Instructor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid unit ID' });
    }

    const unit = await Unit.findById(req.params.id);
    if (!unit) {
      return res.status(404).json({ message: 'Unit not found' });
    }

    Object.assign(unit, updateData);
    await unit.save();

    res.status(200).json({ 
      message: 'Unit updated successfully', 
      unit: { 
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
    res.status(500).json({ message: 'Error updating unit', error: error.message });
  }
};

// Delete unit (restricted to SuperAdmin or Instructor)
exports.deleteUnit = async (req, res) => {
  try {
    // Check if user is SuperAdmin or Instructor
    if (req.user.role !== 'SuperAdmin' && req.user.role !== 'Instructor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid unit ID' });
    }

    const unit = await Unit.findByIdAndDelete(req.params.id);
    if (!unit) {
      return res.status(404).json({ message: 'Unit not found' });
    }

    res.status(200).json({ message: 'Unit deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting unit', error: error.message });
  }
};

// Add sub-unit to unit (accessible to SuperAdmin or Instructor)
exports.addSubUnit = async (req, res) => {
  try {
    // Check if user is SuperAdmin or Instructor
    if (req.user.role !== 'SuperAdmin' && req.user.role !== 'Instructor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid unit ID' });
    }

    const unit = await Unit.findById(req.params.id);
    if (!unit) {
      return res.status(404).json({ message: 'Unit not found' });
    }

    const { subUnitId } = req.body;
    if (!mongoose.isValidObjectId(subUnitId)) {
      return res.status(400).json({ message: 'Invalid subUnit ID' });
    }

    if (!unit.subUnits.includes(subUnitId)) {
      unit.subUnits.push(subUnitId);
      await unit.save();
    }

    res.status(200).json({ message: 'Sub-unit added to unit', unit: unit.toObject({ getters: true }) });
  } catch (error) {
    res.status(500).json({ message: 'Error adding sub-unit', error: error.message });
  }
};

// Add lesson to unit (accessible to SuperAdmin or Instructor)
exports.addLesson = async (req, res) => {
  try {
    // Check if user is SuperAdmin or Instructor
    if (req.user.role !== 'SuperAdmin' && req.user.role !== 'Instructor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid unit ID' });
    }

    const unit = await Unit.findById(req.params.id);
    if (!unit) {
      return res.status(404).json({ message: 'Unit not found' });
    }

    const { lessonId } = req.body;
    if (!mongoose.isValidObjectId(lessonId)) {
      return res.status(400).json({ message: 'Invalid lesson ID' });
    }

    if (!unit.lessons.includes(lessonId)) {
      unit.lessons.push(lessonId);
      await unit.save();
    }

    res.status(200).json({ message: 'Lesson added to unit', unit: unit.toObject({ getters: true }) });
  } catch (error) {
    res.status(500).json({ message: 'Error adding lesson', error: error.message });
  }
};

// Add assessment to unit (accessible to SuperAdmin or Instructor)
exports.addAssessment = async (req, res) => {
  try {
    // Check if user is SuperAdmin or Instructor
    if (req.user.role !== 'SuperAdmin' && req.user.role !== 'Instructor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid unit ID' });
    }

    const unit = await Unit.findById(req.params.id);
    if (!unit) {
      return res.status(404).json({ message: 'Unit not found' });
    }

    const { assessmentId } = req.body;
    if (!mongoose.isValidObjectId(assessmentId)) {
      return res.status(400).json({ message: 'Invalid assessment ID' });
    }

    if (!unit.assessments.includes(assessmentId)) {
      unit.assessments.push(assessmentId);
      await unit.save();
    }

    res.status(200).json({ message: 'Assessment added to unit', unit: unit.toObject({ getters: true }) });
  } catch (error) {
    res.status(500).json({ message: 'Error adding assessment', error: error.message });
  }
};

// Add exam to unit (accessible to SuperAdmin or Instructor)
exports.addExam = async (req, res) => {
  try {
    // Check if user is SuperAdmin or Instructor
    if (req.user.role !== 'SuperAdmin' && req.user.role !== 'Instructor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid unit ID' });
    }

    const unit = await Unit.findById(req.params.id);
    if (!unit) {
      return res.status(404).json({ message: 'Unit not found' });
    }

    const { examId } = req.body;
    if (!mongoose.isValidObjectId(examId)) {
      return res.status(400).json({ message: 'Invalid exam ID' });
    }

    if (!unit.exams.includes(examId)) {
      unit.exams.push(examId);
      await unit.save();
    }

    res.status(200).json({ message: 'Exam added to unit', unit: unit.toObject({ getters: true }) });
  } catch (error) {
    res.status(500).json({ message: 'Error adding exam', error: error.message });
  }
};

// Add study material to unit (accessible to SuperAdmin or Instructor)
exports.addStudyMaterial = async (req, res) => {
  try {
    // Check if user is SuperAdmin or Instructor
    if (req.user.role !== 'SuperAdmin' && req.user.role !== 'Instructor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid unit ID' });
    }

    const unit = await Unit.findById(req.params.id);
    if (!unit) {
      return res.status(404).json({ message: 'Unit not found' });
    }

    const { url, title, type } = req.body;
    if (!url || !title || !type) {
      return res.status(400).json({ message: 'URL, title, and type are required for study material' });
    }

    unit.studyMaterials.push({ url, title, type });
    await unit.save();

    res.status(200).json({ message: 'Study material added to unit', unit: unit.toObject({ getters: true }) });
  } catch (error) {
    res.status(500).json({ message: 'Error adding study material', error: error.message });
  }
};

exports.addDiscussion = async (req, res) => {
  try {
    // Check if user is SuperAdmin or Instructor
    if (req.user.role !== 'SuperAdmin' && req.user.role !== 'Instructor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid unit ID' });
    }

    const unit = await Unit.findById(req.params.id);
    if (!unit) {
      return res.status(404).json({ message: 'Unit not found' });
    }

    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ message: 'Question is required for discussion' });
    }

    unit.discussions.push({
      question,
      answers: [],
      userType: req.user.role,
      user: req.user.id
    });
    await unit.save();

    res.status(200).json({ message: 'Discussion added to unit', unit: unit.toObject({ getters: true }) });
  } catch (error) {
    res.status(500).json({ message: 'Error adding discussion', error: error.message });
  }
};