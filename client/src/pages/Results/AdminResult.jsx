import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  FiUser, FiBookOpen, FiCheckCircle, FiXCircle, FiClock, 
  FiSearch, FiFilter, FiDownload, FiBarChart2, FiTrendingUp,
  FiLoader, FiAlertCircle, FiAward, FiChevronDown, FiChevronUp
} from "react-icons/fi";

const AdminResult = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedCard, setExpandedCard] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: "score", direction: "desc" });

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/result/all-results", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResults(res.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load results");
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  const handleSort = (key) => {
    let direction = "desc";
    if (sortConfig.key === key && sortConfig.direction === "desc") {
      direction = "asc";
    }
    setSortConfig({ key, direction });
  };

  const sortedResults = [...results].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const filteredResults = sortedResults.filter(result => {
    const matchesSearch = 
      result.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.course?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.exam?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" || 
      (statusFilter === "passed" && result.score >= 30) || 
      (statusFilter === "failed" && result.score < 30);
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (score) => {
    if (score >= 80) return "bg-emerald-100 text-emerald-800";
    if (score >= 50) return "bg-green-100 text-green-800";
    return "bg-red-100 text-red-800";
  };

  const exportToCSV = () => {
    const headers = ["Student", "Course", "Exam", "Score", "Status", "Date"];
    const csvContent = [
      headers.join(","),
      ...filteredResults.map(result => [
        `"${result.student?.name || "Unknown"}"`,
        `"${result.course?.name || "N/A"}"`,
        `"${result.exam?.title || "Untitled Exam"}"`,
        result.score,
        result.score >= 30 ? "Passed" : "Failed",
        result.createdAt ? new Date(result.createdAt).toLocaleString() : "Unknown"
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `exam_results_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <FiLoader className="animate-spin text-4xl text-blue-500 mb-4" />
      <p className="text-lg text-gray-600">Loading student results...</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="bg-red-50 p-6 rounded-lg max-w-md text-center">
        <FiAlertCircle className="mx-auto text-4xl text-red-500 mb-4" />
        <h3 className="text-xl font-semibold text-red-700 mb-2">Error Loading Results</h3>
        <p className="text-red-600">{error}</p>
      </div>
    </div>
  );

  if (!Array.isArray(results) || results.length === 0) return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="bg-blue-50 p-6 rounded-lg max-w-md text-center">
        <FiAward className="mx-auto text-4xl text-blue-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700">No Results Found</h3>
        <p className="text-gray-600">No exam results have been recorded yet.</p>
      </div>
    </div>
  );

  return (
    <div className="mt-14 py-8 px-4 max-w-7xl mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Exam Results Dashboard</h1>
        <p className="text-gray-600">Comprehensive view of all student performances</p>
      </div>

      {/* Controls Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search students, courses, or exams..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <FiFilter className="text-gray-500" />
            <select 
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Results</option>
              <option value="passed">Passed Only</option>
              <option value="failed">Failed Only</option>
            </select>
          </div>
          
          <button 
            onClick={exportToCSV}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            <FiDownload className="mr-2" />
            Export CSV
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600 font-medium">Total Results</p>
            <p className="text-2xl font-bold">{filteredResults.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600 font-medium">Average Score</p>
            <p className="text-2xl font-bold">
              {filteredResults.length > 0 
                ? Math.round(filteredResults.reduce((sum, res) => sum + res.score, 0) / filteredResults.length)
                : 0}%
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-600 font-medium">Pass Rate</p>
            <p className="text-2xl font-bold">
              {filteredResults.length > 0
                ? Math.round((filteredResults.filter(res => res.score >= 50).length / filteredResults.length) * 100)
                : 0}%
            </p>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResults.map((result) => (
          <div 
            key={result._id} 
            className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all ${expandedCard === result._id ? 'ring-2 ring-blue-500' : 'hover:shadow-md'}`}
          >
            <div className="p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {result.exam?.title || "Untitled Exam"}
                  </h3>
                  <p className="text-sm text-gray-500">{result.exam?.type || "Exam"}</p>
                </div>
                <span className={`px-3 py-1 text-sm rounded-full font-medium ${getStatusColor(result.score)}`}>
                  {result.score}%
                </span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center">
                  <FiUser className="mr-2 text-blue-500 flex-shrink-0" />
                  <span className="text-gray-700">{result.student?.name || "Unknown"}</span>
                </div>
                <div className="flex items-center">
                  <FiBookOpen className="mr-2 text-purple-500 flex-shrink-0" />
                  <span className="text-gray-700">{result.course?.name || "N/A"}</span>
                </div>
                <div className="flex items-center">
                  {result.score >= 30 ? (
                    <FiCheckCircle className="mr-2 text-green-500 flex-shrink-0" />
                  ) : (
                    <FiXCircle className="mr-2 text-red-500 flex-shrink-0" />
                  )}
                  <span className={result.score >= 30 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                    {result.score >= 30 ? "Passed" : "Failed"}
                  </span>
                </div>
                <div className="flex items-center">
                  <FiClock className="mr-2 text-gray-500 flex-shrink-0" />
                  <span className="text-gray-500">
                    {result.createdAt ? new Date(result.createdAt).toLocaleDateString() : "Unknown date"}
                  </span>
                </div>
              </div>

              <button 
                className="mt-4 w-full flex items-center justify-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                onClick={() => setExpandedCard(expandedCard === result._id ? null : result._id)}
              >
                {expandedCard === result._id ? (
                  <>
                    <span>Show Less</span>
                    <FiChevronUp className="ml-1" />
                  </>
                ) : (
                  <>
                    <span>View Details</span>
                    <FiChevronDown className="ml-1" />
                  </>
                )}
              </button>
            </div>

            {expandedCard === result._id && (
              <div className="bg-gray-50 p-5 border-t border-gray-200">
                <h4 className="font-medium text-gray-700 mb-2">Exam Details</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500">Duration</p>
                    <p>{result.exam?.duration || "N/A"} mins</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Total Marks</p>
                    <p>{result.score || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Pass Mark</p>
                    <p>{result.exam?.passMark || "30"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Exam Date</p>
                    <p>{result.exam?.date ? new Date(result.exam.date).toLocaleDateString() : "N/A"}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredResults.length === 0 && (
        <div className="bg-gray-50 p-8 rounded-xl text-center mt-8">
          <p className="text-gray-500">No results match your search criteria</p>
        </div>
      )}
    </div>
  );
};

export default AdminResult;