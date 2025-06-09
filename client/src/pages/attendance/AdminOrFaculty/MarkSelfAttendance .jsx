import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const MarkSelfAttendance = () => {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [locationLoading, setLocationLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const token = localStorage.getItem('token');

  useEffect(() => {
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
          // console.error("Geolocation error:", err);
          toast.error('Please enable location access to mark attendance.');
          // setMessage({ text: 'Please enable location access to mark attendance.', type: 'error' });
          setLocationLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      toast.error('Geolocation not supported by this browser.');
      // setMessage({ text: 'Geolocation not supported by this browser.', type: 'error' });
      setLocationLoading(false);
    }
  }, []);

  const handleSubmit = async () => {
    if (!location.latitude || !location.longitude) {
      return setMessage({ text: 'Location access is required.', type: 'error' });
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/attendance/self-attendance`,
        {
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
       toast.success(res.data.message || 'Attendance marked.');
      // setMessage({ text: res.data.message || 'Attendance marked.', type: 'success' });
    } catch (error) {
      // console.error("Self-attendance error:", error);
   
        toast.error( error.response?.data?.message || 'Failed to mark attendance.')
     
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" mt-20 max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Mark Self Attendance</h2>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700">Location Status</h4>
        <p className="text-sm text-gray-500">
          {locationLoading ? 'Detecting your location...' :
            location.latitude ? 'Location detected' :
              'Location not available'}
        </p>
        {location.latitude && (
          <p className="text-xs text-gray-400 mt-1">
            Coordinates: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
          </p>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading || locationLoading || !location.latitude}
        className={`w-full py-3 px-4 rounded-md flex items-center justify-center ${
          loading || !location.latitude
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {loading ? 'Marking...' : 'Mark Attendance'}
      </button>

      {/* {message.text && (
        <div className={`mt-4 p-3 rounded-md ${
          message.type === 'error'
            ? 'bg-red-100 text-red-700'
            : 'bg-green-100 text-green-700'
        }`}>
          {message.text}
        </div>
      )} */}
    </div>
  );
};

export default MarkSelfAttendance;
