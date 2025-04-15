import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaBook, FaClipboardList, FaMoneyBill, FaBell, FaSignOutAlt, FaChevronDown, FaUser } from "react-icons/fa";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [isCoursesOpen, setIsCoursesOpen] = useState(false);
    const [isExamsOpen, setIsExamsOpen] = useState(false); 
    const [isResultOpen, setIsResultOpen] = useState(false); 

    const handleLogout = () => {
        localStorage.removeItem("token");
        toast.success("Logout successful");
        setTimeout(() => {
            window.location.href = "/login";
        }, 1500);
    };

    return (
        <motion.div
            animate={{ width: isOpen ? "250px" : "70px" }}
            className="h-auto bg-gray-800 text-white flex flex-col p-4 shadow-lg"
        >
            <button onClick={() => setIsOpen(!isOpen)} className="mb-6 focus:outline-none">
                <motion.div
                    animate={{ rotate: isOpen ? 0 : 180 }}
                    transition={{ duration: 0.3 }}
                    className="text-2xl"
                >
                    ☰
                </motion.div>
            </button>

            <nav className="flex flex-col gap-4">
                {/* Sidebar Items */}
                <SidebarItem icon={<FaHome />} text="Dashboard" to="/dashboard" isOpen={isOpen} />

                {/* Courses Dropdown */}
                <div className="relative group">
                    <button
                        onClick={() => setIsCoursesOpen(!isCoursesOpen)}
                        className="flex items-center gap-4 p-3 hover:bg-gray-700 rounded-lg w-full text-left"
                    >
                        <FaBook className="text-xl" />
                        <span className={`${!isOpen && "opacity-0"} transition-opacity duration-200`}>
                            Manage Courses
                        </span>
                        {isOpen && <FaChevronDown className={`ml-auto transition-transform ${isCoursesOpen ? "rotate-180" : ""}`} />}
                    </button>
                    {isCoursesOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            transition={{ duration: 0.3 }}
                            className="ml-6 mt-2 flex flex-col gap-2"
                        >
                            <SidebarItem text="Update Course" to="/update-course" isOpen={isOpen} />
                            <SidebarItem text="Create Course" to="/create-courses" isOpen={isOpen} />
                        </motion.div>
                    )}
                </div>

                {/* Exams Dropdown */}
                <div className="relative group">
                    <button
                        onClick={() => setIsExamsOpen(!isExamsOpen)}
                        className="flex items-center gap-4 p-3 hover:bg-gray-700 rounded-lg w-full text-left"
                    >
                        <FaClipboardList className="text-xl" />
                        <span className={`${!isOpen && "opacity-0"} transition-opacity duration-200`}>
                            Exams
                        </span>
                        {isOpen && <FaChevronDown className={`ml-auto transition-transform ${isExamsOpen ? "rotate-180" : ""}`} />}
                    </button>
                    {isExamsOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            transition={{ duration: 0.3 }}
                            className="ml-6 mt-2 flex flex-col gap-2"
                        >
                            <SidebarItem text="Create Exam" to="/exam/create-exam" isOpen={isOpen} />
                            <SidebarItem text="Edit Exam" to="/exam/edit-exam" isOpen={isOpen} />
                            <SidebarItem text="View Exams" to="/exam/view-exams" isOpen={isOpen} />
                        </motion.div>
                    )}
                </div>

                {/* Result Dropdown */}
                <div className="relative group">
                    <button
                        onClick={() => setIsResultOpen(!isResultOpen)}
                        className="flex items-center gap-4 p-3 hover:bg-gray-700 rounded-lg w-full text-left"
                    >
                        <FaClipboardList className="text-xl" />
                        <span className={`${!isOpen && "opacity-0"} transition-opacity duration-200`}>
                            Manage Results
                        </span>
                        {isOpen && <FaChevronDown className={`ml-auto transition-transform ${isResultOpen ? "rotate-180" : ""}`} />}
                    </button>
                    {isResultOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            transition={{ duration: 0.3 }}
                            className="ml-6 mt-2 flex flex-col gap-2"
                        >
                            <SidebarItem text="See Results" to="/all-results" isOpen={isOpen} />
                            <SidebarItem text="Update Result" to="/update-result" isOpen={isOpen} />
                            <SidebarItem text="Delete Result" to="/delete-result" isOpen={isOpen} />
                        </motion.div>
                    )}
                </div>

                {/* Other Sidebar Items */}
                <SidebarItem icon={<FaUser />} text="User" to="/users" isOpen={isOpen} />
                <SidebarItem icon={<FaMoneyBill />} text="Payments" to="/payments" isOpen={isOpen} />
                <SidebarItem icon={<FaBell />} text="Notifications" to="/notifications" isOpen={isOpen} />
                <SidebarItem icon={<FaSignOutAlt />} text="Logout" isOpen={isOpen} onClick={handleLogout} />
            </nav>
        </motion.div>
    );
};

const SidebarItem = ({ icon, text, to, isOpen, onClick }) => {
    return to ? (
        <Link to={to} className="flex items-center gap-4 p-3 hover:bg-gray-700 rounded-lg group">
            {icon && <div className="text-xl">{icon}</div>}
            <span className={`${!isOpen && "opacity-0"} group-hover:opacity-100 transition-opacity duration-200`}>
                {text}
            </span>
        </Link>
    ) : (
        <button onClick={onClick} className="flex items-center gap-4 p-3 hover:bg-gray-700 rounded-lg group w-full text-left">
            {icon && <div className="text-xl">{icon}</div>}
            <span className={`${!isOpen && "opacity-0"} group-hover:opacity-100 transition-opacity duration-200`}>
                {text}
            </span>
        </button>
    );
};

export default Sidebar;
