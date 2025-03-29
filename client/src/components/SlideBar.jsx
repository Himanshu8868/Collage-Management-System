import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

import { FaHome, FaBook, FaClipboardList, FaMoneyBill, FaBell, FaSignOutAlt, FaChevronDown, FaUser } from "react-icons/fa";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);
    // const [success, setSuccess] = useState("");
    const [isCoursesOpen, setIsCoursesOpen] = useState(false);

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
            className="h-screen bg-gray-800 text-white flex flex-col p-4 shadow-lg"
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
                <SidebarItem icon={<FaHome />} text="Dashboard" to="/dashboard" isOpen={isOpen} />
                
                {/* Courses Dropdown */}
                <div className="relative">
                    <button 
                        onClick={() => setIsCoursesOpen(!isCoursesOpen)} 
                        className="flex items-center gap-4 p-3 hover:bg-gray-700 rounded-lg w-full text-left"
                    >
                        <FaBook className="text-xl" />
                        {isOpen && <span>Courses</span>}
                        {isOpen && <FaChevronDown className={`ml-auto transition-transform ${isCoursesOpen ? "rotate-180" : ""}`} />}
                    </button>
                    {isCoursesOpen && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }} 
                            animate={{ opacity: 1, height: "auto" }}
                            transition={{ duration: 0.3 }}
                            className="ml-6 mt-2 flex flex-col gap-2"
                        >
                            <SidebarItem text="Computer Science" to="/courses/computer-science" isOpen={isOpen} />
                            <SidebarItem text="Mechanical Engineering" to="/courses/mechanical" isOpen={isOpen} />
                            <SidebarItem text="Electrical Engineering" to="/courses/electrical" isOpen={isOpen} />
                            
                        </motion.div>
                    )}
                </div>
                
                <SidebarItem icon={<FaClipboardList />} text="Exams" to="/exams" isOpen={isOpen} />
                <SidebarItem icon={<FaUser />} text="User" to="/Users" isOpen={isOpen} />
                <SidebarItem icon={<FaMoneyBill />} text="Payments" to="/payments" isOpen={isOpen} />
                <SidebarItem icon={<FaBell />} text="Notifications" to="/notifications" isOpen={isOpen} />

                <SidebarItem icon={<FaSignOutAlt />} text="Logout" isOpen={isOpen} onClick={handleLogout} />
            </nav>

            {/* {success && <p className="text-green-500 mt-4">{success}</p>} */}
        </motion.div>
    );
};

const SidebarItem = ({ icon, text, to, isOpen, onClick }) => {
    return to ? (
        <Link to={to} className="flex items-center gap-4 p-3 hover:bg-gray-700 rounded-lg">
            {icon && <div className="text-xl">{icon}</div>}
            {isOpen && <span>{text}</span>}
        </Link>
    ) : (
        <button onClick={onClick} className="flex items-center gap-4 p-3 hover:bg-gray-700 rounded-lg w-full text-left">
            {icon && <div className="text-xl">{icon}</div>}
            {isOpen && <span>{text}</span>}
        </button>
    );
};

export default Sidebar;
