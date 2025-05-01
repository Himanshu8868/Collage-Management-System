import React, { useState } from 'react';
import { 
  FaBook, FaClipboardList, FaCheckCircle, 
  FaClipboardCheck, FaCalendarCheck, FaBars, FaTimes,
  FaChalkboardTeacher, FaUserGraduate, FaChartLine,
  FaRegSquare
} from "react-icons/fa";
import { Link } from "react-router-dom";

const SidebarItem = ({ icon, text, to }) => (
  <Link 
    to={to} 
    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 transition-colors duration-200 rounded-lg"
  >
    <span className="text-blue-500 dark:text-blue-400">{icon}</span>
    <span>{text}</span>
  </Link>
);

const DropdownMenu = ({ title, icon, items }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 dark:text-gray-200 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 rounded-lg transition-colors duration-200"
      >
        <div className="flex items-center gap-3">
          <span className="text-blue-500 dark:text-blue-400">{icon}</span>
          <span>{title}</span>
        </div>
        <svg 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}
      >
        <div className="py-2 pl-8 pr-2 space-y-1">
          {items.map((item, index) => (
            <SidebarItem key={index} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
};

const FacultyDashboard = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const menuItems = [
    {
      title: "Courses",
      icon: <FaBook />,
      items: [
        { icon: <FaClipboardList />, text: "Create Course", to: "/request-course" },
      ]
    },
    {
      title: "Exams",
      icon: <FaCalendarCheck />,
      items: [
        { icon: <FaClipboardCheck />, text: "Create Exam", to: "/exam/create-exam" },
        { icon: <FaCheckCircle />, text: "Edit Exam", to: "/exam/edit-exam" },
        { icon: <FaClipboardList />, text: "View Exams", to: "/exam/view-exams" }
      ]
    },

    {
      title : "Course",
       icon : <FaClipboardCheck /> ,
       items: [
          {icon : <FaClipboardCheck /> , text: "Create Course" , to : "/request-course" },
       ]
    },

    {
       title : "Leave",
       icon : <FaRegSquare />,
       items: [
         {icon : <FaRegSquare /> , text: "Create leave application" , to : "/submit-leave-request" },
         {icon : <FaRegSquare /> , text: "View leave application" , to : "/my-leaves" },
       ]
    },
    // {
    //   title: "Students",
    //   icon: <FaUserGraduate />,
    //   items: [
    //     { icon: <FaChartLine />, text: "My students", to: "/users" },
    //     { icon: <FaCheckCircle />, text: "Manage Grades", to: "/students/grades" }
    //   ]
    // },
       {
    title: "Notifications",
    icon: <FaClipboardList />,
    items: [
      { icon: <FaCheckCircle />, text: " Notification", to: "/notifications" },
    ]
       },
       {
    title: "document",
    icon: <FaClipboardList />,
    items: [
      { icon: <FaCheckCircle />, text: " documnet", to: "/upload-document" },
    ]
       }
      ];

  return (
    <>
      <button
        onClick={() => setDrawerOpen(true)}
        className="mt-10 fixed top-6 left-6 z-30 p-3 text-white bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <FaBars size={20} />
      </button>

      {/* Drawer */}
      <div className={`fixed top-0 left-0 z-40 w-72 h-screen bg-white dark:bg-gray-800 shadow-xl transition-transform duration-300 ease-in-out ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-5 overflow-y-auto h-full">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <FaChalkboardTeacher className="text-blue-600 dark:text-blue-400 text-2xl" />
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Faculty Portal</h2>
            </div>
            <button
              onClick={() => setDrawerOpen(false)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <FaTimes size={18} />
            </button>
          </div>

          <div className="space-y-1">
            {menuItems.map((menu, index) => (
              <DropdownMenu 
                key={index} 
                title={menu.title} 
                icon={menu.icon} 
                items={menu.items} 
              />
            ))}
          </div>

          <div className="absolute bottom-6 left-0 right-0 px-5">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-600 dark:text-blue-400">Need help?</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Contact admin@university.edu</p>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {drawerOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setDrawerOpen(false)}
        />
      )}
    </>
  );
};

export default FacultyDashboard;