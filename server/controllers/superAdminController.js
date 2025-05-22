const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SuperAdmin = require('../models/SuperAdmin');

exports.registerSuperAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const existingSuperAdmin = await SuperAdmin.findOne({ email });
    if (existingSuperAdmin) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const superAdmin = new SuperAdmin({
      name,
      email,
      password: hashedPassword,
      role: 'superadmin',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await superAdmin.save();
    res.status(201).json({
      message: 'SuperAdmin registered successfully',
      superAdmin: {
        id: superAdmin._id,
        name,
        email,
        role: superAdmin.role,
        createdAt: superAdmin.createdAt,
        updatedAt: superAdmin.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering SuperAdmin', error: error.message });
  }
};

exports.loginSuperAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const superAdmin = await SuperAdmin.findOne({ email });
    if (!superAdmin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, superAdmin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: superAdmin._id, role: superAdmin.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      superAdmin: {
        id: superAdmin._id,
        name: superAdmin.name,
        email: superAdmin.email,
        role: superAdmin.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

exports.getAllSuperAdmins = async (req, res) => {
  try {
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const superAdmins = await SuperAdmin.find().select('-password -notifications');
    res.status(200).json(superAdmins);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching SuperAdmins', error: error.message });
  }
};

exports.getSuperAdminById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid SuperAdmin ID' });
    }

    if (req.user.role !== 'superadmin' || (req.user.id !== req.params.id && req.user.role !== 'superadmin')) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const superAdmin = await SuperAdmin.findById(req.params.id).select('-password');
    if (!superAdmin) {
      return res.status(404).json({ message: 'SuperAdmin not found' });
    }

    res.status(200).json(superAdmin);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching SuperAdmin', error: error.message });
  }
};

exports.updateSuperAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
      }
    }

    if (req.user.role !== 'superadmin' || (req.user.id !== req.params.id && req.user.role !== 'superadmin')) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid SuperAdmin ID' });
    }

    const superAdmin = await SuperAdmin.findById(req.params.id);
    if (!superAdmin) {
      return res.status(404).json({ message: 'SuperAdmin not found' });
    }

    if (email && email !== superAdmin.email) {
      const existingSuperAdmin = await SuperAdmin.findOne({ email });
      if (existingSuperAdmin) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    const updateData = {
      name: name || undefined,
      email: email || undefined,
      updatedAt: new Date()
    };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    Object.assign(superAdmin, updateData);
    await superAdmin.save();

    res.status(200).json({
      message: 'SuperAdmin updated successfully',
      superAdmin: {
        id: superAdmin._id,
        name: superAdmin.name,
        email: superAdmin.email,
        role: superAdmin.role,
        createdAt: superAdmin.createdAt,
        updatedAt: superAdmin.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating SuperAdmin', error: error.message });
  }
};

exports.deleteSuperAdmin = async (req, res) => {
  try {
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid SuperAdmin ID' });
    }

    if (req.params.id === req.user.id) {
      return res.status(403).json({ message: 'Cannot delete yourself' });
    }

    const superAdmin = await SuperAdmin.findByIdAndDelete(req.params.id);
    if (!superAdmin) {
      return res.status(404).json({ message: 'SuperAdmin not found' });
    }

    res.status(200).json({ message: 'SuperAdmin deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting SuperAdmin', error: error.message });
  }
};

exports.getSuperAdminNotifications = async (req, res) => {
  try {
    if (req.user.role !== 'superadmin' || (req.user.id !== req.params.id && req.user.role !== 'superadmin')) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid SuperAdmin ID' });
    }

    const superAdmin = await SuperAdmin.findById(req.params.id)
      .populate('notifications', 'message createdAt');

    if (!superAdmin) {
      return res.status(404).json({ message: 'SuperAdmin not found' });
    }

    res.status(200).json(superAdmin.notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
};