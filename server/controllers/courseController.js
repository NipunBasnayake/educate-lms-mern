const Course = require('../models/Course');
const AuditLog = require('../models/AuditLog');
const Instructor = require('../models/Instructor');

exports.createCourse = async (req, res) => {
  try {
    const { title, description } = req.body;
    const instructorId = req.user.id;

    if (req.user.role !== 'Instructor') {
      return res.status(403).json({ message: 'Only instructors can create courses' });
    }

    const instructor = await Instructor.findById(instructorId);
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    const course = new Course({
      title,
      description,
      instructor: instructorId,
    });

    await course.save();

    await AuditLog.create({
      action: 'course_created',
      user: instructorId,
      userType: req.user.role,
      details: `Course ${title} created by ${instructor.name}`,
    });

    res.status(201).json({ message: 'Course created successfully', course });
  } catch (error) {
    res.status(500).json({ message: 'Error creating course', error: error.message });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('instructor', 'name email')
      .populate('students', 'name email');
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses', error: error.message });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name email')
      .populate('students', 'name email');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching course', error: error.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (req.user.role !== 'SuperAdmin' && course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this course' });
    }

    course.title = title || course.title;
    course.description = description || course.description;
    course.status = status || course.status;
    course.updatedAt = Date.now();

    await course.save();

    await AuditLog.create({
      action: 'course_updated',
      user: req.user.id,
      userType: req.user.role,
      details: `Course ${course.title} updated by ${req.user.role}`,
    });

    res.status(200).json({ message: 'Course updated successfully', course });
  } catch (error) {
    res.status(500).json({ message: 'Error updating course', error: error.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (req.user.role !== 'SuperAdmin' && course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this course' });
    }

    await course.deleteOne();

    await AuditLog.create({
      action: 'course_deleted',
      user: req.user.id,
      userType: req.user.role,
      details: `Course ${course.title} deleted by ${req.user.role}`,
    });

    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting course', error: error.message });
  }
};