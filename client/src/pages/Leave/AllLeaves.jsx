import { useEffect, useState } from "react";
import { format, formatDistance, parseISO } from 'date-fns';
import axios from "axios";

const GetAllLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    search: '',
    dateRange: 'all'
  });

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/leave/all-records`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setLeaves(response.data.leaves || []);
        setFilteredLeaves(response.data.leaves || []);
      } catch (error) {
        console.error("Error fetching leaves:", error);
        setError("Failed to load leave records. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeaves();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, leaves]);

  const applyFilters = () => {
    let result = [...leaves];

    // Status filter
    if (filters.status !== 'all') {
      result = result.filter(leave => leave.status === filters.status);
    }

    // Type filter
    if (filters.type !== 'all') {
      result = result.filter(leave => leave.leaveType.toLowerCase() === filters.type);
    }

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(leave => 
        leave.reason.toLowerCase().includes(searchTerm) ||
        (leave.userId?.name?.toLowerCase().includes(searchTerm)) ||
        (leave.userId?.email?.toLowerCase().includes(searchTerm))
      );
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      result = result.filter(leave => {
        const fromDate = new Date(leave.fromDate);
        const toDate = new Date(leave.toDate);
        
        switch(filters.dateRange) {
          case 'today':
            return fromDate <= now && toDate >= now;
          case 'upcoming':
            return fromDate > now;
          case 'past':
            return toDate < now;
          default:
            return true;
        }
      });
    }

    setFilteredLeaves(result);
  };

  const calculateDuration = (fromDate, toDate) => {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const diffTime = Math.max(to - from, 0);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    const typeClasses = {
      paid: 'bg-blue-100 text-blue-800',
      sick: 'bg-purple-100 text-purple-800',
      casual: 'bg-indigo-100 text-indigo-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${typeClasses[type.toLowerCase()] || typeClasses.other}`}>
        {type}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-14 p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Leave Management Dashboard</h1>
        <div className="mt-4 md:mt-0">
          <p className="text-gray-600">
            Showing {filteredLeaves.length} of {leaves.length} records
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
            >
              <option value="all">All Statuses</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.type}
              onChange={(e) => setFilters({...filters, type: e.target.value})}
            >
              <option value="all">All Types</option>
              <option value="paid">Paid</option>
              <option value="sick">Sick</option>
              <option value="casual">Casual</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.dateRange}
              onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Search by name, email or reason"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
            />
          </div>
        </div>
      </div>

      {/* Leaves Grid */}
      {filteredLeaves.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900">No leave requests found</h3>
          <p className="mt-2 text-gray-600">Try adjusting your filters to see more results</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLeaves.map((leave) => (
            <div 
              key={leave._id} 
              className="border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 bg-white"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {leave.userId?.name || (leave.studentId ? "Student" : "Faculty Member")}
                  </h2>
                  <p className="text-sm text-gray-500">{leave.userId?.email || "-"}</p>
                </div>
                <div className="flex space-x-2">
                  {getStatusBadge(leave.status)}
                  {getTypeBadge(leave.leaveType)}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  {format(parseISO(leave.fromDate), 'MMM dd, yyyy')} - {format(parseISO(leave.toDate), 'MMM dd, yyyy')}
                  <span className="ml-2 font-medium">
                    ({calculateDuration(leave.fromDate, leave.toDate)} days)
                  </span>
                </div>

                <div className="text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-2 inline text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  {leave.reason}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-3">
                <span>
                  Requested {formatDistance(parseISO(leave.createdAt), new Date(), { addSuffix: true })}
                </span>
                <span className="bg-gray-100 px-2 py-1 rounded">
                  {leave.userType}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GetAllLeaves;