const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    options: {
        type: [String], // Array of strings for options
        required: true,
    },
    marks: {
        type: Number,
        required: true,
    },
    correctOption: {
        type: String,
        required: true,
    },
    testId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Test',
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const question = mongoose.model('Question', QuestionSchema);
module.exports=question;