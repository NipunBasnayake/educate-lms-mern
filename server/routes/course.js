const express = require('express');
const router = express.Router();
const {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getCoursesByLecturer,
} = require('../controllers/courseController');

router.route('/')
  .post(createCourse)
  .get(getCourses);

router.route('/:id')
  .get(getCourseById)
  .put(updateCourse)
  .delete(deleteCourse);

router.route('/lecturer/:lecturerId')
  .get(getCoursesByLecturer);

module.exports = router;