const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const authMiddleware = require('../middleware/auth');

const restrictTo = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

router.post('/register', studentController.registerStudent);
router.post('/login', studentController.loginStudent);
router.get('/', authMiddleware, restrictTo(['SuperAdmin', 'Instructor']), studentController.getAllStudents);
router.get('/:id', authMiddleware, studentController.getStudentById);
router.put('/:id', authMiddleware, studentController.updateStudent);
router.delete('/:id', authMiddleware, restrictTo(['SuperAdmin', 'Instructor']), studentController.deleteStudent);
router.get('/:id/enrolled-courses', authMiddleware, studentController.getStudentEnrolledCourses);
router.get('/:id/performance', authMiddleware, studentController.getStudentPerformance);

module.exports = router;