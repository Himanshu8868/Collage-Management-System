import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AttendanceRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const token = localStorage.getItem("token");

  const fetchRequests = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/attendance/requests', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRequests(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id, action) => {
    setActionLoading(id);
    try {
      await axios.put(
        `http://localhost:5000/api/attendance/respond/${id}`,
        { action },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMessage(`Request ${action} successfully!`);
      setTimeout(() => setSuccessMessage(""), 3000);
      setRequests((prev) => prev.filter((req) => req._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to respond to request.");
      setTimeout(() => setError(""), 5000);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className=" mt-14 max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Attendance Requests</h2>
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          {requests.length} pending
        </span>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
          <p>{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 border-l-4 border-green-500 text-green-700">
          <p>{successMessage}</p>
        </div>
      )}

      {requests.length === 0 ? (
        <div className="text-center py-10">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No pending requests</h3>
          <p className="mt-1 text-gray-500">All attendance requests have been processed.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div key={req._id} className="p-5 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Student</h4>
                  <p className="text-base font-medium text-gray-900">{req.student.name}</p>
                  <p className="text-sm text-gray-500">{req.student.email}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Course</h4>
                  <p className="text-base font-medium text-gray-900">{req.course.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Date</h4>
                  <p className="text-base font-medium text-gray-900">
                    {new Date(req.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${req.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : req.status === 'approved'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                  {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                </span>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleAction(req._id, "approved")}
                    disabled={actionLoading === req._id}
                    className={`px-4 py-2 rounded-md flex items-center ${actionLoading === req._id && actionLoading !== "rejected"
                        ? 'bg-gray-300 text-gray-600'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                  >
                    {actionLoading === req._id && actionLoading !== "rejected" ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Approve
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleAction(req._id, "rejected")}
                    disabled={actionLoading === req._id}
                    className={`px-4 py-2 rounded-md flex items-center ${actionLoading === req._id && actionLoading !== "approved"
                        ? 'bg-gray-300 text-gray-600'
                        : 'bg-red-600 hover:bg-red-700 text-white'
                      }`}
                  >
                    {actionLoading === req._id && actionLoading !== "approved" ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                        Reject
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AttendanceRequest;