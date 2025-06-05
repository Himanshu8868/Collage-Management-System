import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {toast} from 'react-toastify';

const UploadDocuments = () => {
  const [file, setFile] = useState(null);
  const [courseId, setCourseId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/courses/my-courses', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(res.data.data);
      } catch (err) {
        setMessage('Error fetching courses' ,err.message);
      }
    };
    fetchCourses();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !courseId || !title || !type) {
      return setMessage('Please fill in all required fields');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('courseId', courseId);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('type', type);

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
          toast.success('Document uploaded successfully!');
        
      setFile(null);
      setCourseId('');
      setTitle('');
      setDescription('');
      setType('');
    } catch (error) {
      setMessage(   error.message ||'Upload failed');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-18 mb-3 p-6 max-w-xl mx-auto bg-white rounded shadow-md mt-10">
      <h2 className="text-xl font-bold mb-4">Upload Document</h2>
      {message && <p className="mb-2 text-sm text-red-500">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Title *</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            placeholder="eg: DSA Syllabus , DSA Notes, DSA Assignment / weak 5 notes" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            className="w-full border p-2 rounded"
            placeholder="eg: This is the syllabus for DSA course"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium">Select Subject *</label>
          <select
            className="w-full border p-2 rounded"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            required
          >
            <option value="">-- Select --</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Document Type *</label>
          <select
            className="w-full border p-2 rounded"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value="">-- Select Type --</option>
            <option value="syllabus">Syllabus</option>
            <option value="notes">Notes</option>
            <option value="assignment">Assignment</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Choose File *</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
          {file && (
            <p className="text-xs mt-1 text-gray-600">Selected file: {file.name}</p>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Upload Document'}
        </button>
      </form>
    </div>
  );
};

export default UploadDocuments;
