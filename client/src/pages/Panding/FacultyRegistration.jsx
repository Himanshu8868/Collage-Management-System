import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from "framer-motion";
import { FiUserCheck, FiUserX, FiClock, FiUsers } from 'react-icons/fi';

const FacultyRegistration = () => {
  const [pendingFaculties, setPendingFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPendingFaculties = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("http://localhost:5000/api/users/pending-faculty", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setPendingFaculties(response.data.pendingFaculties || []);
    } catch (error) {
      console.error("Error fetching pending faculties:", error);
      setError("Failed to fetch pending faculty requests. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (facultyId) => {
    try {
      await axios.put(`http://localhost:5000/api/users/approve-faculty/${facultyId}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      // Show success feedback
      setPendingFaculties(prev => prev.filter(f => f._id !== facultyId));
    } catch (error) {
      console.error("Error approving faculty:", error);
      setError("Failed to approve faculty. Please try again.");
    }
  };

  const handleReject = async (facultyId) => {
    try {
      await axios.put(`http://localhost:5000/api/users/reject-faculty/${facultyId}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      // Show success feedback
      setPendingFaculties(prev => prev.filter(f => f._id !== facultyId));
    } catch (error) {
      console.error("Error rejecting faculty:", error);
      setError("Failed to reject faculty. Please try again.");
    }
  };

  useEffect(() => {
    fetchPendingFaculties();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-4xl text-blue-500 mb-4"
        >
          <FiClock />
        </motion.div>
        <p className="text-lg text-gray-600">Loading pending faculty requests...</p>
      </div>
    );
  }

//   if (error) {
//     return (
//       <div className="mt-14 p-6 text-center">
//         <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
//           <p>{error}</p>
//           <button 
//             onClick={fetchPendingFaculties}
//             className="mt-2 bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

  if (pendingFaculties.length === 0) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center min-h-[300px] p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <FiUsers className="text-5xl text-gray-400 mb-4" />
        <h3 className="text-xl font-medium text-gray-600 mb-2">No Pending Requests</h3>
        <p className="text-gray-500 text-center max-w-md">
          There are currently no pending faculty approval requests. All clear!
        </p>
      </motion.div>
    );
  }

  return (
    <div className=" mt-16 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Pending Faculty Approval Requests
        </h1>
        <p className="text-gray-600">
          {pendingFaculties.length} request{pendingFaculties.length !== 1 ? 's' : ''} pending approval
        </p>
      </motion.div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pendingFaculties.map((faculty) => (
          <motion.div 
            key={faculty._id} 
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            whileHover={{ y: -5 }}
          >
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-700">{faculty.name}</h2>
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                Pending
              </span>
            </div>
            
            <div className="text-gray-600 text-sm space-y-2 mb-6">
              <p className="flex items-center gap-2">
                <span className="font-semibold w-24 inline-block">Email:</span> 
                <span className="truncate">{faculty.email}</span>
              </p>
              {faculty.phone && (
                <p className="flex items-center gap-2">
                  <span className="font-semibold w-24 inline-block">Phone:</span> 
                  {faculty.phone}
                </p>
              )}
              {faculty.address && (
                <p className="flex items-center gap-2">
                  <span className="font-semibold w-24 inline-block">Address:</span> 
                  <span className="truncate">{faculty.address}</span>
                </p>
              )}
              {faculty.Department && (
                <p className="flex items-center gap-2">
                  <span className="font-semibold w-24 inline-block">Department:</span> 
                  {faculty.Department}
                </p>
              )}
            </div>

            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => handleApprove(faculty._id)}
                className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition"
              >
                <FiUserCheck /> Approve
              </button>
              <button 
                onClick={() => handleReject(faculty._id)}
                className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition"
              >
                <FiUserX /> Reject
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FacultyRegistration;