const asyncHandler = require('express-async-handler');
const Lecturer = require('../models/Lecturer');

const createLecturer = asyncHandler(async (req, res) => {
  const { name, email, department } = req.body;

  if (!name || !email || !department) {
    res.status(400);
    throw new Error('Please provide name, email, and department');
  }

  const lecturerExists = await Lecturer.findOne({ email });
  if (lecturerExists) {
    res.status(400);
    throw new Error('Lecturer with this email already exists');
  }

  const lecturer = await Lecturer.create({ name, email, department });

  res.status(201).json({
    _id: lecturer._id,
    name: lecturer.name,
    email: lecturer.email,
    department: lecturer.department,
  });
});

module.exports = { createLecturer };