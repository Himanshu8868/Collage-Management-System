// src/components/ActivityList.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const ActivityList = ({ currentPage, setTotalActivities }) => {
  const token = localStorage.getItem("token");
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/activity/all", {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            page: currentPage,
            limit: 5,  // Only fetch 5 activities at a time
          },
        });

        setActivities(res.data.activities);
        setTotalActivities(res.data.totalActivities);
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [currentPage, token, setTotalActivities]);

  if (loading) {
    return <p>Loading activities...</p>;
  }

  return (
    <motion.div
      className=" mt-14 bg-orange-300 p-6 text-white-500 rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <h2 className="text-lg font-semibold mb-3 text-gray-700">Recent Activity</h2>
      <ul className="space-y-2">
        {activities.map((activity, index) => (
          <motion.li
            key={index}
            className="border-b py-2 text-gray-600"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.3 }}
          >
            {activity.action}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

export default ActivityList;
