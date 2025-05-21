const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const Student = require('../models'); // Updated to use index.js
const bcrypt = require('bcryptjs');

// Middleware: Authenticate JWT and extract user info
const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Authentication required' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role: 'student'/'instructor'/'superadmin' }
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware: Restrict to Super Admin
const restrictToAdmin = (req, res, next) => {
  if (req.user.role !== 'superadmin') {
    return res.status(403).json({ message: 'Access denied: Super Admin only' });
  }
  next();
};

// Middleware: Restrict to same Student or Super Admin
const restrictToSelfOrAdmin = (req, res, next) => {
  if (req.user.role !== 'superadmin' && req.user.id !== req.params.id) {
    return res.status(403).json({ message: 'Access denied: Can only access own profile' });
  }
  next();
};

// Validation Schemas
const createStudentSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().optional(),
  address: Joi.string().optional()
});

const updateStudentSchema = Joi.object({
  name: Joi.string().optional(),
  phone: Joi.string().optional(),
  address: Joi.string().optional(),
  preferences: Joi.object({
    notifications: Joi.boolean().optional(),
    language: Joi.string().optional()
  }).optional(),
  password: Joi.string().min(6).optional()
});

// Create Student (Super Admin only)
router.post('/', authenticate, restrictToAdmin, async (req, res) => {
  try {
    const { error } = createStudentSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { name, email, password, phone, address } = req.body;
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const student = new Student({
      name,
      email,
      password: hashedPassword,
      profile: { phone, address }
    });

    await student.save();
    res.status(201).json({ message: 'Student created', student: { id: student._id, name, email } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Read Student (Self or Super Admin)
router.get('/:id', authenticate, restrictToSelfOrAdmin, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .select('-password') // Exclude password
      .populate('enrolledCourses', 'title')
      .populate('completedCourses', 'title')
      .populate('certificates', 'course issueDate');
    if (!student) return res.status(404).json({ message: 'Student not found' });

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update Student (Self or Super Admin)
router.put('/:id', authenticate, restrictToSelfOrAdmin, async (req, res) => {
  try {
    const { error } = updateStudentSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const updates = { ...req.body };
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!student) return res.status(404).json({ message: 'Student not found' });

    res.json({ message: 'Student updated', student });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete Student (Super Admin only)
router.delete('/:id', authenticate, restrictToAdmin, async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    res.json({ message: 'Student deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// List Students (Super Admin only, for user management)
router.get('/', authenticate, restrictToAdmin, async (req, res) => {
  try {
    const students = await Student.find().select('name email profile.phone');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;