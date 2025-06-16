// Quiz.js
const mongoose = require('mongoose');
const marks = require('./Marks');
const Schema = mongoose.Schema;

const QuizSchema = new Schema({
    question: { type: String, required: true, unique: true },
    options: { type: [String], required: true },
    answer: { type: Number, required: true },
    unit: [{ type: Schema.Types.ObjectId, ref: 'Unit' }],
    mark: { type: Number },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quiz', QuizSchema);