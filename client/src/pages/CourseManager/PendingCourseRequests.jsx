import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiAlertCircle, FiCheckCircle, FiXCircle, FiClock, FiUser, FiBook, FiMail } from "react-icons/fi";
import {toast} from "react-toastify"

const PendingCourseRequests = () => {
  const [pendingCourses, setPendingCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPendingCourses = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/courses/pending-requests", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPendingCourses(response.data.pendingCourses);
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingCourses();
  }, [token]);

  const handleAction = async (courseId, action) => {
    setActionLoading(courseId);
    try {
      await axios.patch(
        `http://localhost:5000/api/courses/${action}-course/${courseId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setPendingCourses(prev => prev.filter(course => course._id !== courseId));
      setSuccessMessage(`Course ${action}d successfully!`);
      toast.success(" Success")
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(`Failed to ${action} course: ${err.response?.data?.message || err.message}`);
      toast.error("failed")
      setTimeout(() => setError(""), 5000);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
      <p className="text-gray-600">Loading pending requests...</p>
    </div>
  );


  return (
    <div className=" mt-13 min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Course Approval Dashboard</h1>
            <div className="flex items-center space-x-2">
              <FiClock className="text-indigo-600" size={20} />
              <span className="text-gray-600">{new Date().toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Pending Course Requests</h2>
                <p className="text-gray-600">Review and approve/reject new course submissions</p>
              </div>
              <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                {pendingCourses.length} Pending
              </div>
            </div>
          </div>
        </div>

        

        {/* Content */}
        {pendingCourses.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <FiBook className="mx-auto text-gray-400" size={48} />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No pending requests</h3>
            <p className="mt-1 text-gray-500">All course requests have been processed.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {pendingCourses.map((course) => (
              <div key={course._id} className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center mb-2">
                        <h2 className="text-xl font-bold text-gray-900 mr-3">{course.name}</h2>
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          {course.code}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">{course.description}</p>
                    </div>
                    <div className="bg-yellow-50 text-yellow-800 px-2 py-1 rounded text-xs font-medium flex items-center">
                      <FiClock className="mr-1" size={14} />
                      Pending
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center mb-1">
                        <FiUser className="text-indigo-600 mr-2" size={16} />
                        <span className="font-medium text-gray-700">Instructor</span>
                      </div>
                      <div className="pl-6">
                        <p className="text-gray-900">{course.instructor?.name}</p>
                        <div className="flex items-center text-gray-600 text-sm">
                          <FiMail className="mr-1" size={14} />
                          {course.instructor?.email}
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center mb-1">
                        <FiUser className="text-indigo-600 mr-2" size={16} />
                        <span className="font-medium text-gray-700">Enrollment</span>
                      </div>
                      <div className="pl-6">
                        <p className="text-gray-900">
                          {course.studentsEnrolled.length} student{course.studentsEnrolled.length !== 1 ? 's' : ''} enrolled
                        </p>
                        <p className="text-sm text-gray-600">Will be notified upon approval</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                  <button
                    onClick={() => handleAction(course._id, 'reject')}
                    disabled={actionLoading === course._id}
                    className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                  >
                    {actionLoading === course._id ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <FiXCircle className="mr-2" size={16} />
                        Reject
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleAction(course._id, 'approve')}
                    disabled={actionLoading === course._id}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {actionLoading === course._id ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <FiCheckCircle className="mr-2" size={16} />
                        Approve
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingCourseRequests;