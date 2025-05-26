const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sanitize = require('mongo-sanitize'); // For sanitizing inputs
const Student = require('../models/Student');

// Utility function for standardized error responses
const sendError = (res, status, message, error = null) => {
  res.status(status).json({ success: false, message, error: error?.message });
};

// Register a new student
exports.registerStudent = async (req, res) => {
  try {
    const { name, email, password, profile } = req.body;

    // Input validation
    if (!name || !email || !password) {
      return sendError(res, 400, 'Name, email, and password are required');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return sendError(res, 400, 'Invalid email format');
    }

    // Password complexity: at least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      return sendError(res, 400, 'Password must be at least 8 characters long and include uppercase, lowercase, and a number');
    }

    // Sanitize inputs
    const sanitizedEmail = sanitize(email);
    const sanitizedName = sanitize(name);

    const existingStudent = await Student.findOne({ email: sanitizedEmail });
    if (existingStudent) {
      return sendError(res, 400, 'Email already in use');
    }

    const salt = await bcrypt.genSalt(12); // Increased salt rounds for better security
    const hashedPassword = await bcrypt.hash(password, salt);

    const student = new Student({
      name: sanitizedName,
      email: sanitizedEmail,
      password: hashedPassword,
      profile: sanitize(profile) || {},
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await student.save();
    res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        profile: student.profile,
        createdAt: student.createdAt,
        updatedAt: student.updatedAt
      }
    });
  } catch (error) {
    sendError(res, 500, 'Error registering student', error);
  }
};

// Login a student
exports.loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 400, 'Email and password are required');
    }

    const student = await Student.findOne({ email: sanitize(email) });
    if (!student) {
      return sendError(res, 401, 'Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return sendError(res, 401, 'Invalid credentials');
    }

    const token = jwt.sign(
      { id: student._id, role: 'Student' }, // Simplified token payload
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        profile: student.profile
      }
    });
  } catch (error) {
    sendError(res, 500, 'Error logging in', error);
  }
};

// Get all students (SuperAdmin/Instructor only)
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .select('-password')
      .populate('enrolledCourses', 'title description')
      .populate('completedCourses', 'title description');
    res.status(200).json({ success: true, data: students });
  } catch (error) {
    sendError(res, 500, 'Error fetching students', error);
  }
};

// Get student by ID (Restricted to self for students)
exports.getStudentById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return sendError(res, 400, 'Invalid student ID');
    }

    if (req.user.role === 'Student' && req.user.id !== req.params.id) {
      return sendError(res, 403, 'Students can only access their own data');
    }

    const student = await Student.findById(req.params.id)
      .select('-password')
      .populate('enrolledCourses', 'title description')
      .populate('completedCourses', 'title description')
      .populate('assessments.assessment', 'title description')
      .populate('assessments.submission', 'content score status')
      .populate('exams.exam', 'title description')
      .populate('certificates', 'title issuedAt')
      .populate('notifications', 'message createdAt')
      .populate('calendarEvents', 'title start end')
      .populate('performance.progress.course', 'title');

    if (!student) {
      return sendError(res, 404, 'Student not found');
    }

    res.status(200).json({ success: true, data: student });
  } catch (error) {
    sendError(res, 500, 'Error fetching student', error);
  }
};

// Update student
exports.updateStudent = async (req, res) => {
  try {
    const { name, email, password, profile, enrolledCourses, completedCourses, assessments, exams, certificates, notifications, calendarEvents, performance } = req.body;

    if (!mongoose.isValidObjectId(req.params.id)) {
      return sendError(res, 400, 'Invalid student ID');
    }

    if (req.user.role === 'Student' && req.user.id !== req.params.id) {
      return sendError(res, 403, 'Students can only update their own data');
    }

    if (req.user.role === 'Student' && (enrolledCourses || completedCourses || assessments || exams || certificates || notifications || calendarEvents || performance)) {
      return sendError(res, 403, 'Students can only update name, email, password, or profile');
    }

    const student = await Student.findById(req.params.id);
    if (!student) {
      return sendError(res, 404, 'Student not found');
    }

    if (email && email !== student.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return sendError(res, 400, 'Invalid email format');
      }
      const existingStudent = await Student.findOne({ email: sanitize(email) });
      if (existingStudent) {
        return sendError(res, 400, 'Email already in use');
      }
    }

    const updateData = {
      name: name ? sanitize(name) : undefined,
      email: email ? sanitize(email) : undefined,
      profile: profile ? sanitize(profile) : undefined,
      enrolledCourses: enrolledCourses || undefined,
      completedCourses: completedCourses || undefined,
      assessments: assessments || undefined,
      exams: exams || undefined,
      certificates: certificates || undefined,
      notifications: notifications || undefined,
      calendarEvents: calendarEvents || undefined,
      performance: performance || undefined,
      updatedAt: new Date()
    };

    if (password) {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
      if (!passwordRegex.test(password)) {
        return sendError(res, 400, 'Password must be at least 8 characters long and include uppercase, lowercase, and a number');
      }
      const salt = await bcrypt.genSalt(12);
      updateData.password = await bcrypt.hash(password, salt);
    }

    Object.assign(student, updateData);
    await student.save();

    const updatedStudent = await Student.findById(student._id)
      .select('-password')
      .populate('enrolledCourses', 'title description')
      .populate('completedCourses', 'title description');

    res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: updatedStudent
    });
  } catch (error) {
    sendError(res, 500, 'Error updating student', error);
  }
};

// Delete student (SuperAdmin/Instructor only)
exports.deleteStudent = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return sendError(res, 400, 'Invalid student ID');
    }

    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return sendError(res, 404, 'Student not found');
    }

    res.status(200).json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    sendError(res, 500, 'Error deleting student', error);
  }
};

// Get enrolled courses
exports.getStudentEnrolledCourses = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return sendError(res, 400, 'Invalid student ID');
    }

    if (req.user.role === 'Student' && req.user.id !== req.params.id) {
      return sendError(res, 403, 'Students can only access their own data');
    }

    const student = await Student.findById(req.params.id)
      .select('enrolledCourses')
      .populate('enrolledCourses', 'title description');
    if (!student) {
      return sendError(res, 404, 'Student not found');
    }

    res.status(200).json({ success: true, data: student.enrolledCourses });
  } catch (error) {
    sendError(res, 500, 'Error fetching enrolled courses', error);
  }
};

// Get performance data
exports.getStudentPerformance = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return sendError(res, 400, 'Invalid student ID');
    }

    if (req.user.role === 'Student' && req.user.id !== req.params.id) {
      return sendError(res, 403, 'Students can only access their own data');
    }

    const student = await Student.findById(req.params.id)
      .select('performance')
      .populate('performance.progress.course', 'title');
    if (!student) {
      return sendError(res, 404, 'Student not found');
    }

    res.status(200).json({ success: true, data: student.performance });
  } catch (error) {
    sendError(res, 500, 'Error fetching performance data', error);
  }
};