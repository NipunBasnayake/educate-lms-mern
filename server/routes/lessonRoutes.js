const express = require('express');
const router = express.Router();
const lessonController = require('../controllers/lessonController');
const authMiddleware = require('../middleware/auth');

const restrictTo = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

router.post('/', authMiddleware, restrictTo(['SuperAdmin', 'Instructor']), lessonController.createLesson);
router.get('/', authMiddleware, lessonController.getAllLessons);
router.get('/:id', authMiddleware, lessonController.getLessonById);
router.put('/:id', authMiddleware, restrictTo(['SuperAdmin', 'Instructor']), lessonController.updateLesson);
router.delete('/:id', authMiddleware, restrictTo(['SuperAdmin', 'Instructor']), lessonController.deleteLesson);
router.get('/filter', authMiddleware, lessonController.filterLessons);

module.exports = router;