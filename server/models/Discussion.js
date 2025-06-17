const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DiscussionSchema = new schema({
    student: { type: Schema.Types.ObjectId, ref: 'Student' },
    instructor: {type: Schema.Types.ObjectId, ref: 'Instructor' },
    unit: {type: Schema.Types.ObjectId, ref: 'Unit' },
    content: [{
        user: String, enum: ['Student', 'Instructor'],
        msg: String,
        Date: Date
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Discussion', DiscussionSchema);