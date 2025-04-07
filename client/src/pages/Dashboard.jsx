import SlideBar from "../components/SlideBar";
import { motion } from "framer-motion";

const Dashboard = () => {
      localStorage.getItem("role");
      localStorage.getItem("token")
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
                
                {/* Stats Section */}
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

                {/* Recent Activity Section */}
                <motion.div 
                    className="bg-white p-6 rounded-lg shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                >
                    <h2 className="text-lg font-semibold mb-3 text-gray-700">Recent Activity</h2>
                    <ul className="space-y-2">
                        {["New student registration: John Doe", "Professor Smith uploaded new assignments", "Admin approved course curriculum update"].map((activity, index) => (
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
