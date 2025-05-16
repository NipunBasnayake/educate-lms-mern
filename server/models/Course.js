const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseCode: {
    type: String,
    required: [true, 'Course code is required'],
    unique: true,
    trim: true,
    uppercase: true,
  },
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  credits: {
    type: Number,
    required: [true, 'Credit value is required'],
    min: [1, 'Minimum 1 credit required'],
    max: 6,
  },
  department: {
    type: String,
    required: true,
    trim: true,
  },
  faculty: {
    type: String,
    required: true,
    trim: true,
  },
  semester: {
    type: String,
    enum: ['Semester 1', 'Semester 2', 'Semester 3'],
    required: true,
  },
  year: {
    type: Number,
    required: true,
    min: 1,
    max: 4,
  },
  lecturer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lecturer',
    required: true,
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Course', courseSchema);
