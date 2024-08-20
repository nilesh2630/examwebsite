import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { Teststate } from '../context/Testprovider';

const Questionpage = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [timeLeft, setTimeLeft] = useState(3600); 
    const [selections, setSelections] = useState({}); 
    const { user, testId, setTestId } = Teststate();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/');
        }
    }, [navigate, user]);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const { data } = await axios.get(`http://localhost:5000/api/test/${testId}`, config);
                setQuestions(data);
            } catch (error) {
                toast.error('Failed to fetch questions.');
            }
        };

        fetchQuestions();

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev > 0) {
                    return prev - 1;
                } else {
                    clearInterval(timer); 
                    handleSubmitTest(); 
                    return 0;
                }
            });
        }, 1000);

        return () => clearInterval(timer); 
    }, [testId, user]);

    const handleOptionChange = (option) => {
        setSelectedOption(option);
        const questionId = questions[currentQuestionIndex]._id;
        setSelections(prev => ({ ...prev, [questionId]: option }));
    };

    const handleNext = () => {
        if (selectedOption) {
            saveSelection(questions[currentQuestionIndex]._id, selectedOption);
            setCurrentQuestionIndex(prev => (prev + 1) % questions.length);
            setSelectedOption(selections[questions[(currentQuestionIndex + 1) % questions.length]._id] || null);
        } else {
            toast.error('Please select an option before proceeding.');
        }
    };

    const handlePrevious = () => {
        setCurrentQuestionIndex(prev => (prev === 0 ? questions.length - 1 : prev - 1));
        setSelectedOption(selections[questions[(currentQuestionIndex - 1 + questions.length) % questions.length]._id] || null);
    };

    const saveSelection = async (questionId, option) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };
            await axios.post('http://localhost:5000/api/submissions/save', {
                testId,
                selections: [{ questionId, option }]
            }, config);
        } catch (error) {
            toast.error('Failed to save selection.');
        }
    };

    const handleSubmitTest = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };
            await axios.post('http://localhost:5000/api/submissions/submit', { testId }, config);
            toast.success('Test submitted successfully!');
            navigate('/testpage');
        } catch (error) {
            toast.error('Failed to submit the test.');
        }
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${minutes}m ${sec}s`;
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <header className="bg-gray-800 text-white p-4">
                <h1 className="text-xl font-bold">Online Test - CAT Preparation</h1>
            </header>

            <div className="flex flex-1">
                <div className="w-3/4 p-8 bg-white">
                    <h2 className="text-lg font-semibold">
                        {questions.length > 0 ? `Quant - Question ${currentQuestionIndex + 1}` : 'Loading...'}
                    </h2>
                    {questions.length > 0 && (
                        <>
                            <p className="mt-3">{questions[currentQuestionIndex].question}</p>

                            <div className="mt-5">
                                {questions[currentQuestionIndex].options.map(option => (
                                    <div key={option} className="mb-3">
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                name="option"
                                                value={option}
                                                checked={selectedOption === option}
                                                onChange={() => handleOptionChange(option)}
                                                className="form-radio text-indigo-600"
                                            />
                                            <span className="ml-2">{option}</span>
                                        </label>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-between mt-8">
                                <button onClick={handlePrevious} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">Previous</button>
                                <button onClick={handleNext} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">Next</button>
                            </div>

                            <div className="mt-4">
                                <button onClick={handleSubmitTest} className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-800">Submit Test</button>
                            </div>
                        </>
                    )}
                </div>

                {/* Time and Status Section */}
                <div className="w-1/4 p-5 bg-gray-50 border-l">
                    <div className="mb-5">
                        <h3 className="text-xl font-semibold">Time Left</h3>
                        <p className="mt-2 text-2xl">{formatTime(timeLeft)}</p>
                    </div>

                    <div className="mb-5">
                        <h3 className="text-xl font-semibold">Quant</h3>
                        <div className="grid grid-cols-5 gap-2 mt-2">
                            {questions.map((_, index) => (
                                <button
                                    key={index}
                                    className={`w-10 h-10 text-white rounded ${selections[questions[index]._id] ? 'bg-green-500' : 'bg-red-500'}`}
                                    onClick={() => {
                                        setCurrentQuestionIndex(index);
                                        setSelectedOption(selections[questions[index]._id] || null);
                                    }}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Questionpage;
