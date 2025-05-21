const jwt = require('jsonwebtoken');
const { Student, Instructor, SuperAdmin } = require('../models');

const authenticate = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Authentication required' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user;

    // Find user based on role
    if (decoded.role === 'student') {
      user = await Student.findById(decoded.id);
    } else if (decoded.role === 'instructor') {
      user = await Instructor.findById(decoded.id);
    } else if (decoded.role === 'superadmin') {
      user = await SuperAdmin.findById(decoded.id);
    }

    if (!user) return res.status(404).json({ message: 'User not found' });

    req.user = { id: user._id, role: decoded.role };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Restrict to Super Admin
const restrictToAdmin = (req, res, next) => {
  if (req.user.role !== 'superadmin') {
    return res.status(403).json({ message: 'Access denied: Super Admin only' });
  }
  next();
};

// Restrict to same user or Super Admin
const restrictToSelfOrAdmin = (req, res, next) => {
  if (req.user.role !== 'superadmin' && req.user.id !== req.params.id) {
    return res.status(403).json({ message: 'Access denied: Can only access own profile' });
  }
  next();
};

module.exports = { authenticate, restrictToAdmin, restrictToSelfOrAdmin };