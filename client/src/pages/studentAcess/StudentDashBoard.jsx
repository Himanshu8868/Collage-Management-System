
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useNotice } from "../../../context/NoticeContext";
import {
  FaBook, FaCalendarAlt, FaBell, FaRegAngry, FaHome,
  FaUser, FaBars, FaTimes, FaChartBar, FaFileAlt,
  FaMoneyBill, FaCreditCard, FaBookOpen, FaClipboardCheck,
  FaExclamationTriangle, FaChevronRight, FaSearch,
  FaDownload, FaUpload, FaCalendarDay, FaBell as FaBellSolid
} from "react-icons/fa";
import { MdAssignment, MdAttachMoney, MdDashboard } from "react-icons/md";

const StudentDashBoard = () => {
  const { notices } = useNotice();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

  // Check screen size
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.querySelector('.sidebar');
      const menuButton = document.querySelector('.menu-button');
      
      if (sidebarOpen && isMobile && sidebar && 
          !sidebar.contains(event.target) && 
          menuButton && !menuButton.contains(event.target)) {
        setSidebarOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen, isMobile]);

  // Sample data for dashboard (keeping your original data)
  const upcomingExams = [
    { id: 1, subject: "Mathematics", date: "Apr 10, 2024", time: "10:00 AM", type: "Final" },
    { id: 2, subject: "Physics", date: "Apr 15, 2024", time: "2:00 PM", type: "Mid-term" },
    { id: 3, subject: "Computer Science", date: "Apr 20, 2024", time: "9:00 AM", type: "Practical" },
  ];

  const recentAssignments = [
    { id: 1, subject: "Mathematics", title: "Calculus Problems", dueDate: "Tomorrow", status: "Pending" },
    { id: 2, subject: "Physics", title: "Lab Report", dueDate: "In 3 days", status: "Submitted" },
    { id: 3, subject: "English", title: "Essay Writing", dueDate: "Next Week", status: "Pending" },
  ];

  const quickStats = [
    { label: "Attendance", value: "92%", icon: "📊", color: "bg-green-100 text-green-800" },
    { label: "CGPA", value: "8.7/10", icon: "⭐", color: "bg-blue-100 text-blue-800" },
    { label: "Pending Tasks", value: "3", icon: "📝", color: "bg-yellow-100 text-yellow-800" },
    { label: "Classes Today", value: "4", icon: "🏫", color: "bg-purple-100 text-purple-800" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Logo and Menu Button */}
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="menu-button p-2 rounded-lg hover:bg-gray-100 lg:hidden"
                aria-label={sidebarOpen ? "Close menu" : "Open menu"}
              >
                {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
              </button>
              
              <Link to="/dashboard" className="ml-4 flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <FaHome className="text-white" size={18} />
                </div>
                <span className="text-xl font-bold text-gray-900 hidden sm:block">
                  Student Portal
                </span>
              </Link>
            </div>

            {/* Right side - User and Notifications */}
            <div className="flex items-center space-x-4">
              {/* Search Bar - Desktop */}
              <div className="hidden md:block relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" size={16} />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 rounded-full hover:bg-gray-100">
                <FaBell className="text-gray-600" size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Profile */}
              <button 
                onClick={() => navigate("/profile")}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center">
                  <FaUser className="text-white" size={18} />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">John Student</p>
                  <p className="text-xs text-gray-500">Computer Science</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex relative">
        {/* Sidebar */}
        <AnimatePresence>
          {(sidebarOpen || !isMobile) && (
            <>
              {/* Backdrop for mobile */}
              {isMobile && sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSidebarOpen(false)}
                  className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                />
              )}
              
              {/* Sidebar Content */}
              <motion.aside
                key="sidebar"
                initial={{ x: isMobile ? -300 : 0 }}
                animate={{ x: 0 }}
                exit={{ x: isMobile ? -300 : 0 }}
                className="sidebar fixed lg:static inset-y-0 left-0 z-50 w-64 lg:w-72 h-full bg-white border-r border-gray-200 overflow-y-auto"
              >
                <div className="h-full px-4 py-6">
                  {/* Sidebar Header */}
                  <div className="flex items-center justify-between mb-8 px-2">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                      <MdDashboard className="mr-3" />
                      Dashboard
                    </h2>
                    <button
                      onClick={() => setSidebarOpen(false)}
                      className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                    >
                      <FaTimes size={18} />
                    </button>
                  </div>

                  {/* Navigation Links */}
                  <nav className="space-y-1 mb-8">
                    {[
                      { to: "/dashboard", icon: <FaHome />, label: "Overview", color: "text-blue-600" },
                      { to: "/student-exam", icon: <FaBook />, label: "Exams", color: "text-green-600" },
                      { to: "/my-results", icon: <FaChartBar />, label: "Results", color: "text-purple-600" },
                      { to: "/attendance", icon: <FaClipboardCheck />, label: "Attendance", color: "text-orange-600" },
                      { to: "/attendance-record", icon: <FaCalendarDay />, label: "Attendance Record", color: "text-red-600" },
                      { to: "/notifications", icon: <FaBellSolid />, label: "Notifications", color: "text-yellow-600" },
                      { to: "/assignment", icon: <MdAssignment />, label: "Course Materials", color: "text-indigo-600" },
                      { to: "/fee-details", icon: <MdAttachMoney />, label: "Fee Details", color: "text-pink-600" },
                      { to: "/payment", icon: <FaCreditCard />, label: "Payments", color: "text-teal-600" },
                      { to: "/schedule", icon: <FaCalendarAlt />, label: "Schedule", color: "text-cyan-600" },
                    ].map((item) => (
                      <Link
                        key={item.label}
                        to={item.to}
                        onClick={() => {
                          if (isMobile) {
                            setSidebarOpen(false);
                          }
                        }}
                        className="flex items-center space-x-4 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 group transition-all duration-200"
                      >
                        <div className={`${item.color} text-lg`}>
                          {item.icon}
                        </div>
                        <span className="flex-1 font-medium">{item.label}</span>
                        <FaChevronRight className="text-gray-400" />
                      </Link>
                    ))}
                  </nav>

                  {/* Quick Stats Card */}
                  <div className="mt-auto p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Academic Status</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">CGPA</span>
                        <span className="font-bold text-gray-900">8.7</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Attendance</span>
                        <span className="font-bold text-green-600">92%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              Welcome back, <span className="text-blue-600">student</span>
            </h1>
            <p className="text-gray-600 mt-2">
              Here's what's happening with your academics today.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {quickStats.map((stat, index) => (
              <div
                key={stat.label}
                className="bg-white rounded-xl p-5 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    <span className="text-lg">{stat.icon}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Notices and Upcoming */}
            <div className="lg:col-span-2 space-y-8">
              {/* Notices Section */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-4">
                  <div className="flex items-center space-x-3">
                    <FaExclamationTriangle className="text-white" size={24} />
                    <h2 className="text-xl font-bold text-white">Latest Notices</h2>
                  </div>
                </div>
                
                <div className="p-6">
                  {notices.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaBell className="text-yellow-500" size={24} />
                      </div>
                      <p className="text-gray-600">No notices available</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {notices.slice(0, 3).map((notice, index) => (
                        <div
                          key={notice._id}
                          className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-100"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900">{notice.title}</h3>
                              <p className="text-gray-600 text-sm mt-1">{notice.content}</p>
                            </div>
                            {notice.expiresAt && (
                              <div className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                                {new Date(notice.expiresAt).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {notices.length > 3 && (
                    <div className="mt-6 text-center">
                      <Link
                        to="/notifications"
                        className="inline-flex items-center text-blue-600 hover:underline"
                      >
                        View all notices
                        <FaChevronRight className="ml-2" size={14} />
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Upcoming Exams */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <FaCalendarAlt className="mr-3 text-blue-500" />
                    Upcoming Exams
                  </h2>
                  <Link
                    to="/student-exam"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View All
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {upcomingExams.map((exam) => (
                    <div
                      key={exam.id}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                          <FaBook className="text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{exam.subject}</h3>
                          <p className="text-sm text-gray-600">{exam.type} Exam</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{exam.date}</p>
                        <p className="text-sm text-gray-600">{exam.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Assignments and Quick Actions */}
            <div className="space-y-8">
              {/* Recent Assignments */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <MdAssignment className="mr-3 text-purple-500" />
                  Recent Assignments
                </h2>
                
                <div className="space-y-4">
                  {recentAssignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">{assignment.subject}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          assignment.status === 'Submitted' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {assignment.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{assignment.title}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Due: {assignment.dueDate}</span>
                        <button className="text-xs text-blue-600 hover:underline">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
                <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-4">
                  <button className="bg-white/20 hover:bg-white/30 p-4 rounded-xl flex flex-col items-center justify-center">
                    <FaUpload size={24} className="mb-2" />
                    <span className="text-sm font-medium">Submit Assignment</span>
                  </button>
                  <button className="bg-white/20 hover:bg-white/30 p-4 rounded-xl flex flex-col items-center justify-center">
                    <FaDownload size={24} className="mb-2" />
                    <span className="text-sm font-medium">Download Materials</span>
                  </button>
                  <button className="bg-white/20 hover:bg-white/30 p-4 rounded-xl flex flex-col items-center justify-center">
                    <FaBookOpen size={24} className="mb-2" />
                    <span className="text-sm font-medium">View Schedule</span>
                  </button>
                  <button className="bg-white/20 hover:bg-white/30 p-4 rounded-xl flex flex-col items-center justify-center">
                    <FaCreditCard size={24} className="mb-2" />
                    <span className="text-sm font-medium">Make Payment</span>
                  </button>
                </div>
              </div>

              {/* Today's Classes */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Today's Classes</h2>
                <div className="space-y-3">
                  {[
                    { time: "9:00 AM", subject: "Mathematics", room: "Room 101" },
                    { time: "11:00 AM", subject: "Physics Lab", room: "Lab 2" },
                    { time: "2:00 PM", subject: "Computer Science", room: "Room 205" },
                    { time: "4:00 PM", subject: "English", room: "Room 103" },
                  ].map((cls, index) => (
                    <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{cls.time}</p>
                        <p className="text-sm text-gray-600">{cls.room}</p>
                      </div>
                      <span className="font-semibold text-blue-600">{cls.subject}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden z-50 shadow-lg">
          <div className="flex justify-around items-center h-16">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex flex-col items-center p-2"
            >
              <FaBars className={`${sidebarOpen ? 'text-blue-600' : 'text-gray-600'}`} size={20} />
              <span className="text-xs mt-1">Menu</span>
            </button>
            <Link to="/dashboard" className="flex flex-col items-center p-2">
              <FaHome className="text-blue-600" size={20} />
              <span className="text-xs mt-1">Home</span>
            </Link>
            <Link to="/student-exam" className="flex flex-col items-center p-2">
              <FaBook className="text-gray-600" size={20} />
              <span className="text-xs mt-1">Exams</span>
            </Link>
            <Link to="/notifications" className="flex flex-col items-center p-2 relative">
              <FaBell className="text-gray-600" size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              <span className="text-xs mt-1">Alerts</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashBoard;