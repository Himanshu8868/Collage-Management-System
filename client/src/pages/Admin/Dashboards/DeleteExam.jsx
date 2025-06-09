import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FiTrash2, FiAlertTriangle, FiCheckCircle, FiLoader, FiRefreshCw, FiInfo } from "react-icons/fi";

const DeleteExam = () => {
  const [pendingExams, setPendingExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);
  const [debugMode, setDebugMode] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchPendingExams();
  }, []);

  const fetchPendingExams = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/exams/pending-deletion`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Store raw API response for debugging
      setApiResponse(response);
      
      // Handle various response formats
      let exams = [];
      if (Array.isArray(response.data)) {
        exams = response.data;
      } else if (response.data && Array.isArray(response.data.exams)) {
        exams = response.data.exams;
      } else if (response.data && Array.isArray(response.data.data)) {
        exams = response.data.data;
      }

      setPendingExams(exams);
      
      if (exams.length === 0) {
        toast.info("No pending exams found for deletion", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error fetching pending exams:", error);
      const errorMsg = error.response?.data?.message || 
                     error.response?.data?.error || 
                     error.message || 
                     "Failed to load pending exams";
      setError(errorMsg);
      toast.error(errorMsg, {
        position: "top-center",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (examId) => {
    setDeletingId(examId);
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/exams/delete-approved/${examId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      toast.success(response.data.message)
      
      // Update state by filtering out the deleted exam
      setPendingExams(prev => prev.filter(exam => exam._id !== examId));
    } catch (error) {
      console.error("Error deleting exam:", error);
      const errorMsg = error.response?.data?.message || 
                     "Failed to delete exam. Please try again.";
      toast.error(errorMsg);
    } finally {
      setDeletingId(null);
    }
  };

  const confirmDelete = (examId) => {
    const exam = pendingExams.find(e => e._id === examId);
    
    toast.info(
      <div className="p-4">
        <div className="flex items-center mb-4">
          <FiAlertTriangle className="text-yellow-500 mr-2 text-xl" />
          <h3 className="font-semibold">Confirm Deletion</h3>
        </div>
        <p className="mb-2">You are about to permanently delete:</p>
        <p className="font-medium mb-4">"{exam?.title || 'Untitled Exam'}" (ID: {examId})</p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => toast.dismiss()}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              toast.dismiss();
              handleDelete(examId);
            }}
            className="px-4 py-2 bg-red-600 rounded-md text-sm font-medium text-white hover:bg-red-700"
          >
            Confirm Delete
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeButton: false,
        draggable: false,
        closeOnClick: false,
      }
    );
  };

  // Toggle debug mode
  const toggleDebugMode = () => {
    setDebugMode(!debugMode);
  };

  return (
    <div className=" mt-13 min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Debug mode toggle */}
        <div className="flex justify-end mb-2">
          <button
            onClick={toggleDebugMode}
            className="text-xs px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            {debugMode ? "Hide Debug" : "Show Debug"}
          </button>
        </div>

        {/* Debugging panel */}
        {debugMode && (
          <div className="mt-15 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-bold text-yellow-800 mb-3 flex items-center">
              <FiInfo className="mr-2" /> Debug Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
              <div className="bg-white p-2 rounded border">
                <p className="text-xs font-semibold">Status</p>
                <p className="text-sm">
                  {loading ? "Loading..." : `Loaded ${pendingExams.length} exams`}
                </p>
              </div>
              <div className="bg-white p-2 rounded border">
                <p className="text-xs font-semibold">Last Error</p>
                <p className="text-sm truncate">{error || "None"}</p>
              </div>
              <div className="bg-white p-2 rounded border">
                <p className="text-xs font-semibold">Token</p>
                <p className="text-sm truncate">{token ? "Present" : "Missing"}</p>
              </div>
            </div>
            <details className="text-sm">
              <summary className="cursor-pointer text-yellow-700">View API Response</summary>
              <pre className="mt-2 p-2 bg-white rounded overflow-auto max-h-60 text-xs">
                {apiResponse ? JSON.stringify(apiResponse.data, null, 2) : "No response yet"}
              </pre>
            </details>
          </div>
        )}

        {/* Main content */}
        <div className="mt-15 bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Pending Exam Deletion Requests
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Review and approve requests to delete exams
                </p>
              </div>
              <button
                onClick={fetchPendingExams}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <FiRefreshCw className={`mr-2 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>
          </div>

          <div className="bg-white overflow-hidden">
            {loading && pendingExams.length === 0 ? (
              <div className="flex justify-center items-center p-12">
                <FiLoader className="animate-spin text-3xl text-blue-500" />
                <span className="ml-3">Loading exams...</span>
              </div>
            ) : error ? (
              <div className="text-center p-8">
                <FiAlertTriangle className="mx-auto text-4xl text-red-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  Error loading exams
                </h3>
                <p className="text-gray-500 mb-4">{error}</p>
                <button
                  onClick={fetchPendingExams}
                  className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700"
                >
                  Retry
                </button>
              </div>
            ) : pendingExams.length === 0 ? (
              <div className="text-center p-8">
                <FiCheckCircle className="mx-auto text-4xl text-green-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  No pending deletion requests
                </h3>
                <p className="text-gray-500">
                  There are currently no exams pending deletion approval.
                </p>
                <button
                  onClick={fetchPendingExams}
                  className="mt-4 px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700"
                >
                  Check Again
                </button>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {pendingExams.map((exam) => (
                  <li key={exam._id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {exam.title || "Untitled Exam"}
                        </p>
                        <div className="flex flex-wrap mt-1 gap-x-4 gap-y-1">
                          <p className="text-xs text-gray-500">
                            <span className="font-semibold">Course:</span> {exam.course?.name || "N/A"}
                          </p>
                          <p className="text-xs text-gray-500">
                            <span className="font-semibold">Date:</span>{" "}
                            {exam.date ? new Date(exam.date).toLocaleDateString() : "N/A"}
                          </p>
                      <p className="text-xs text-gray-500">
                        <span className="font-semibold">Created By:</span>{" "}
                        {exam.instructor?.name || "Unknown"}
                        </p>

                          <p className="text-xs text-gray-500">
                            <span className="font-semibold">ID:</span> {exam._id || "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <button
                          onClick={() => confirmDelete(exam._id)}
                          disabled={deletingId === exam._id}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition-colors"
                        >
                          {deletingId === exam._id ? (
                            <FiLoader className="animate-spin mr-2" />
                          ) : (
                            <FiTrash2 className="mr-2" />
                          )}
                          Delete
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteExam;