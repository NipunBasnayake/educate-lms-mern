const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MarksSchema = new Schema({
    marks: { type: Number, required: true },
    totalMarks: { type: Number, required: true },
    student: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Marks', MarksSchema);