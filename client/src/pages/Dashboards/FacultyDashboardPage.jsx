import React from 'react';
import FacultyDashboard from './FacultyDashboard';

const FacultyDashboardPage = () => {
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
            <li>📌 Grade submission deadline: <strong>April 30</strong></li>
            <li>📌 Faculty meeting: <strong>May 2 at 10:00 AM</strong></li>
            <li>📌 Exam duty schedule will be released soon.</li>
          </ul>
        </div>
      </div>
      </>
  );
};

export default FacultyDashboardPage;
