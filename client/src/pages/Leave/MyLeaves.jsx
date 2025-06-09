import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {toast} from 'react-toastify'

const MyLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLeaves = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/leave/my-leaves`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLeaves(response.data.leaves);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch leave requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleCancel = async (leaveId) => {

    if (!window.confirm('Are you sure you want to cancel this leave request?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/leave/cancel/${leaveId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Leave cancelled successfully!');
      fetchLeaves(); 
    } catch (err) {
    //   console.error(err);
    toast.error("faild to cancel leave")
    }
  };

  if (loading) return <div className="text-center mt-10">Loading leaves...</div>;
  if (error) return <div className="text-red-600 text-center mt-10">{error}</div>;

  return (
    <div className="mt-14 bg-orange-100 container mx-auto px-4 py-8 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-orange-600 text-center mb-6">My Leave Requests</h1>

      {leaves.length === 0 ? (
        <p className="text-center text-gray-600">No leave requests found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead className="bg-orange-500 text-white">
              <tr>
                <th className="py-3 px-4 text-left">From</th>
                <th className="py-3 px-4 text-left">To</th>
                <th className="py-3 px-4 text-left">Type</th>
                <th className="py-3 px-4 text-left">Reason</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Submitted</th>
                <th className="py-3 px-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((leave) => (
                <tr key={leave._id} className="border-b hover:bg-orange-50 transition">
                  <td className="py-2 px-4">{new Date(leave.fromDate).toLocaleDateString()}</td>
                  <td className="py-2 px-4">{new Date(leave.toDate).toLocaleDateString()}</td>
                  <td className="py-2 px-4">{leave.leaveType}</td>
                  <td className="py-2 px-4">{leave.reason}</td>
                  <td className="py-2 px-4">
                    <span className={`px-2 py-1 rounded-full text-white text-sm ${
                      leave.status === 'approved'
                        ? 'bg-green-500'
                        : leave.status === 'cancelled'
                        ? 'bg-red-500'
                        : 'bg-yellow-500'
                    }`}>
                      {leave.status}
                    </span>
                  </td>
                  <td className="py-2 px-4">{new Date(leave.createdAt).toLocaleDateString()}</td>
                  <td className="py-2 px-4">
                    {leave.status === 'pending' && (
                      <button
                        onClick={() => handleCancel(leave._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyLeaves;
