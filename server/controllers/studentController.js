const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');

exports.registerStudent = async (req, res) => {
  try {
    const { name, email, password, profile } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const student = new Student({
      name,
      email,
      password: hashedPassword,
      profile: profile || {},
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await student.save();
    res.status(201).json({
      message: 'Student registered successfully',
      student: {
        id: student._id,
        name,
        email,
        profile: student.profile,
        createdAt: student.createdAt,
        updatedAt: student.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering Student', error: error.message });
  }
};

exports.loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: student._id, role: 'Student', courses: student.enrolledCourses },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
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
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

exports.getAllStudents = async (req, res) => {
  try {
    if (req.user.role !== 'SuperAdmin' && req.user.role !== 'Instructor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const students = await Student.find()
      .select('-password')
      .populate('enrolledCourses', 'title description')
      .populate('completedCourses', 'title description');
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Students', error: error.message });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid Student ID' });
    }

    if (req.user.role === 'Student' && req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (req.user.role !== 'SuperAdmin' && req.user.role !== 'Instructor' && req.user.role !== 'Student') {
      return res.status(403).json({ message: 'Access denied' });
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
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Student', error: error.message });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const { name, email, password, profile, enrolledCourses, completedCourses, assessments, exams, certificates, notifications, calendarEvents, performance } = req.body;

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
      }
    }

    if (req.user.role === 'Student' && req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (req.user.role !== 'SuperAdmin' && req.user.role !== 'Instructor' && req.user.role !== 'Student') {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (req.user.role === 'Student' && (enrolledCourses || completedCourses || assessments || exams || certificates || notifications || calendarEvents || performance)) {
      return res.status(403).json({ message: 'Students can only update name, email, password, or profile' });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid Student ID' });
    }

    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (email && email !== student.email) {
      const existingStudent = await Student.findOne({ email });
      if (existingStudent) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    const updateData = {
      name: name || undefined,
      email: email || undefined,
      profile: profile || undefined,
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
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    Object.assign(student, updateData);
    await student.save();

    const updatedStudent = await Student.findById(student._id)
      .select('-password')
      .populate('enrolledCourses', 'title description')
      .populate('completedCourses', 'title description');

    res.status(200).json({
      message: 'Student updated successfully',
      student: updatedStudent
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating Student', error: error.message });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    if (req.user.role !== 'SuperAdmin' && req.user.role !== 'Instructor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid Student ID' });
    }

    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting Student', error: error.message });
  }
};

exports.getStudentEnrolledCourses = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid Student ID' });
    }

    if (req.user.role === 'Student' && req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (req.user.role !== 'SuperAdmin' && req.user.role !== 'Instructor' && req.user.role !== 'Student') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const student = await Student.findById(req.params.id)
      .select('enrolledCourses')
      .populate('enrolledCourses', 'title description');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json(student.enrolledCourses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching enrolled courses', error: error.message });
  }
};

exports.getStudentPerformance = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid Student ID' });
    }

    if (req.user.role === 'Student' && req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (req.user.role !== 'SuperAdmin' && req.user.role !== 'Instructor' && req.user.role !== 'Student') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const student = await Student.findById(req.params.id)
      .select('performance')
      .populate('performance.progress.course', 'title');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json(student.performance);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching performance data', error: error.message });
  }
};