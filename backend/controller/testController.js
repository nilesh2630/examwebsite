const Test=require('../models/testModel')
const asyncHandler=require("express-async-handler");
const question = require('../models/questionModel'); 
const fetchTest = asyncHandler( async (req, res) => {
    try {
        const tests = await Test.find({ isDeleted: false });
        return res.status(200).json(tests);
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});


const fetchQuestion =asyncHandler( async (req, res) => {
    try {
        const { testId } = req.params;
 
        // Find all questions associated with the given testId and exclude the correctOption field
        const questions = await question.find({ testId: testId, isDeleted: false }).select('-correctOption');

        if (questions.length === 0) {
            return res.status(404).json({ message: 'No questions found for this test.' });
        }

        // Send the questions as the response
        res.status(200).json(questions);
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});



module.exports = {fetchTest,fetchQuestion};


