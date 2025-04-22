import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MarkAttendance = () => {
  const [courseId, setCourseId] = useState('');
  const [courses, setCourses] = useState([]);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(true);
  const [coursesLoading, setCoursesLoading] = useState(true);

  const token = localStorage.getItem('token');
  const studentId = localStorage.getItem('studentId');

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/courses/${studentId}/enrolled`, {
          headers: { Authorization: `Bearer ${token}` },
        });
    
        console.log("Enrolled courses response:", res.data);
    
        if (Array.isArray(res.data.data)) {
          setCourses(res.data.data);
        } else {
          setMessage({ text: 'Enrolled courses format is invalid.', type: 'error' });
        }
      } catch (error) {
        console.error('Error fetching enrolled courses:', error);
        setMessage({ text: 'Failed to load enrolled courses.', type: 'error' });
      } finally {
        setCoursesLoading(false);
      }
    };
        fetchEnrolledCourses();

    // Get user's current geolocation
    if (navigator.geolocation) {
      setLocationLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationLoading(false);
        },
        (err) => {
          console.error("Geolocation error:", err);
          setMessage({ text: 'Please enable location access to mark attendance.', type: 'error' });
          setLocationLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setMessage({ text: 'Geolocation not supported by this browser.', type: 'error' });
      setLocationLoading(false);
    }
  }, [studentId, token]);

  const handleSubmit = async () => {
    if (!courseId) {
      return setMessage({ text: 'Please select a course.', type: 'error' });
    }
    if (!location.latitude || !location.longitude) {
      return setMessage({ text: 'Location access is required to mark attendance.', type: 'error' });
    }

    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await axios.post(
        'http://localhost:5000/api/attendance/request-attendance',
        {
          courseId,
          latitude: location.latitude,
          longitude: location.longitude,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setMessage({ text: res.data.message || 'Attendance request submitted successfully!', type: 'success' });
      setCourseId('');
    } catch (error) {
      console.error("Attendance request error:", error);
      setMessage({
        text: error.response?.data?.message || 'Something went wrong while marking attendance.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-1max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Mark Your Attendance</h2>
        <p className="text-gray-600 mt-1">Select your course and submit your current location</p>
      </div>

      <div className="space-y-4">
        {/* Course Selection */}
        <div>
          <label htmlFor="course-select" className="block text-sm font-medium text-gray-700 mb-1">
            Select Course
          </label>
          <select
            id="course-select"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={coursesLoading}
          >
            <option value="">{coursesLoading ? 'Loading courses...' : 'Select a course'}</option>
            {Array.isArray(courses) && courses.length > 0 ? (
              courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.name} ({course.code})
                </option>
              ))
            ) : (
              <option disabled>No courses available</option>
            )}
          </select>
        </div>

        {/* Location Status */}
        <div className="p-3 bg-gray-50 rounded-md">
          <div className="flex items-center">
            <div className={`p-2 rounded-full mr-3 ${location.latitude ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
              {locationLoading ? (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : location.latitude ? (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                </svg>
              )}
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700">Location Status</h4>
              <p className="text-sm text-gray-500">
                {locationLoading ? 'Detecting your location...' : 
                 location.latitude ? 'Location detected' : 
                 'Location access required'}
              </p>
              {location.latitude && (
                <p className="text-xs text-gray-400 mt-1">
                  Coordinates: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading || !courseId || !location.latitude}
          className={`w-full py-3 px-4 rounded-md flex items-center justify-center ${
            loading || !courseId || !location.latitude
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
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
            'Mark Attendance'
          )}
        </button>

        {/* Message Display */}
        {message.text && (
          <div className={`p-3 rounded-md ${
            message.type === 'error' 
              ? 'bg-red-100 border-l-4 border-red-500 text-red-700' 
              : 'bg-green-100 border-l-4 border-green-500 text-green-700'
          }`}>
            <div className="flex items-center">
              {message.type === 'error' ? (
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              ) : (
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              )}
              <span>{message.text}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarkAttendance;
