import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { FiAward, FiBook, FiCalendar, FiBarChart2, FiLoader, FiAlertCircle } from "react-icons/fi";

const StudentResult = () => {
  const { id } = useParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/result/${id}/my-results`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Sort results by date (newest first)
        const sortedResults = Array.isArray(res.data) 
          ? res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) 
          : (res.data.results || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        setResults(sortedResults);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load results. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [id]);

  const filteredResults = activeFilter === "all" 
    ? results 
    : results.filter(res => res.exam.type === activeFilter);

  const getGradeColor = (score) => {
    if (score >= 90) return "bg-emerald-100 text-emerald-800";
    if (score >= 80) return "bg-green-100 text-green-800";
    if (score >= 70) return "bg-lime-100 text-lime-800";
    if (score >= 60) return "bg-yellow-100 text-yellow-800";
    if (score >= 50) return "bg-amber-100 text-amber-800";
    return "bg-red-100 text-red-800";
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <FiLoader className="animate-spin text-4xl text-blue-500 mb-4" />
        <p className="text-lg text-gray-600">Loading your results...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <div className="bg-red-50 p-6 rounded-lg max-w-md text-center">
          <FiAlertCircle className="mx-auto text-5xl text-red-500 mb-4" />
          <h3 className="text-xl font-semibold text-red-700 mb-2">Error Loading Results</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <div className="bg-blue-50 p-8 rounded-lg max-w-md text-center">
          <FiAward className="mx-auto text-5xl text-blue-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Results Found</h3>
          <p className="text-gray-600">You haven't taken any exams yet. Check back later for your results.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-14 p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">My Exam Results</h2>
          <p className="text-gray-600">View your performance across all exams</p>
        </div>
        
        <div className="flex space-x-2 mt-4 md:mt-0">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${activeFilter === "all" ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            All Exams
          </button>
          <button
            onClick={() => setActiveFilter("quiz")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${activeFilter === "quiz" ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Quizzes
          </button>
          <button
            onClick={() => setActiveFilter("midterm")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${activeFilter === "midterm" ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Midterms
          </button>
          <button
            onClick={() => setActiveFilter("final")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${activeFilter === "final" ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Finals
          </button>
        </div>
      </div>

      {filteredResults.length === 0 ? (
        <div className="bg-gray-50 p-6 rounded-lg text-center">
          <p className="text-gray-500">No results found for this exam type.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredResults.map((res) => (
            <div key={res._id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
              <div className="bg-white p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center">
                      <FiBook className="mr-2 text-blue-500" />
                      {res.exam.title}
                    </h3>
                    <p className="text-gray-600 mt-1">{res.course.name}</p>

                    <p className="text-gray-600 mt-1">Student - {res.student.name}</p>
                  </div>
                  
                  <div className={`px-4 py-2 rounded-full text-center font-bold ${getGradeColor(res.score)}`}>
                    {res.score}%
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center">
                    <FiBarChart2 className="text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Status: <span className={`font-medium ${res.score >= 1 ? 'text-green-600' : 'text-red-600'}`}>
      {res.score >= 1 ? 'Passed' : 'Failed'}
    </span></span>
                  </div>
                  <div className="flex items-center">
                    <FiCalendar className="text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">{new Date(res.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span className="text-sm text-gray-600">Score: {res.score || "test"}</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-gray-600">Duration: {res.exam.duration} mins</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 bg-blue-50 p-6 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-3">Performance Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded shadow-sm">
            <p className="text-sm text-gray-500">Total Exams Taken</p>
            <p className="text-2xl font-bold">{results.length}</p>
          </div>
          <div className="bg-white p-4 rounded shadow-sm">
            <p className="text-sm text-gray-500">Average Score</p>
            <p className="text-2xl font-bold">
              {Math.round(results.reduce((acc, curr) => acc + curr.score, 0) / results.length)}%
            </p>
          </div>
          <div className="bg-white p-4 rounded shadow-sm">
            <p className="text-sm text-gray-500">Highest Score</p>
            <p className="text-2xl font-bold text-green-600">
              {Math.max(...results.map(res => res.score))}%
            </p>
          </div>
          <div className="bg-white p-4 rounded shadow-sm">
            <p className="text-sm text-gray-500">Pass Rate</p>
            <p className="text-2xl font-bold">
              {Math.round((results.filter(res => res.score >= 1).length / results.length) * 100)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentResult;