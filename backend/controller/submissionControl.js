const Submission = require('../models/sumissionModel');
const question = require('../models/questionModel');
const User = require('../models/userModel');

const mongoose = require('mongoose');
const cron = require('node-cron');
const nodemailer = require('nodemailer');


const saveSelection = async (req, res) => {
    try {
        const { testId, selections } = req.body;
        const userId = req.user._id; // Accessing user ID from the request object

        // Check if there is an existing submission for the test and user
        let submission = await Submission.findOne({ testId, userId });

        if (!submission) {
            // If no submission exists, create a new one
            submission = new Submission({
                testId,
                userId,
                selections,
                endedAt: null,
                isDeleted: false,
            });
        } else {
            selections.forEach(selection => {
                const existingSelection = submission.selections.find(
                    s => s.questionId.toString() === selection.questionId.toString()
                );

                if (existingSelection) {
                    existingSelection.option = selection.option;
                    existingSelection.saveAt = new Date();
                } else {
                    submission.selections.push(selection);
                }
            });
        }

    
        await submission.save();
        res.status(200).json({ message: 'Selection saved successfully.' });

    } catch (error) {
        console.error('Error saving selection:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};


const submitTest = async (req, res) => {
    try {
        const { testId } = req.body;
        const userId = req.user._id; 

        const submission = await Submission.findOne({ testId, userId });

        if (!submission) {
            return res.status(404).json({ message: 'Submission not found.' });
        }

        submission.endedAt = new Date();
        await submission.save();

        res.status(200).json({ message: 'Test submitted successfully.' });

    } catch (error) {
        console.error('Error submitting test:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

// Function to calculate total marks
const calculateTotalMarks = async (selections) => {
    let totalMarks = 0;

    for (const selection of selections) {
        const questions = await question.findById(selection.questionId);

        if (questions && !questions.isDeleted) {
            if (selection.option === questions.correctOption) {
                totalMarks += question.marks; 
            }
        }
    }

    return totalMarks; 
};

async function sendEmail(recipientEmail, subject, text) {
    const transporter = nodemailer.createTransport({
        service: 'gmail', 
        auth: {
            user: 'ng.niesh123@gmail.com', 
            pass: process.env.PASS, // Ensure this environment variable is set
        },
    });

    const mailOptions = {
        from: 'ng.niesh123@gmail.com', // Replace with your email
        to: recipientEmail,
        subject: subject,
        text: text,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

// Cron job to check submissions every 2 minutes
cron.schedule('0 * * * *', async () => {
    try {
        console.log('Checking submissions...');

        const submissions = await Submission.find({ endedAt: { $ne: null }, isDeleted: false });

        for (const submission of submissions) {
            const userId = submission.userId;
            const user = await User.findById(userId); // Assuming you have a User model

            if (user) {
                const totalMarks = await calculateTotalMarks(submission.selections); // Ensure this is awaited
                const subject = 'Test Results';
                const text = `You have scored ${totalMarks} marks in the test.`;
                await sendEmail(user.email, subject, text);

               
                submission.isDeleted = true;
                await submission.save();
            }
        }
    } catch (error) {
        console.error('Error in cron job:', error);
    }
});

module.exports = {
    saveSelection,
    submitTest,
};
