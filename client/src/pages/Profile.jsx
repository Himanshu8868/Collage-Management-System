import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, Settings, LogOut, Edit2, Save } from "lucide-react";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log("Profile API Response:", response.data);
                setUser(response.data);
            } catch (error) {
                console.error("Profile Fetch Error:", error.response?.data || error.message);
                setError("Failed to fetch profile");
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    const handleEditProfile = () => {
        setIsEditing(true);
    };

    const handleSaveProfile = () => {
        setIsEditing(false);
    };

    const handleLogOut = () => { 
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.href = "/login";
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
                ></motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md mx-auto bg-red-100 p-6 rounded-lg shadow-md text-red-700 mt-16"
            >
                <p>{error}</p>
            </motion.div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* Mobile Header */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="lg:hidden fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-md z-50"
            >
                <div className="flex items-center justify-between p-4">
                    <div className="flex items-center">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                        <h1 className="text-xl font-semibold text-gray-900 dark:text-white ml-4">CollegeSync</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleEditProfile}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center"
                        >
                            <Edit2 size={18} className="mr-2" />
                            <span className="hidden sm:inline">Edit</span>
                        </motion.button>
                        <button
                            onClick={handleLogOut}
                            className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Sidebar - Responsive */}
            <AnimatePresence>
                {(sidebarOpen || window.innerWidth >= 1024) && (
                    <motion.div
                        initial={{ x: -300 }}
                        animate={{ x: 0 }}
                        exit={{ x: -300 }}
                        transition={{ duration: 0.3 }}
                        className={`fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg z-40 ${
                            sidebarOpen ? 'block' : 'hidden lg:block'
                        }`}
                    >
                        <div className="p-6 mt-16 lg:mt-20">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white hidden lg:block">CollegeSync</h2>
                            <nav className="mt-6">
                                <ul className="space-y-2">
                                    <li>
                                        <Link
                                            to="/dashboard"
                                            className="flex items-center p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
                                            onClick={() => setSidebarOpen(false)}
                                        >
                                            <User size={20} className="mr-3" />
                                            <span>Dashboard</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="flex items-center p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
                                            onClick={() => setSidebarOpen(false)}
                                        >
                                            <Settings size={20} className="mr-3" />
                                            <span>Settings</span>
                                        </a>
                                    </li>
                                    <li>
                                        <button
                                            onClick={handleLogOut}
                                            className="flex items-center w-full p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
                                        >
                                            <LogOut size={20} className="mr-3" />
                                            <span>Logout</span>
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content - Responsive Layout */}
            <div className={`pt-16 lg:pt-8 lg:ml-64 p-4 lg:p-8 transition-all duration-300 ${
                sidebarOpen ? 'blur-sm lg:blur-0' : ''
            }`}>
                {/* Profile Banner */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 lg:p-6 rounded-lg shadow-md text-white"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold">Welcome, {user?.name}</h1>
                            <p className="mt-2 text-sm lg:text-base">Manage your profile and settings here.</p>
                        </div>
                        <div className="mt-4 sm:mt-0 hidden lg:block">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleEditProfile}
                                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold flex items-center"
                            >
                                <Edit2 size={18} className="mr-2" />
                                Edit Profile
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* Profile Details Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mt-6 lg:mt-8 bg-white dark:bg-gray-800 p-4 lg:p-6 rounded-lg shadow-md"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                        <h2 className="text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white">Profile Details</h2>
                        <div className="mt-4 sm:mt-0">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleEditProfile}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hidden sm:flex items-center"
                            >
                                <Edit2 size={18} className="mr-2" />
                                Edit Profile
                            </motion.button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ProfileDetail label="Status" value={user?.status} />
                        <ProfileDetail label="Name" value={user?.name} />
                        <ProfileDetail label="Email" value={user?.email} />
                        <ProfileDetail label="Course" value={user?.course} />
                        <ProfileDetail label="Semester" value={user?.semester} />
                        <ProfileDetail label="Role" value={user?.role} />
                        <ProfileDetail label="Phone" value={user?.phone} />
                        <ProfileDetail label="Address" value={user?.address} />
                        <ProfileDetail label="Enroll Year" value={user?.enrollYear} />
                        <ProfileDetail label="End Year" value={user?.endYear} />
                        <ProfileDetail label="Department" value={user?.department} />
                        <ProfileDetail label="HOD" value={user?.HOD} />
                    </div>
                </motion.div>

                {/* Additional Info for Tablet/Desktop */}
                <div className="hidden md:grid md:grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mt-6 lg:mt-8">
                    {/* Quick Stats Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
                    >
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Stats</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <span className="text-gray-700 dark:text-gray-300">Active Since</span>
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    {user?.enrollYear || "N/A"}
                                </span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                <span className="text-gray-700 dark:text-gray-300">Current Semester</span>
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    {user?.semester || "N/A"}
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
                    >
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h3>
                        <div className="space-y-3">
                            <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <span className="text-gray-700 dark:text-gray-300 mr-4">Email:</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {user?.email || "N/A"}
                                </span>
                            </div>
                            <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <span className="text-gray-700 dark:text-gray-300 mr-4">Phone:</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {user?.phone || "N/A"}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            <AnimatePresence>
                {isEditing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
                        onClick={() => setIsEditing(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Profile</h2>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <form className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        defaultValue={user?.name}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        defaultValue={user?.email}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Phone
                                    </label>
                                    <input
                                        type="tel"
                                        placeholder="Phone"
                                        defaultValue={user?.phone}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                                    />
                                </div>
                                <div className="flex space-x-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="flex-1 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-3 rounded-lg font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSaveProfile}
                                        className="flex-1 bg-blue-500 text-white px-4 py-3 rounded-lg font-medium flex items-center justify-center"
                                    >
                                        <Save size={18} className="mr-2" />
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Backdrop for mobile sidebar */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

// Reusable Profile Detail Component - Responsive
const ProfileDetail = ({ label, value }) => (
    <motion.div
        whileHover={{ x: 5 }}
        className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
    >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <span className="font-medium text-gray-700 dark:text-gray-300 text-sm sm:text-base mb-1 sm:mb-0">
                {label}:
            </span>
            <span className="text-gray-900 dark:text-white font-semibold text-sm sm:text-base break-words">
                {value || "N/A"}
            </span>
        </div>
    </motion.div>
);

export default Profile;