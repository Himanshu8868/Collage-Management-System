import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FiBook, FiUser, FiClock, FiUsers, FiArrowLeft, FiCalendar, FiAward } from "react-icons/fi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const CourseDetails = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/courses/${id}`);
                setCourse(response.data);
            } catch (err) {
                setError("Failed to load course details");
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [id]);

    if (error) return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <h3 className="text-red-700 dark:text-red-300 font-medium">Error loading course</h3>
                <p className="text-red-600 dark:text-red-400 mt-1">{error}</p>
                <div className="mt-4 flex space-x-3">
                    <button 
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-red-100 dark:bg-red-900/50 hover:bg-red-200 dark:hover:bg-red-800 text-red-700 dark:text-red-300 rounded-md"
                    >
                        Retry
                    </button>
                    <Link 
                        to="/courses"
                        className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md"
                    >
                        Back to Courses
                    </Link>
                </div>
            </div>
        </div>
    );

    if (loading) return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8">
                <Skeleton height={40} width={300} />
            </div>
            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <Skeleton count={5} />
                    <Skeleton height={200} className="mt-6" />
                </div>
                <div className="space-y-6">
                    <Skeleton height={120} />
                    <Skeleton height={120} />
                    <Skeleton height={80} />
                </div>
            </div>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link 
                to="/courses" 
                className="inline-flex items-center text-indigo-600 dark:text-purple-100 hover:text-indigo-600 dark:hover:text-indigo-300 mb-6"
            >
                <FiArrowLeft className="mr-2" /> Back to all courses
            </Link>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            {course.name}
                        </h1>
                        <div className="flex flex-wrap gap-2 mb-6">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300">
                                {course.category || "General"}
                            </span>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
                                {course.level || "Beginner"} level
                            </span>
                        </div>
                    </div>

                    <div className="mb-8">
                        <p className="text-lg text-gray-700 dark:text-gray-300">
                            {course.description}
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 mb-8">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                            <FiBook className="mr-2 text-indigo-600 dark:text-indigo-400" />
                            Course Content
                        </h3>
                        <div className="space-y-3">
                            {course.curriculum?.length > 0 ? (
                                course.curriculum.map((item, index) => (
                                    <div key={index} className="flex items-start">
                                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mt-1 mr-3">
                                            <span className="text-xs font-medium text-indigo-800 dark:text-indigo-300">
                                                {index + 1}
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900 dark:text-white">
                                                {item.title}
                                            </h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">Curriculum details coming soon.</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                            <FiUser className="mr-2 text-indigo-600 dark:text-indigo-400" />
                            Instructor
                        </h3>
                        <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0 h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                                <FiUser className="text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">
                                    {course.instructor?.name || "To be announced"}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {course.instructor?.bio || "Expert in this field"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                            <FiClock className="mr-2 text-indigo-600 dark:text-indigo-400" />
                            Course Details
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center">
                                <FiCalendar className="text-gray-500 dark:text-gray-400 mr-3" />
                                <span className="text-gray-700 dark:text-gray-300">
                                    Starts: {course.startDate || "Flexible"}
                                </span>
                            </div>
                            <div className="flex items-center">
                                <FiClock className="text-gray-500 dark:text-gray-400 mr-3" />
                                <span className="text-gray-700 dark:text-gray-300">
                                    Duration: {course.duration || "Self-paced"}
                                </span>
                            </div>
                            <div className="flex items-center">
                                <FiAward className="text-gray-500 dark:text-gray-400 mr-3" />
                                <span className="text-gray-700 dark:text-gray-300">
                                    Certificate: {course.certificate ? "Yes" : "No"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                            <FiUsers className="mr-2 text-indigo-600 dark:text-indigo-400" />
                            Enrolled Students
                        </h3>
                        <div className="space-y-3">
                            {course.studentsEnrolled?.length > 0 ? (
                                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {course.studentsEnrolled.map((student) => (
                                        <li key={student._id} className="py-3">
                                            <div className="flex items-center space-x-3">
                                                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                                    <FiUser className="text-gray-600 dark:text-gray-400" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {student.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        Joined {new Date(student.enrolledAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-gray-500">No students enrolled yet.</p>
                                    <p className="text-sm text-gray-400 mt-1">Be the first to enroll!</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg shadow-md"
                        onClick={() => navigate(`/${course._id}/enroll-course`)}
                    >
                        Enroll Now
                    </motion.button>
                </div>
            </div>
        </div>
    );
};

export default CourseDetails;