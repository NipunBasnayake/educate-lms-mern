const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  instructor: { type: Schema.Types.ObjectId, ref: 'Instructor', required: true },
  units: [{ type: Schema.Types.ObjectId, ref: 'Unit' }],
  students: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
  status: { type: String, enum: ['active', 'archived', 'pending'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Course', CourseSchema);