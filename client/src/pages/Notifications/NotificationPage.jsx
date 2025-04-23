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
      setNotifications(res.data.data);
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
    <div className=" mt-15 p-6">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Bell /> Notifications</h2>

      {loading ? (
        <div className="flex justify-center items-center h-40"><Loader2 className="animate-spin" /></div>
      ) : (
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <p className="text-gray-500">No notifications found.</p>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className={`p-4 rounded-xl shadow-sm border cursor-pointer transition hover:shadow-md ${
                  notification.isRead ? 'bg-gray-100' : 'bg-blue-50'
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <p className="font-semibold">{notification.title}</p>
                <p>{notification.message}</p>
                <p className="text-sm text-gray-500">{new Date(notification.createdAt).toLocaleString()}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default FacultyNotifications;
