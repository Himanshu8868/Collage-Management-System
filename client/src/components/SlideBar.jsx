import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHome, FaBook, FaClipboardList, FaMoneyBill, FaBell, FaSignOutAlt } from "react-icons/fa";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [success, setSuccess] = useState("");
    // let token = localStorage.getItem("token");
    // let userRole = localStorage.getItem("role");
       
    //    if(!token || !userRole){
    //        window.location.href = "/login";
    //    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        setSuccess("Logout successful");

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
                <SidebarItem icon={<FaBook />} text="Courses" to="/courses" isOpen={isOpen} />
                <SidebarItem icon={<FaClipboardList />} text="Exams" to="/exams" isOpen={isOpen} />
                <SidebarItem icon={<FaMoneyBill />} text="Payments" to="/payments" isOpen={isOpen} />
                <SidebarItem icon={<FaBell />} text="Notifications" to="/notifications" isOpen={isOpen} />
                <SidebarItem icon={<FaSignOutAlt />} text="Logout" isOpen={isOpen} onClick={handleLogout} />
            </nav>

            {/* Success Message */}
            {success && <p className="text-green-500 mt-4">{success}</p>}
        </motion.div>
    );
};

const SidebarItem = ({ icon, text, to, isOpen, onClick }) => {
    return to ? (
        <Link to={to} className="flex items-center gap-4 p-3 hover:bg-gray-700 rounded-lg">
            <div className="text-xl">{icon}</div>
            {isOpen && <span>{text}</span>}
        </Link>
    ) : (
        <button onClick={onClick} className="flex items-center gap-4 p-3 hover:bg-gray-700 rounded-lg w-full text-left">
            <div className="text-xl">{icon}</div>
            {isOpen && <span>{text}</span>}
        </button>
    );
};

export default Sidebar;
