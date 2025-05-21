const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReportSchema = new Schema({
  type: { type: String, enum: ['course_performance', 'student_engagement', 'gradebook'], required: true },
  generatedBy: { type: Schema.Types.ObjectId, ref: 'SuperAdmin' },
  data: { type: Schema.Types.Mixed },
  format: { type: String, enum: ['pdf', 'csv'], default: 'pdf' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', ReportSchema);