const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  register,
  login,
  getProfile,
  getUserById,
  updateProfile,
  updateUserById,
  deleteUser,
} = require('../controllers/authController');

// router.post('/register', auth(['SuperAdmin']), register);
// router.post('/login', login);
// router.get('/profile', auth(['Student', 'Instructor', 'SuperAdmin']), getProfile);
// router.get('/users/:id', auth(['SuperAdmin']), getUserById);
// router.put('/profile', auth(['Student', 'Instructor', 'SuperAdmin']), updateProfile);
// router.put('/users/:id', auth(['SuperAdmin']), updateUserById);
// router.delete('/users/:id', auth(['SuperAdmin']), deleteUser);

router.post('/register', register);
router.post('/login', login);
router.get('/profile', getProfile);
router.get('/users/:id', getUserById);
router.put('/profile', updateProfile);
router.put('/users/:id', updateUserById);
router.delete('/users/:id', deleteUser);

module.exports = router;