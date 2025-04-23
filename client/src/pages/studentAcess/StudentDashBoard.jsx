import React from "react";
import { motion } from "framer-motion";
import {Link} from "react-router-dom"
import { FaBook, FaCalendarAlt, FaBell , FaRegAngry} from "react-icons/fa";

const StudentDashBoard = () => {
  return (
    
    <div className="mt-14 my-8 flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-64 bg-white dark:bg-gray-800 p-5 shadow-lg"
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Student Dashboard</h2>
        <ul className="mt-6 space-y-4">
          
             
             <Link to="/student-exam"><li className=" my-3 flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-blue-500">
            <FaBook /> <span>Exams</span>
          </li></Link>
          
          <Link to="/my-results"><li className=" my-3 flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-blue-500">
            <FaRegAngry /> <span>Result</span>
          </li></Link>
          
          <Link to="/attendance"><li className=" my-3 flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-blue-500">
            <FaRegAngry /> <span>Attendance</span>
          </li></Link>
          
            
          <Link to="/attendance-record"><li className=" my-3 flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-blue-500">
            <FaRegAngry /> <span>view Attendance</span>
          </li></Link>



          <Link to ="/notifications" className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-blue-500">
            <FaBell /> <span>Notification</span>
          </Link>
          <li className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-blue-500">
            <FaCalendarAlt /> <span>Schedule</span>
          </li>
        </ul>
      </motion.aside>

      {/* Main Content */}
      <div className="my-10 flex-1 p-6">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-2xl font-semibold text-gray-900 dark:text-white mb-6"
        >
          Welcome, Student!
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
        >
          <p className="text-gray-700 dark:text-gray-300">Here are your latest updates:</p>
          <ul className="mt-4 list-disc pl-5 text-gray-600 dark:text-gray-400">
            <li>New assignments posted for Mathematics.</li>
            <li>Upcoming exam on April 10th.</li>
            <li>Campus event this weekend, don't miss out!</li>
          </ul>
        </motion.div>
      </div>
    </div>
  )
};

export default StudentDashBoard;
