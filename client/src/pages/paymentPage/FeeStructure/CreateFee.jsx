import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateFee = () => {
  const [formData, setFormData] = useState({
    department: '',
    year: '',
    semester: '',
    amount: ''
  });

  const [departments, setDepartments] = useState([]);

  // Fetch departments on mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/department');
        setDepartments(res.data);
      } catch (error) {
        console.error('Failed to fetch departments:', error);
        toast.error('Could not load departments');
      }
    };

    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');

      await axios.post('http://localhost:5000/api/fee/create', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success('Fee structure created successfully!');
      setFormData({ department: '', year: '', semester: '', amount: '' });
    } catch (error) {
      console.error(error);
      toast.error('Failed to create fee structure.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 mb-6 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create Fee Structure</h2>
      <form onSubmit={handleSubmit}>
        {/* Department Dropdown */}
        <label className="block mb-3">
          <span className="text-gray-700">Department</span>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept.name}>
                {dept.name}
              </option>
            ))}
          </select>
        </label>

        {/* Year */}
        <label className="block mb-3">
          <span className="text-gray-700">Year</span>
          <input
            type="text"
            name="year"
            placeholder="eg : 2025"
            value={formData.year}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </label>

        {/* Semester */}
        <label className="block mb-3">
          <span className="text-gray-700">Semester</span>
          <input
            type="text"
            name="semester"
            placeholder="eg: 1 , 2"
            value={formData.semester}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </label>

        {/* Amount */}
        <label className="block mb-3">
          <span className="text-gray-700">Amount (₹)</span>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </label>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
        >
          Create Fee Structure
        </button>
      </form>
    </div>
  );
};

export default CreateFee;
