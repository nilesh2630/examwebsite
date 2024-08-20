const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
    testId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Test',
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    selections: [
        {
            questionId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Question',
                required: true,
            },
            option: {
                type: String,
                required: true,
            },
            savedAt: {
                type: Date,
                default: Date.now,
            },
        }
    ],
    endedAt: {
        type: Date,
        default: Date.now,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Submission= mongoose.model('Submission', SubmissionSchema);
module.exports = Submission;
