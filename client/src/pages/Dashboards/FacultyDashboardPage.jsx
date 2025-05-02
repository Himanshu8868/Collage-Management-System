import React from 'react';
import FacultyDashboard from './FacultyDashboard';
import { motion } from "framer-motion";
import { useNotice } from "../../../context/NoticeContext";


const FacultyDashboardPage = () => {
  const {notices} = useNotice();
  return (
    
    <>

    <FacultyDashboard />
      {/* Stats Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 mt-20 ">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Total Courses</h2>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">5</p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Active Students</h2>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">120</p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Upcoming Exams</h2>
          <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-2">3</p>
        </div>
      </div>

      {/* Charts / Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Exam Performance Overview</h2>
          <div className="h-48 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 dark:text-gray-300">
            📊 Chart Placeholder
          </div>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Attendance Summary</h2>
          <div className="h-48 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 dark:text-gray-300">
            📈 Chart Placeholder
          </div>
        </div>
      </div>

      {/* Quick Links & Notices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Quick Actions</h2>
          <ul className="space-y-2 text-blue-600 dark:text-blue-400">
            <li><a href="/create-exam" className="hover:underline">➕ Create New Exam</a></li>
            <li><a href="/exam/create-exam" className="hover:underline">📝 Schedule Exam</a></li>
            <li><a href="/students/grades" className="hover:underline">🎯 Manage Grades</a></li>
          </ul>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Notices</h2>
          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-3">
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
                            {/* {notice.expiresAt && (
                              <p className="text-xs text-gray-500 mt-2">
                                Expires: {new Date(notice.expiresAt).toLocaleDateString()}
                              </p>
                            )} */}
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
            
          </ul>
        </div>
      </div>
      </>
  );
};

export default FacultyDashboardPage;
