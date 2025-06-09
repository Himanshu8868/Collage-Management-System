import React, { useState } from 'react';
import axios from 'axios';
import { FiBook, FiHash, FiFileText, FiSend, FiCheckCircle, FiAlertCircle, FiXCircle } from 'react-icons/fi';

const FacultyCourseRequest = () => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "code" ? value.toUpperCase() : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/courses/create-course`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setMessage({ text: 'Course request submitted successfully!', type: 'success' });
        setFormData({ name: '', code: '', description: '' });
      } else {
        setMessage({ text: response.data.message, type: 'warning' });
      }
    } catch (error) {
      console.error('Request error:', error);
      setMessage({ text: error.response?.data?.message || 'Something went wrong.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const MessageIcon = () => {
    switch (message.type) {
      case 'success': return <FiCheckCircle className="mr-2" />;
      case 'warning': return <FiAlertCircle className="mr-2" />;
      case 'error': return <FiXCircle className="mr-2" />;
      default: return null;
    }
  };

  return (
    <div className="mt-20   max-w-md mx-auto my-10 p-8 bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
          <FiBook className="text-indigo-600 text-2xl" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800">Course Request Form</h2>
        <p className="text-gray-600 mt-2">Submit a new course for approval</p>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-lg flex items-center ${
          message.type === 'error' ? 'bg-red-50 text-red-700' : 
          message.type === 'warning' ? 'bg-yellow-50 text-yellow-700' : 
          'bg-green-50 text-green-700'
        }`}>
          <MessageIcon />
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 flex items-center">
            <FiBook className="mr-2 text-gray-400" />
            Course Name
          </label>
          <div className="relative">
            <input
              type="text"
              name="name"
              placeholder='e.g. "Data Structures"'
              value={formData.name}
              onChange={handleChange}
              required
              minLength={5}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
            />
            <FiBook className="absolute left-3 top-3.5 text-gray-400" />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 flex items-center">
            <FiHash className="mr-2 text-gray-400" />
            Course Code
          </label>
          <div className="relative">
            <input
              type="text"
              name="code"
              pattern="[A-Z]{2,5}[0-9]{2,4}"
              placeholder="e.g. CS101, MATH202"
              value={formData.code}
              onChange={handleChange}
              required
              maxLength={9}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
            />
            <FiHash className="absolute left-3 top-3.5 text-gray-400" />
          </div>
          <p className="text-xs text-gray-500 mt-1">Format: 2-5 letters followed by 2-4 numbers</p>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 flex items-center">
            <FiFileText className="mr-2 text-gray-400" />
            Description
          </label>
          <div className="relative">
            <textarea
              name="description"
              placeholder="Provide a detailed course description..."
              value={formData.description}
              onChange={handleChange}
              required
              rows="5"
              maxLength={500}
              minLength={20}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
            ></textarea>
            <FiFileText className="absolute left-3 top-3.5 text-gray-400" />
          </div>
          <p className="text-xs text-gray-500 mt-1">{formData.description.length}/500 characters</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center ${
            loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg'
          }`}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              <FiSend className="mr-2" />
              Submit Request
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default FacultyCourseRequest;