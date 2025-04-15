import SlideBar from "../../../components/SlideBar";
import { useState } from "react";

const AdminPanel = () => {
  // You can manage the state for expanding/collapsing the sidebar if needed
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-blue-800 text-white h-full transition-all duration-300`}
      >
        <SlideBar />
      </div>

      {/* Main content */}
      <div className="flex-1 p-6">
        <h1 className="text-4xl font-semibold text-blue-700 mb-6">Admin Dashboard</h1>
        
        {/* Dashboard Content */}
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <div className="text-lg font-medium text-gray-700">
            <p>Welcome to the Admin Panel! You can manage all aspects of the platform from here.</p>
          </div>

          {/* Quick Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-green-500 text-white p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold">Total Students</h3>
              <p className="text-2xl">120</p>
            </div>
            <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold">Total Courses</h3>
              <p className="text-2xl">15</p>
            </div>
            <div className="bg-yellow-500 text-white p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold">Upcoming Exams</h3>
              <p className="text-2xl">5</p>
            </div>
          </div>

          {/* More Dashboard content can go here */}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
