import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FiBook, FiUser, FiClock, FiArrowRight } from "react-icons/fi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                // Simulate network delay for demo purposes
                await new Promise(resolve => setTimeout(resolve, 800));
                const response = await axios.get("http://localhost:5000/api/courses");
                setCourses(response.data);
            } catch (error) {
                console.error(error);   
                setError("Failed to fetch courses. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        
        fetchCourses();
    }, []);

    // Animation variants
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    if (error) return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-4xl mx-auto p-6"
        >
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <h3 className="text-red-700 dark:text-red-300 font-medium">Error loading courses</h3>
                <p className="text-red-600 dark:text-red-400 mt-1">{error}</p>
                <button 
                    onClick={() => window.location.reload()}
                    className="mt-3 px-4 py-2 bg-red-100 dark:bg-red-900/50 hover:bg-red-200 dark:hover:bg-red-800 text-red-700 dark:text-red-300 rounded-md transition-colors"
                >
                    Retry
                </button>
            </div>
        </motion.div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12"
            >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                    Explore Our Courses
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Learn from industry experts and take your skills to the next level
                </p>
            </motion.div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, index) => (
                        <motion.div
                            key={index}
                            
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden h-full border border-gray-200 dark:border-gray-700">
                                <Skeleton height={160} />
                                <div className="p-5">
                                    <Skeleton count={2} />
                                    <div className="mt-4 flex items-center">
                                        <Skeleton circle width={24} height={24} />
                                        <Skeleton width={100} className="ml-2" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {courses.map((course) => (
                        <motion.div
                            key={course._id}
                            variants={item}
                            whileHover={{ y: -5 }}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden h-full border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300"
                        >
                            <div className="relative h-40 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                                <FiBook className="text-white text-5xl opacity-80" />
                                <div className="absolute top-3 right-3 bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                                    {course.duration || "8 weeks"}
                                </div>
                            </div>
                            
                            <div className="p-5">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                            {course.name}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                                            {course.description}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                                            <FiUser className="text-indigo-600 dark:text-indigo-400 text-sm" />
                                        </div>
                                        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                                            {course.instructor?.name || "TBA"}
                                        </span>
                                    </div>
                                    
                                    <button className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center transition-colors">
                                        <Link to={`/courses/${course._id}`}>
                                        View details <FiArrowRight className="ml-1" />
                                      </Link>
                                    </button>
                                </div>
                                
                                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center text-sm text-gray-500 dark:text-gray-400">
                                    <FiClock className="mr-1" />
                                    <span>{course.level || "Beginner"} level</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}
            
            {!loading && courses.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                >
                    <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                        <FiBook className="text-gray-400 text-3xl" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                        No courses available
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                        We're currently working on new courses. Check back soon!
                    </p>
                </motion.div>
            )}
        </div>
    );
};

export default Courses;