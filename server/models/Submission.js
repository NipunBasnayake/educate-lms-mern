const mongoose = require('mongoose');
const { mod } = require('three/tsl');
const Schema = mongoose.Schema;

const SubmissionSchema = new Schema({
  student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  assessment: { type: Schema.Types.ObjectId, ref: 'Assessment', required: true },
  content: { type: String },
  score: { type: Number },
  feedback: { type: String },
  submittedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['submitted', 'graded', 'pending'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Submission', SubmissionSchema);