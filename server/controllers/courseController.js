const Course = require('../models/Course');
const mongoose = require('mongoose');

// Create a new course
const createCourse = async (req, res) => {
  try {
    const { title, description, instructor, status } = req.body;

    // Validate instructor ID
    if (!mongoose.Types.ObjectId.isValid(instructor)) {
      return res.status(400).json({ success: false, message: 'Invalid instructor ID' });
    }

    const course = new Course({
      title,
      description,
      instructor,
      status: status || 'pending'
    });

    await course.save();
    return res.status(201).json({ 
      success: true, 
      message: 'Course created successfully', 
      data: course 
    });
  } catch (error) {
    return res.status(400).json({ 
      success: false, 
      message: 'Error creating course', 
      error: error.message 
    });
  }
};

// Get all courses with pagination and filtering
const getAllCourses = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, instructor } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (instructor && mongoose.Types.ObjectId.isValid(instructor)) {
      query.instructor = instructor;
    }

    const courses = await Course.find(query)
      .populate('instructor', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Course.countDocuments(query);

    return res.status(200).json({
      success: true,
      data: courses,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Error fetching courses', 
      error: error.message 
    });
  }
};

// Get a single course by ID
const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid course ID' });
    }

    const course = await Course.findById(id)
      .populate('instructor', 'name email')
      .populate('units', 'title')
      .populate('students', 'name email');

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    return res.status(200).json({ success: true, data: course });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Error fetching course', 
      error: error.message 
    });
  }
};

// Update a course
const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid course ID' });
    }

    // Prevent updating certain fields
    delete updates.createdAt;
    delete updates.updatedAt;
    
    if (updates.instructor && !mongoose.Types.ObjectId.isValid(updates.instructor)) {
      return res.status(400).json({ success: false, message: 'Invalid instructor ID' });
    }

    const course = await Course.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Course updated successfully', 
      data: course 
    });
  } catch (error) {
    return res.status(400).json({ 
      success: false, 
      message: 'Error updating course', 
      error: error.message 
    });
  }
};

// Delete a course
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid course ID' });
    }

    const course = await Course.findByIdAndDelete(id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Course deleted successfully' 
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Error deleting course', 
      error: error.message 
    });
  }
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse
};