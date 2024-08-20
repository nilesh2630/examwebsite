const mongoose = require('mongoose');

const TestSchema = new mongoose.Schema({
    questions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question',
        }
    ],
    title: {
        type: String,
        required: true,
    },
    description:{
        type:String,
        required:true,
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

const Test= mongoose.model('Test', TestSchema);
module.exports = Test;

