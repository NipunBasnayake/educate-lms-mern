const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} = require('../controllers/courseController');

router.post('/', auth(['Instructor', 'SuperAdmin']), createCourse);
router.get('/', auth(['Student', 'Instructor', 'SuperAdmin']), getAllCourses);
router.get('/:id', auth(['Student', 'Instructor', 'SuperAdmin']), getCourseById);
router.put('/:id', auth(['Instructor', 'SuperAdmin']), updateCourse);
router.delete('/:id', auth(['Instructor', 'SuperAdmin']), deleteCourse);

module.exports = router;