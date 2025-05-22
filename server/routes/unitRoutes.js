const express = require('express');
const router = express.Router();
const unitController = require('../controllers/unitController');
const authMiddleware = require('../middleware/auth');

// Middleware to check for SuperAdmin or Instructor role
const restrictTo = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

router.post('/', authMiddleware, restrictTo(['SuperAdmin', 'Instructor']), unitController.createUnit);
router.get('/', authMiddleware, restrictTo(['SuperAdmin', 'Instructor']), unitController.getAllUnits);
router.get('/:id', authMiddleware, restrictTo(['SuperAdmin', 'Instructor']), unitController.getUnitById);
router.put('/:id', authMiddleware, restrictTo(['SuperAdmin', 'Instructor']), unitController.updateUnit);
router.delete('/:id', authMiddleware, restrictTo(['SuperAdmin', 'Instructor']), unitController.deleteUnit);
router.post('/:id/subUnit', authMiddleware, restrictTo(['SuperAdmin', 'Instructor']), unitController.addSubUnit);
router.post('/:id/lesson', authMiddleware, restrictTo(['SuperAdmin', 'Instructor']), unitController.addLesson);
router.post('/:id/assessment', authMiddleware, restrictTo(['SuperAdmin', 'Instructor']), unitController.addAssessment);
router.post('/:id/exam', authMiddleware, restrictTo(['SuperAdmin', 'Instructor']), unitController.addExam);
router.post('/:id/studyMaterial', authMiddleware, restrictTo(['SuperAdmin', 'Instructor']), unitController.addStudyMaterial);
router.post('/:id/discussion', authMiddleware, restrictTo(['SuperAdmin', 'Instructor']), unitController.addDiscussion);

module.exports = router;