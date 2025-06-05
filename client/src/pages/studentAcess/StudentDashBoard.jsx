import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom"
import { useNotice } from "../../../context/NoticeContext";

import { FaBook, FaCalendarAlt, FaBell, FaRegAngry } from "react-icons/fa";

const StudentDashBoard = () => {
  const { notices } = useNotice();

  return (

    <div className="mt-14 my-8 flex min-h-screen bg-gray-100 dark:bg-gray-900">
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



          <Link to="/notifications" className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-blue-500">
            <FaBell /> <span>Notification</span>
          </Link>

          <Link to="/assignment" className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-blue-500">
            <FaBell /> <span>Course Materials</span>
          </Link>
          <Link to="/fee-details" className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-blue-500">
            <FaBell /> <span>My fee Details</span>
          </Link>
          <Link to="/payment" className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-blue-500">
            <FaBell /> <span>payment</span>
          </Link>



          <Link to="/schedule" className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-blue-500">
            <FaCalendarAlt /> <span>Schedule</span>
          </Link>

        </ul>
      </motion.aside>

      {/* Main Content */}
      <div className=" h-auto my-10 flex-1 p-6">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-2xl font-semibold text-gray-900 dark:text-white mb-6"
        >
          Welcome, Student!
        </motion.h2>

        {/* Notice Announcement */}

        <motion.div
          className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 shadow-sm mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <svg
              className="w-5 h-5 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />

              {/* NOTICE */}
            </svg>
            <h3 className="font-semibold text-yellow-800">Notices</h3>
          </div>

          {notices.length === 0 ? (
            <p className="text-sm text-yellow-600 py-2">No notices available</p>
          ) : (
            <div className="space-y-3">
              {notices.map((notice) => (
                <motion.div
                  key={notice._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-3 bg-white rounded border border-yellow-100 shadow-xs"
                  whileHover={{ scale: 1.01 }}
                >
                  <h4 className="font-medium text-gray-800 text-sm">{notice.title}</h4>
                  <p className="text-gray-600 text-sm mt-1">{notice.content}</p>
                  {notice.expiresAt && (
                    <p className="text-xs text-gray-500 mt-2">
                      Expires: {new Date(notice.expiresAt).toLocaleDateString()}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

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
