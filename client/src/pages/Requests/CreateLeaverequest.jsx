import React, { useState } from 'react';
import axios from 'axios';

const CreateLeaveRequest = () => {
  const [formData, setFormData] = useState({
    fromDate: '',
    toDate: '',
    reason: '',
    leaveType: 'Paid',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    // Validate dates
    if (new Date(formData.toDate) < new Date(formData.fromDate)) {
      setMessage({ text: 'To Date must be after From Date', type: 'error' });
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/leave/submit`, formData, {
        headers: {   
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      setMessage({ text: response.data.message, type: 'success' });
      setFormData({
        fromDate: '',
        toDate: '',
        reason: '',
        leaveType: 'Paid',
      });
    } catch (error) {
      console.error('Submit Leave Error:', error);
      setMessage({ 
        text: error.response?.data?.message || 'Something went wrong', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate number of days between dates
  const calculateDays = () => {
    if (formData.fromDate && formData.toDate) {
      const from = new Date(formData.fromDate);
      const to = new Date(formData.toDate);
      const diffTime = Math.max(to - from, 0);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays > 0 ? diffDays : 0;
    }
    return 0;
  };

  return (
    <div className="mt-19 max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg mt-10 mb-10 border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Leave Request Form</h2>

      {message.text && (
        <div className={`mb-4 p-3 rounded-md text-center font-semibold ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-700' 
            : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-medium text-gray-700">From Date*</label>
            <input 
              type="date" 
              name="fromDate"
              value={formData.fromDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              min={new Date().toISOString().split('T')[0]} // Disable past dates
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">To Date*</label>
            <input 
              type="date" 
              name="toDate"
              value={formData.toDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              min={formData.fromDate || new Date().toISOString().split('T')[0]}
              disabled={!formData.fromDate}
            />
          </div>
        </div>

        {formData.fromDate && formData.toDate && (
          <div className="bg-blue-50 p-3 rounded-md text-center">
            <span className="font-medium text-blue-800">
              Total Days: {calculateDays()} day{calculateDays() !== 1 ? 's' : ''}
            </span>
          </div>
        )}

        <div>
          <label className="block mb-2 font-medium text-gray-700">Leave Type*</label>
          <select 
            name="leaveType"
            value={formData.leaveType}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Paid" className="text-gray-700">Paid Leave</option>
            <option value="Sick" className="text-gray-700">Sick Leave</option>
            <option value="Casual" className="text-gray-700">Casual Leave</option>
            <option value="Other" className="text-gray-700">Other</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700">Reason*</label>
          <textarea 
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Briefly describe the reason for your leave..."
            required
          ></textarea>
        </div>

        <button 
          type="submit"
          className={`w-full py-3 px-4 rounded-md font-bold text-white transition-colors ${
            loading 
              ? 'bg-blue-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            'Submit Leave Request'
          )}
        </button>
      </form>

      <div className="mt-6 text-sm text-gray-500">
        <p className="font-medium">Note:</p>
        <ul className="list-disc pl-5 space-y-1 mt-1">
          <li>Fields marked with * are mandatory</li>
          <li>Please submit your request at least 3 days in advance</li>
          <li>For urgent leaves, contact your manager directly</li>
        </ul>
      </div>
    </div>
  );
};

export default CreateLeaveRequest;