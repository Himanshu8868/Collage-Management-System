import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ExamDetails = () => {
    const { id } = useParams(); // Get exam ID from URL
    const [exam, setExam] = useState(null);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const fetchExam = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`http://localhost:5000/api/exams/id/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setExam(response.data);
            } catch (err) {
                setError("Failed to load exam details");
            } finally {
                setLoading(false);
            }
        };

        fetchExam();
    }, [id]);

    const handleChange = (questionId, selectedOption) => {
        setAnswers({ ...answers, [questionId]: selectedOption });
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(`http://localhost:5000/api/exams/${id}/submit`, { answers }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            console.log("Submission Response:", response.data);
            
            if (response.data.success) {
                setMessage(`Exam submitted successfully! Your Score: ${response.data.score}`);
            } else {
                setMessage("Exam submitted, but no score received.");
            }
        } catch (err) {
            console.error("Error submitting exam:", err.response?.data || err.message);
            setMessage(`Failed to submit exam: ${err.response?.data?.message || "Unknown error"}`);
        }
    };

    if (loading) return <p className="text-center text-lg">Loading exam details...</p>;
    if (error) return <p className="text-red-500 text-center">{error}</p>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-2xl font-semibold text-center mb-4">{exam.title}</h2>
            <p className="text-gray-700 dark:text-gray-300">Date: {new Date(exam.date).toLocaleDateString()}</p>
            <p className="text-gray-600 dark:text-gray-400 mt-2"><strong>Course:</strong> {exam.course?.name || "Unknown"}</p>
            
            <h3 className="text-lg font-semibold mt-6">Exam Questions:</h3>
            <form className="mt-4">
                {exam.questions.length > 0 ? (
                    exam.questions.map((question, index) => (
                        <div key={question._id} className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                            <p className="text-gray-700 dark:text-gray-300"><strong>Q{index + 1}:</strong> {question.questionText}</p>
                            <div className="mt-2">
                                {question.options.map((option, i) => (
                                    <label key={i} className="block text-gray-600 dark:text-gray-400">
                                        <input
                                            type="radio"
                                            name={`question-${question._id}`}
                                            value={option}
                                            onChange={() => handleChange(question._id, option)}
                                            className="mr-2"
                                        />
                                        {option}
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No questions available.</p>
                )}
                <button
                    type="button"
                    onClick={handleSubmit}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Submit Exam
                </button>
                {message && <p className="mt-2 text-center text-green-500">{message}</p>}
            </form>
        </div>
    );
};

export default ExamDetails;