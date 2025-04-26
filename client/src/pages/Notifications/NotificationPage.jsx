import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Bell, Loader2 } from 'lucide-react';

const FacultyNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/notifications/all-notifications', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const allNotifications = [
        ...res.data.receivedNotifications,
        ...res.data.createdNotifications,
      ];

      allNotifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setNotifications(allNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.isRead) {
        await axios.put(`http://localhost:5000/api/notifications/${notification._id}/read`, {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
      }

      if (notification.link) {
        navigate(notification.link);
      }
    } catch (err) {
      console.error('Failed to mark as read or navigate:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="mt-14 min-h-screen bg-gradient-to-br from-orange-100 via-orange-200 to-orange-300 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-orange-600">
          <Bell className="text-orange-500" /> Notifications
        </h2>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="animate-spin w-8 h-8 text-orange-600" />
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <p className="text-gray-600 text-center">No notifications found.</p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-5 rounded-xl border-l-4 cursor-pointer transition-all duration-200 ${
                    notification.isRead
                      ? 'bg-gray-100 border-gray-400 hover:bg-gray-200'
                      : 'bg-orange-50 border-orange-500 hover:bg-orange-100'
                  }`}
                >
                  <p className="font-semibold text-lg text-gray-800">{notification.title}</p>
                  <p className="text-gray-700">{notification.message}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyNotifications;
