const mongoose = require("mongoose");

// const { mod } = require("three/tsl");

const Schema = mongoose.Schema;

const AssessmentSchema = new Schema({
  title: { type: String, required: true },
  unit: { type: Schema.Types.ObjectId, ref: "Unit", required: true },
  description: { type: String },
  dueDate: { type: Date },
  maxScore: { type: Number, required: true },
  quizlist: [{ type: Schema.Types.ObjectId, ref: "Quiz" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Assessment", AssessmentSchema);
