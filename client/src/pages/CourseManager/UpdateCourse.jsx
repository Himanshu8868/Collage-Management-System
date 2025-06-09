import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import { FiEdit, FiTrash2, FiPlusCircle, FiBook } from 'react-icons/fi';

const UpdateCourse = () => {
const navigate = useNavigate();
const role = localStorage.getItem("role")
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

    useEffect(() => {
      if (role !== "admin") {
        toast.error("Only admins can access this page.");
      }
       else if(role === "student"){
        navigate("StudentDashboard")
       }
        if(role === "faculty"){
          navigate("/dashboard")
        }
    }, [role]);
    

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/courses`);
      setCourses(response.data);
    } catch (error) {
      setError('Failed to fetch courses');
      console.error(error);
    }
  };

  const fetchInstructors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/courses/instructors`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = response.data.Instructors || [];
      setInstructors(Array.isArray(data) ? data : []);
    } catch (error) {
      setError('Failed to fetch instructors');
      console.error(error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchCourses(), fetchInstructors()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleEditClick = (course) => {
    setSelectedCourse({
      ...course,
      instructor: course.instructor?._id || ''
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    setSelectedCourse({
      ...selectedCourse,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/courses/${selectedCourse._id}`,
        selectedCourse,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Course updated successfully");
      setShowModal(false);
      fetchCourses();
    } catch (err) {
      setError('Failed to update course');
      toast.error(err.response?.data?.message || "Failed to update course");
    }
  };
  
  const handleDelete = async (e, courseId) => {
    e.preventDefault();
    const confirmDelete = window.confirm("Are you sure you want to delete this course?");
    if (!confirmDelete) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Course deleted successfully");
      fetchCourses();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete course");
      setError("Action not complete");
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="mt-25 p-4 text-red-500 text-center">
      {error}
      <button 
        onClick={() => window.location.reload()}
        className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Retry
      </button>
    </div>
  );

  return (
    <div className="p-4 mt-15">
      <h2 className="text-xl font-bold mb-4 text-blue-700 flex items-center justify-center">
        <FiBook className="mr-2" /> Course Management
      </h2>

      {courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg">
          <FiBook className="text-5xl text-gray-400 mb-4" />
          <h3 className="text-xl text-gray-600 mb-2">No Courses Available</h3>
          <p className="text-gray-500 mb-4">There are currently no courses in the system.</p>
          <button
  className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
  onClick={() => {
    toast.info("Redirecting to course creation...");
    navigate("/create-courses");
  }}
>
  <FiPlusCircle className="mr-2" /> Add New Course
</button>

        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Code</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Name</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Instructor</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {courses.map(course => (
                <tr key={course._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 whitespace-nowrap">{course.code}</td>
                  <td className="py-3 px-4 whitespace-nowrap">{course.name}</td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {course.instructor?.name || (
                      <span className="text-gray-400 italic">Not assigned</span>
                    )}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditClick(course)}
                        className="flex items-center text-blue-500 hover:text-blue-700"
                        title="Edit"
                      >
                        <FiEdit className="mr-1" /> Edit
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, course._id)}
                        className="flex items-center text-red-500 hover:text-red-700"
                        title="Delete"
                      >
                        <FiTrash2 className="mr-1" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {showModal && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Edit Course</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course Code</label>
                <input
                  type="text"
                  name="code"
                  value={selectedCourse.code || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
                <input
                  type="text"
                  name="name"
                  value={selectedCourse.name || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instructor</label>
                <select
                  name="instructor"
                  value={selectedCourse.instructor || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Instructor</option>
                  {instructors.map(instructor => (
                    <option key={instructor._id} value={instructor._id}>
                      {instructor.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateCourse;