const Assessment = require('../models/Assessment');
const Unit = require('../models/Unit');
const Course = require('../models/Course');
const AuditLog = require('../models/AuditLog');

exports.createAssessment = async (req, res) => {
  try {
    const { title, unit, course, description, dueDate, maxScore } = req.body;

    if (req.user.role !== 'Instructor' && req.user.role !== 'SuperAdmin') {
      return res.status(403).json({ message: 'Only Instructor or SuperAdmin can create assessments' });
    }

    const courseDoc = await Course.findById(course);
    if (!courseDoc) {
      return res.status(404).json({ message: 'Course not found' });
    }
    if (req.user.role === 'Instructor' && courseDoc.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to create assessments for this course' });
    }

    const unitDoc = await Unit.findById(unit);
    if (!unitDoc) {
      return res.status(404).json({ message: 'Unit not found' });
    }
    if (unitDoc.course.toString() !== course) {
      return res.status(400).json({ message: 'Unit does not belong to the specified course' });
    }

    const assessment = new Assessment({
      title,
      unit,
      course,
      description,
      dueDate,
      maxScore
    });

    await assessment.save();

    unitDoc.assessments = unitDoc.assessments || [];
    unitDoc.assessments.push(assessment._id);
    await unitDoc.save();

    await AuditLog.create({
      action: 'assessment_created',
      user: req.user.id,
      userType: req.user.role,
      details: `Assessment ${title} created for course ${courseDoc.title} by ${req.user.role}`
    });

    res.status(201).json({ message: 'Assessment created successfully', assessment });
  } catch (error) {
    res.status(500).json({ message: 'Error creating assessment', error: error.message });
  }
};

exports.getAssessments = async (req, res) => {
  try {
    const { courseId, unitId } = req.query;

    let query = {};
    if (courseId) {
      query.course = courseId;
    }
    if (unitId) {
      query.unit = unitId;
    }

    if (req.user.role === 'Student' && courseId) {
      const course = await Course.findById(courseId);
      if (!course || !course.students.includes(req.user.id)) {
        return res.status(403).json({ message: 'Not authorized to view assessments for this course' });
      }
    }

    const assessments = await Assessment.find(query)
      .populate('unit', 'title')
      .populate('course', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json(assessments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assessments', error: error.message });
  }
};

exports.getAssessmentById = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id)
      .populate('unit', 'title')
      .populate('course', 'title');

    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    if (req.user.role === 'Student') {
      const course = await Course.findById(assessment.course);
      if (!course || !course.students.includes(req.user.id)) {
        return res.status(403).json({ message: 'Not authorized to view this assessment' });
      }
    }

    res.status(200).json(assessment);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assessment', error: error.message });
  }
};

exports.updateAssessment = async (req, res) => {
  try {
    const { title, description, dueDate, maxScore } = req.body;
    const assessment = await Assessment.findById(req.params.id);

    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    const course = await Course.findById(assessment.course);
    if (req.user.role !== 'SuperAdmin' && course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this assessment' });
    }

    assessment.title = title || assessment.title;
    assessment.description = description || assessment.description;
    assessment.dueDate = dueDate || assessment.dueDate;
    assessment.maxScore = maxScore || assessment.maxScore;
    assessment.updatedAt = Date.now();

    await assessment.save();

    await AuditLog.create({
      action: 'assessment_updated',
      user: req.user.id,
      userType: req.user.role,
      details: `Assessment ${assessment.title} updated by ${req.user.role}`
    });

    res.status(200).json({ message: 'Assessment updated successfully', assessment });
  } catch (error) {
    res.status(500).json({ message: 'Error updating assessment', error: error.message });
  }
};

exports.deleteAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);

    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    const course = await Course.findById(assessment.course);
    if (req.user.role !== 'SuperAdmin' && course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this assessment' });
    }

    const unit = await Unit.findById(assessment.unit);
    if (unit && unit.assessments) {
      unit.assessments.pull(assessment._id);
      await unit.save();
    }

    await assessment.deleteOne();

    await AuditLog.create({
      action: 'assessment_deleted',
      user: req.user.id,
      userType: req.user.role,
      details: `Assessment ${assessment.title} deleted by ${req.user.role}`
    });

    res.status(200).json({ message: 'Assessment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting assessment', error: error.message });
  }
};