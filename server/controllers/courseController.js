const Course = require('../models/Course');
const Lecturer = require('../models/Lecturer');
const asyncHandler = require('express-async-handler');

const createCourse = asyncHandler(async (req, res) => {
  const {
    courseCode,
    title,
    description,
    credits,
    department,
    faculty,
    semester,
    year,
    lecturer,
    status,
  } = req.body;

  if (!courseCode || !title || !credits || !department || !faculty || !semester || !year || !lecturer) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  const courseExists = await Course.findOne({ courseCode: courseCode.toUpperCase() });
  if (courseExists) {
    res.status(400);
    throw new Error('Course code already exists');
  }

  try {
    const lecturerExists = await Lecturer.findById(lecturer);
    if (!lecturerExists) {
      res.status(400);
      throw new Error('Invalid lecturer ID: Lecturer not found');
    }
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(400);
      throw new Error('Invalid lecturer ID format');
    }
    throw error;
  }

  const course = await Course.create({
    courseCode: courseCode.toUpperCase(),
    title,
    description,
    credits,
    department,
    faculty,
    semester,
    year,
    lecturer,
    status: status || 'Active',
  });

  res.status(201).json({
    _id: course._id,
    courseCode: course.courseCode,
    title: course.title,
    description: course.description,
    credits: course.credits,
    department: course.department,
    faculty: course.faculty,
    semester: course.semester,
    year: course.year,
    lecturer: course.lecturer,
    status: course.status,
  });
});

const getCourses = asyncHandler(async (req, res) => {
  const { semester, department, faculty, year } = req.query;

  // Build query object
  const query = {};
  if (semester) query.semester = semester;
  if (department) query.department = department;
  if (faculty) query.faculty = faculty;
  if (year) query.year = Number(year);
  query.status = 'Active'; // Only return active courses

  const courses = await Course.find(query).populate('lecturer', 'name email');
  res.json(courses);
});

const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findOne({
    $or: [{ _id: req.params.id }, { courseCode: req.params.id }],
    status: 'Active',
  }).populate('lecturer', 'name email');

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  res.json(course);
});

const updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  const {
    courseCode,
    title,
    description,
    credits,
    department,
    faculty,
    semester,
    year,
    lecturer,
    status,
  } = req.body;

  if (courseCode && courseCode.toUpperCase() !== course.courseCode) {
    const courseExists = await Course.findOne({ courseCode: courseCode.toUpperCase() });
    if (courseExists) {
      res.status(400);
      throw new Error('Course code already exists');
    }
  }

  if (lecturer) {
    try {
      const lecturerExists = await Lecturer.findById(lecturer);
      if (!lecturerExists) {
        res.status(400);
        throw new Error('Invalid lecturer ID: Lecturer not found');
      }
    } catch (error) {
      if (error.name === 'CastError') {
        res.status(400);
        throw new Error('Invalid lecturer ID format');
      }
      throw error;
    }
  }

  course.courseCode = courseCode ? courseCode.toUpperCase() : course.courseCode;
  course.title = title || course.title;
  course.description = description || course.description;
  course.credits = credits || course.credits;
  course.department = department || course.department;
  course.faculty = faculty || course.faculty;
  course.semester = semester || course.semester;
  course.year = year || course.year;
  course.lecturer = lecturer || course.lecturer;
  course.status = status || course.status;

  const updatedCourse = await course.save();

  res.json({
    _id: updatedCourse._id,
    courseCode: updatedCourse.courseCode,
    title: updatedCourse.title,
    description: updatedCourse.description,
    credits: updatedCourse.credits,
    department: updatedCourse.department,
    faculty: updatedCourse.faculty,
    semester: updatedCourse.semester,
    year: updatedCourse.year,
    lecturer: updatedCourse.lecturer,
    status: updatedCourse.status,
  });
});

const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  course.status = 'Inactive';
  await course.save();

  res.json({ message: 'Course deactivated' });
});

const getCoursesByLecturer = asyncHandler(async (req, res) => {
  try {
    const lecturer = await Lecturer.findById(req.params.lecturerId);
    if (!lecturer) {
      res.status(404);
      throw new Error('Lecturer not found');
    }

    const courses = await Course.find({
      lecturer: req.params.lecturerId,
      status: 'Active',
    }).populate('lecturer', 'name email');

    res.json(courses);
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(400);
      throw new Error('Invalid lecturer ID format');
    }
    throw error;
  }
});

module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getCoursesByLecturer,
};