import React, { useState, useEffect } from "react";
import SlideBar from "../../../components/SlideBar";
import { motion } from "framer-motion";
import axios from "axios";

const Dashboard = () => {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const [pendingCourses, setPendingCourses] = useState(0);
  const [pendingFaculties, setPendingFaculties] = useState(0);
  const [pendingLeaves, setPendingLeaves] = useState(0);
  const [loadingPending, setLoadingPending] = useState(true);

  const [recentActivities, setRecentActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(true);

  useEffect(() => {
    if (role !== "admin") {
      window.location.href = "/not";
      return;
    }

    // Fetch pending counts
    const fetchPendingCounts = async () => {
      try {
        const [courseRes, facultyRes, leaveRes] = await Promise.all([
          axios.get("http://localhost:5000/api/courses/pending-requests", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/users/pending-faculty", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/leaves/pending-requests", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setPendingCourses(courseRes?.data?.pendingCourses?.length || 0);
        setPendingFaculties(facultyRes?.data?.pendingFaculties?.length || 0);
        setPendingLeaves(leaveRes?.data?.pendingLeaves?.length || 0);
      } catch (error) {
        console.error("Failed to fetch pending approvals:", error);
      } finally {
        setLoadingPending(false);
      }
    };

    // Fetch 5 recent activities
    const fetchRecentActivities = async () => {
      try {
        const activityRes = await axios.get(
          `http://localhost:5000/api/activity/recent?limit=5`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setRecentActivities(activityRes?.data?.activities || []);
      } catch (error) {
        console.error("Failed to fetch recent activities:", error);
      } finally {
        setLoadingActivities(false);
      }
    };

    fetchPendingCounts();
    fetchRecentActivities();
  }, [token, role]);

  const quickActions = [
    { title: "Add Course", action: "/create-courses", color: "bg-blue-500" },
    { title: "Register Faculty", action: "/register/faculty", color: "bg-green-500" },
    { title: "View Reports", action: "/reports", color: "bg-yellow-500" },
    { title: "Attendance Logs", action: "/attendance/logs", color: "bg-purple-500" },
  ];

  const stats = [
    { title: "Total Students", value: "5,432" },
    { title: "Total Teachers", value: "234" },
    { title: "Courses Offered", value: "45" },
  ];

  return (
    <div className="flex mt-15">
      {/* Sidebar */}
      <SlideBar />

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        {/* Heading */}
        <motion.h1
          className="text-3xl font-bold mb-6 text-gray-800"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          College Management Admin Dashboard
        </motion.h1>

        {/* System Announcement */}
        <motion.div
          className="bg-yellow-100 p-4 rounded-lg shadow text-yellow-800 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <strong>Notice:</strong> Upcoming system maintenance on Saturday at 11:00 PM.
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {quickActions.map(({ title, action, color }, i) => (
            <motion.div
              key={i}
              className={`${color} text-white py-4 px-6 rounded shadow hover:opacity-90 cursor-pointer`}
              onClick={() => window.location.href = action}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              {title}
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {stats.map(({ title, value }, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-lg shadow-lg text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
              <p className="text-2xl font-bold text-blue-600">{value}</p>
            </motion.div>
          ))}
        </div>

        {/* Pending Approvals */}
        <motion.div
          className="bg-white p-6 rounded-lg shadow mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-lg font-semibold mb-3 text-gray-700">Pending Approvals</h2>

          {loadingPending ? (
            <p className="text-gray-500">Loading pending approvals...</p>
          ) : (
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>{pendingCourses} course creation requests pending</li>
              <li>{pendingFaculties} faculty accounts awaiting approval</li>
              <li>{pendingLeaves} leave applications to review</li>
            </ul>
          )}
        </motion.div>

        {/* Recent Activities */}
        <motion.div
          className="bg-white p-6 rounded-lg shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2 className="text-lg font-semibold mb-3 text-gray-700">Recent Activity</h2>
          {loadingActivities ? (
            <p className="text-gray-500">Loading recent activities...</p>
          ) : (
            <>
              <ul className="space-y-2">
                {recentActivities.map((activity, index) => (
                  <motion.li
                    key={activity._id}
                    className="border-b py-2 text-gray-600"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.3 }}
                  >
                    <strong>{activity.user.name}</strong> : {activity.action}{" "}
                    <span className="text-sm text-gray-500">
                      {new Date(activity.timestamp).toLocaleString()}
                    </span>
                  </motion.li>
                ))}
              </ul>

              <div className="flex justify-end mt-4">
                <button
                  onClick={() => window.location.href = "/activities"}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  See All
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
