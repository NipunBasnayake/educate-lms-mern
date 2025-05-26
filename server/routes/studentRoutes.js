const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const authMiddleware = require('../middleware/auth');

// Note: Consider adding rate-limiting middleware (e.g., express-rate-limit) to prevent abuse
router.post('/register', authMiddleware(['SuperAdmin']), studentController.registerStudent);
router.post('/login', studentController.loginStudent);
router.get('/', authMiddleware(['SuperAdmin', 'Instructor']), studentController.getAllStudents);
router.get('/:id', authMiddleware(['SuperAdmin', 'Instructor', 'Student']), studentController.getStudentById);
router.put('/:id', authMiddleware(['SuperAdmin', 'Instructor', 'Student']), studentController.updateStudent);
router.delete('/:id', authMiddleware(['SuperAdmin', 'Instructor']), studentController.deleteStudent);
router.get('/:id/enrolled-courses', authMiddleware(['SuperAdmin', 'Instructor', 'Student']), studentController.getStudentEnrolledCourses);
router.get('/:id/performance', authMiddleware(['SuperAdmin', 'Instructor', 'Student']), studentController.getStudentPerformance);

module.exports = router;