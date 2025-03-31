import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion"; 
import { FiCalendar, FiBookOpen, FiAlertCircle } from "react-icons/fi";
import { toast } from "react-toastify";

const ExamList = () => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchExams = async () => {
             let token =  localStorage.getItem("token")
            try {
                const response = await axios.get("http://localhost:5000/api/exams/exam-details", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                if (response.data.success) {
                    setExams(response.data.Exams);
                } else {
                    setError("No exams found");
                    toast.error("Not exams found")
                }
            } catch (err) {
                console.error("Error fetching exams:", err);
                setError("Failed to fetch exams");
            } finally {
                setLoading(false);
            }
        };
        
        fetchExams();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <motion.div 
                className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
            ></motion.div>
        </div>
    );

    if (error) return (
        <div className="flex justify-center items-center min-h-screen">
            <motion.p 
                className="text-red-600 text-lg flex items-center gap-2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <FiAlertCircle className="text-2xl"/> {error}
            </motion.p>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto p-6">
            <motion.h2 
                className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                📝 Available <span className="text-blue-500">Exams</span>
            </motion.h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    {exams.length === 0 
                        ? "No exams scheduled yet" 
                        : ` ${exams.length} exam${exams.length !== 1 ? 's' : ''} coming up`}
                </p>
            {exams.length === 0 ? (
                <p className="text-center text-gray-500 text-lg">No exams available</p>
            ) : (
                <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    {exams.map((exam, index) => (
                        <motion.div 
                            key={exam._id} 
                            className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                            whileHover={{ scale: 1.05 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-2">{exam.title}</h3>
                            <p className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                <FiCalendar className="text-blue-500" />
                                Date: {new Date(exam.date).toLocaleDateString()}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 mt-2 flex items-center gap-2">
                                <FiBookOpen className="text-green-500" />
                                Course: {exam.course?.name || "Unknown"}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
};

export default ExamList;
