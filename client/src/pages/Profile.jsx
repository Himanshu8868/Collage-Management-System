import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await axios.get("http://localhost:5000/api/users/profile", {
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
                className="max-w-md mx-auto bg-red-100 p-6 rounded-lg shadow-md text-red-700"
            >
                <p>{error}</p>
            </motion.div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* Sidebar */}
            <motion.div
                initial={{ x: -100 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.5 }}
                className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg"
            >
                <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">CollegeSync</h2>
                    <nav className="mt-6">
                        <ul className="space-y-2">
                            <li>

                                <Link
                                    to="/dashboard"
                                    className="flex items-center p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
                                >
                                    <span>Dashboard</span>
                                </Link>

                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="flex items-center p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
                                >
                                    <span>Settings</span>
                                </a>
                            </li>
                            <li>
                                <Link
                                    to="/login"
                                    className="flex items-center p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
                                    onClick={handleLogOut}
                                         
                                >
                                    <span>Logout</span>
                                </Link>

                            </li>
                        </ul>
                    </nav>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="ml-64 p-8">
                {/* Profile Banner */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-lg shadow-md text-white"
                >
                    <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
                    <p className="mt-2">Manage your profile and settings here.</p>
                </motion.div>

                {/* Profile Details */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
                >
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Profile Details</h2>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleEditProfile}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                        >
                            Edit Profile
                        </motion.button>
                    </div>

                    <div className="mt-6 space-y-4">
                        <ProfileDetail label="Name" value={user?.name} />
                        <ProfileDetail label="Email" value={user?.email} />
                        <ProfileDetail label="Role" value={user?.role} />
                        <ProfileDetail label="Phone" value={user?.phone} />
                        <ProfileDetail label="Address" value={user?.address} />
                        <ProfileDetail label="Enroll Year" value={user?.enrollYear} />
                        <ProfileDetail label="End Year" value={user?.endYear} />
                        <ProfileDetail label="Department" value={user?.Department} />
                        <ProfileDetail label="HOD" value={user?.HOD} />
                    </div>
                </motion.div>
            </div>

            {/* Edit Profile Modal */}
            <AnimatePresence>
                {isEditing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
                    >
                        <motion.div
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -50, opacity: 0 }}
                            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-96"
                        >
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Profile</h2>
                            <form className="mt-4 space-y-4">
                                <input
                                    type="text"
                                    placeholder="Name"
                                    defaultValue={user?.name}
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    defaultValue={user?.email}
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                                />
                                <button
                                    type="button"
                                    onClick={handleSaveProfile}
                                    className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg"
                                >
                                    Save Changes
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Reusable Profile Detail Component
const ProfileDetail = ({ label, value }) => (
    <motion.div
        whileHover={{ x: 10 }}
        className="flex justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
    >
        <span className="font-medium text-gray-700 dark:text-gray-300">{label}:</span>
        <span className="text-gray-900 dark:text-white">{value || "N/A"}</span>
    </motion.div>
);

export default Profile;