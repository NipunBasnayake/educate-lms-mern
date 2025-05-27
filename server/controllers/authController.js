const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Instructor = require('../models/Instructor');
const SuperAdmin = require('../models/SuperAdmin');

const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    if (!['Student', 'Instructor', 'SuperAdmin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    let user;
    if (role === 'Student') {
      user = await Student.findOne({ email });
    } else if (role === 'Instructor') {
      user = await Instructor.findOne({ email });
    } else if (role === 'SuperAdmin') {
      user = await SuperAdmin.findOne({ email });
    }

    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (role === 'Student') {
      user = new Student({
        name,
        email,
        password: hashedPassword,
        profile: { phone: '', address: '', preferences: { notifications: true, language: 'en' } },
      });
    } else if (role === 'Instructor') {
      user = new Instructor({
        name,
        email,
        password: hashedPassword,
      });
    } else if (role === 'SuperAdmin') {
      user = new SuperAdmin({
        name,
        email,
        password: hashedPassword,
        role: 'superadmin',
      });
    }

    await user.save();

    const payload = { id: user._id, role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ message: 'User registered successfully', token, user: { id: user._id, name, email, role } });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    let user, role;
    user = await Student.findOne({ email });
    if (user) {
      role = 'Student';
    } else {
      user = await Instructor.findOne({ email });
      if (user) {
        role = 'Instructor';
      } else {
        user = await SuperAdmin.findOne({ email });
        if (user) {
          role = 'SuperAdmin';
        }
      }
    }

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = { id: user._id, role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role } });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    let user;
    if (req.user.role === 'Student') {
      user = await Student.findById(req.user.id).select('-password');
    } else if (req.user.role === 'Instructor') {
      user = await Instructor.findById(req.user.id).select('-password');
    } else if (req.user.role === 'SuperAdmin') {
      user = await SuperAdmin.findById(req.user.id).select('-password');
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    let user;
    user = await Student.findById(req.params.id).select('-password');
    if (!user) user = await Instructor.findById(req.params.id).select('-password');
    if (!user) user = await SuperAdmin.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, email, phone, address, preferences } = req.body;
    let user;

    if (req.user.role === 'Student') {
      user = await Student.findById(req.user.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      user.name = name || user.name;
      user.email = email || user.email;
      if (phone || address || preferences) {
        user.profile = {
          phone: phone || user.profile.phone,
          address: address || user.profile.address,
          preferences: preferences || user.profile.preferences,
        };
      }
    } else if (req.user.role === 'Instructor') {
      user = await Instructor.findById(req.user.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      user.name = name || user.name;
      user.email = email || user.email;
    } else if (req.user.role === 'SuperAdmin') {
      user = await SuperAdmin.findById(req.user.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      user.name = name || user.name;
      user.email = email || user.email;
    }

    await user.save();
    res.json({ message: 'Profile updated successfully', user: user.toObject({ getters: true }) });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

const updateUserById = async (req, res) => {
  try {
    const { name, email, phone, address, preferences } = req.body;
    let user;

    user = await Student.findById(req.params.id);
    if (user) {
      user.name = name || user.name;
      user.email = email || user.email;
      if (phone || address || preferences) {
        user.profile = {
          phone: phone || user.profile.phone,
          address: address || user.profile.address,
          preferences: preferences || user.profile.preferences,
        };
      }
    } else {
      user = await Instructor.findById(req.params.id);
      if (user) {
        user.name = name || user.name;
        user.email = email || user.email;
      } else {
        user = await SuperAdmin.findById(req.params.id);
        if (user) {
          user.name = name || user.name;
          user.email = email || user.email;
        }
      }
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.save();
    res.json({ message: 'User updated successfully', user: user.toObject({ getters: true }) });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    let user;
    user = await Student.findByIdAndDelete(req.params.id);
    if (!user) user = await Instructor.findByIdAndDelete(req.params.id);
    if (!user) user = await SuperAdmin.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  getUserById,
  updateProfile,
  updateUserById,
  deleteUser,
};