import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {toast} from "react-toastify"

const SubmitExam = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [exam, setExam] = useState(null);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState({ text: "", type: "" });
    const [submitting, setSubmitting] = useState(false);
    const [activeQuestion, setActiveQuestion] = useState(0);

    const answeredCount = Object.keys(answers).length;
    const totalQuestions = exam?.questions?.length || 0;
    const allQuestionsAnswered = answeredCount === totalQuestions;

    useEffect(() => {
        const fetchExam = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`http://localhost:5000/api/exams/id/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setExam(response.data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load exam details");
            } finally {
                setLoading(false);
            }
        };

        fetchExam();
    }, [id]);

    const handleChange = (questionId, selectedOption) => {
        setAnswers(prev => ({ ...prev, [questionId]: selectedOption }));
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setMessage({ text: "Session expired. Please login again.", type: "error" });
                return;
            }

            const formattedAnswers = Object.entries(answers).map(([questionId, selectedOption]) => ({
                questionId,
                selectedOption
            }));

            const response = await axios.post(
                `http://localhost:5000/api/exams/submit/${id}`,
                { answers: formattedAnswers },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMessage({
                text: `Exam submitted successfully! Score: ${response.data?.score || 0}/${totalQuestions}`,
                type: "success"
            });

            // Redirect after 3 seconds
            setTimeout(() => {
                navigate("/exams");
            }, 3000);
        } catch (err) {
               toast.error(err.response?.data?.message || "Submission failed. Please try again.");
            setMessage({ 
                text: err.response?.data?.message || "Submission failed. Please try again.", 
                type: "error" 
            });
        } finally {
            setSubmitting(false);
        }
    };

    const navigateQuestion = (direction) => {
        setActiveQuestion(prev => {
            if (direction === 'prev' && prev > 0) return prev - 1;
            if (direction === 'next' && prev < totalQuestions - 1) return prev + 1;
            return prev;
        });
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="text-center p-8 bg-white rounded-xl shadow-md max-w-md w-full">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h2 className="text-xl font-semibold text-gray-800">Loading Exam</h2>
                <p className="text-gray-600 mt-2">Preparing your test environment...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Exam</h2>
                <p className="text-gray-600 mb-6">{error}</p>
                <button 
                    onClick={() => window.location.reload()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    Try Again
                </button>
            </div>
        </div>
    );

    return (
        <div className=" mt-14 min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Exam Header */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                    <div className="p-6 md:p-8 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                        <h1 className="text-2xl md:text-3xl font-bold">{exam.title}</h1>
                        <div className="flex flex-wrap gap-4 mt-3 text-blue-100">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span>{new Date(exam.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                                </svg>
                                <span>{exam.course?.name || "General"}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-6 md:p-8">
                        {/* Progress Bar */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-gray-700">
                                    Progress: {answeredCount}/{totalQuestions} questions
                                </span>
                                <span className="text-sm font-medium text-blue-600">
                                    {Math.round((answeredCount / totalQuestions) * 100)}% Complete
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div 
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500" 
                                    style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Current Question */}
                        <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                Question {activeQuestion + 1}: {exam.questions[activeQuestion].questionText}
                            </h3>
                            <div className="space-y-3">
                                {exam.questions[activeQuestion].options.map((option, i) => (
                                    <label 
                                        key={i} 
                                        className={`flex items-center p-4 rounded-lg cursor-pointer transition ${
                                            answers[exam.questions[activeQuestion]._id] === option 
                                                ? 'bg-blue-50 border border-blue-200' 
                                                : 'bg-white border border-gray-200 hover:border-blue-300'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name={`question-${exam.questions[activeQuestion]._id}`}
                                            value={option}
                                            checked={answers[exam.questions[activeQuestion]._id] === option}
                                            onChange={() => handleChange(exam.questions[activeQuestion]._id, option)}
                                            className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="ml-3 text-gray-700">{option}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Navigation and Submit */}
                        <div className="flex justify-between items-center">
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => navigateQuestion('prev')}
                                    disabled={activeQuestion === 0}
                                    className={`px-4 py-2 rounded-lg flex items-center ${
                                        activeQuestion === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'
                                    }`}
                                >
                                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                                    </svg>
                                    Previous
                                </button>
                                <button
                                    onClick={() => navigateQuestion('next')}
                                    disabled={activeQuestion === totalQuestions - 1}
                                    className={`px-4 py-2 rounded-lg flex items-center ${
                                        activeQuestion === totalQuestions - 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'
                                    }`}
                                >
                                    Next
                                    <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                    </svg>
                                </button>
                            </div>
                            
                            <button
                                onClick={handleSubmit}
                                disabled={submitting || !allQuestionsAnswered}
                                className={`px-6 py-3 rounded-lg text-white font-medium transition ${
                                    submitting ? 'bg-blue-400' : 
                                    !allQuestionsAnswered ? 'bg-gray-400 cursor-not-allowed' : 
                                    'bg-blue-600 hover:bg-blue-700'
                                }`}
                            >
                                {submitting ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Submitting...
                                    </span>
                                ) : (
                                    <span className="flex items-center">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                        Submit Exam
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Status Message */}
                {message.text && (
                    <div className={`p-4 rounded-lg mb-8 ${
                        message.type === "error" ? "bg-red-100 text-red-700" :
                        "bg-green-100 text-green-700"
                    }`}>
                        {message.text}
                    </div>
                )}

                {/* Completion Reminder */}
                {!allQuestionsAnswered && answeredCount > 0 && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-yellow-700">
                                    You've answered {answeredCount} of {totalQuestions} questions. Please complete all questions before submitting.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubmitExam;