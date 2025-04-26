import SlideBar from "../../../components/SlideBar";
import { motion } from "framer-motion";

const Dashboard = () => {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  if (role !== "admin") {
    window.location.href = "/not"; 
  }




  return (
    <div className="flex mt-15">
      {/* Sidebar */}
      <SlideBar />

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        <motion.h1
          className="text-3xl font-bold mb-6 text-gray-800"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          College Management Admin Dashboard
        </motion.h1>

        {/* ⚠️ System Announcement */}
        <motion.div
          className="bg-yellow-100 p-4 rounded-lg shadow text-yellow-800 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <strong>Notice:</strong> Upcoming system maintenance on Saturday at 11:00 PM.
        </motion.div>

        {/* ✅ Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { title: "Add Course", action: "/create-courses", color: "bg-blue-500" },
            { title: "Register Faculty", action: "/register/faculty", color: "bg-green-500" },
            { title: "View Reports", action: "/reports", color: "bg-yellow-500" },
            { title: "Attendance Logs", action: "/attendance/logs", color: "bg-purple-500" },
          ].map(({ title, action, color }, i) => (
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

        {/* 📊 Stats Section */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          {["Total Students", "Total Teachers", "Courses Offered"].map((title, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-lg shadow-lg text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
              <p className="text-2xl font-bold text-blue-600">{["5,432", "234", "45"][index]}</p>
            </motion.div>
          ))}
        </div>

        {/* ⏳ Pending Approvals */}
        <motion.div
          className="bg-white p-6 rounded-lg shadow mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-lg font-semibold mb-3 text-gray-700">Pending Approvals</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>3 course creation requests pending</li>
            <li>2 faculty accounts awaiting approval</li>
            <li>5 leave applications to review</li>
          </ul>
        </motion.div>

        {/* 🕘 Recent Activity Section */}
        <motion.div
          className="bg-white p-6 rounded-lg shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2 className="text-lg font-semibold mb-3 text-gray-700">Recent Activity</h2>
          <ul className="space-y-2">
            {[
              "New student registration: John Doe",
              "Professor Smith uploaded new assignments",
              "Admin approved course curriculum update"
            ].map((activity, index) => (
              <motion.li
                key={index}
                className="border-b py-2 text-gray-600"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.3 }}
              >
                {activity}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
