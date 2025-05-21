const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const { Student, Instructor, SuperAdmin } = require('../models');
const generateToken = require('../utils/generateToken');
const { authenticate, restrictToAdmin, restrictToSelfOrAdmin } = require('../middleware/auth');

// Validation Schemas
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  role: Joi.string().valid('student', 'instructor', 'superadmin').required()
});

const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('student', 'instructor', 'superadmin').required(),
  phone: Joi.string().optional(),
  address: Joi.string().optional()
});

const updateProfileSchema = Joi.object({
  name: Joi.string().optional(),
  phone: Joi.string().optional(),
  address: Joi.string().optional(),
  password: Joi.string().min(6).optional(),
  preferences: Joi.object({
    notifications: Joi.boolean().optional(),
    language: Joi.string().optional()
  }).optional()
});

// Login (All roles)
router.post('/login', async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { email, password, role } = req.body;
    let user;

    if (role === 'student') {
      user = await Student.findOne({ email });
    } else if (role === 'instructor') {
      user = await Instructor.findOne({ email });
    } else if (role === 'superadmin') {
      user = await SuperAdmin.findOne({ email });
    }

    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user);
    res.json({ token, role: user.role || role });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Register (Super Admin only)
router.post('/register', authenticate, restrictToAdmin, async (req, res) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { name, email, password, role, phone, address } = req.body;
    let user;

    // Check for existing user
    if (role === 'student') {
      user = await Student.findOne({ email });
      if (user) return res.status(400).json({ message: 'Email already exists' });
      user = new Student({ name, email, password: await bcrypt.hash(password, 10), profile: { phone, address } });
    } else if (role === 'instructor') {
      user = await Instructor.findOne({ email });
      if (user) return res.status(400).json({ message: 'Email already exists' });
      user = new Instructor({ name, email, password: await bcrypt.hash(password, 10) });
    } else if (role === 'superadmin') {
      user = await SuperAdmin.findOne({ email });
      if (user) return res.status(400).json({ message: 'Email already exists' });
      user = new SuperAdmin({ name, email, password: await bcrypt.hash(password, 10) });
    }

    await user.save();
    res.status(201).json({ message: `${role} created`, user: { id: user._id, name, email, role } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get Profile (Self or Super Admin)
router.get('/profile/:id', authenticate, restrictToSelfOrAdmin, async (req, res) => {
  try {
    let user;
    if (req.user.role === 'student') {
      user = await Student.findById(req.params.id).select('-password');
    } else if (req.user.role === 'instructor') {
      user = await Instructor.findById(req.params.id).select('-password');
    } else if (req.user.role === 'superadmin') {
      user = await SuperAdmin.findById(req.params.id).select('-password');
    }

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update Profile (Self or Super Admin)
router.put('/profile/:id', authenticate, restrictToSelfOrAdmin, async (req, res) => {
  try {
    const { error } = updateProfileSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const updates = { ...req.body };
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    let user;
    if (req.user.role === 'student') {
      user = await Student.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true, runValidators: true }).select('-password');
    } else if (req.user.role === 'instructor') {
      user = await Instructor.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true, runValidators: true }).select('-password');
    } else if (req.user.role === 'superadmin') {
      user = await SuperAdmin.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true, runValidators: true }).select('-password');
    }

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'Profile updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete User (Super Admin only)
router.delete('/profile/:id', authenticate, restrictToAdmin, async (req, res) => {
  try {
    let user;
    const roles = ['student', 'instructor', 'superadmin'];
    for (const role of roles) {
      if (role === 'student') {
        user = await Student.findByIdAndDelete(req.params.id);
      } else if (role === 'instructor') {
        user = await Instructor.findByIdAndDelete(req.params.id);
      } else if (role === 'superadmin') {
        user = await SuperAdmin.findByIdAndDelete(req.params.id);
      }
      if (user) break;
    }

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Logout (Client-side token invalidation)
router.post('/logout', authenticate, (req, res) => {
  // Since JWT is stateless, logout is handled client-side by discarding the token
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;