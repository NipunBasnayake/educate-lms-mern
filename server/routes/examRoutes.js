const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const authMiddleware = require('../middleware/auth');

// Middleware to restrict to specific roles
const restrictTo = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

// Create a new exam
router.post('/', authMiddleware, restrictTo(['SuperAdmin', 'Instructor']), examController.createExam);

// Get all exams
router.get('/', authMiddleware, examController.getAllExams);

// Get exam by ID
router.get('/:id', authMiddleware, examController.getExamById);

// Update exam
router.put('/:id', authMiddleware, restrictTo(['SuperAdmin', 'Instructor']), examController.updateExam);

// Delete exam
router.delete('/:id', authMiddleware, restrictTo(['SuperAdmin', 'Instructor']), examController.deleteExam);

// Filter exams
router.get('/filter', authMiddleware, examController.filterExams);

module.exports = router;