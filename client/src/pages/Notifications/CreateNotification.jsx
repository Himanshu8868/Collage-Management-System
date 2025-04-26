import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const SendNotificationPage = () => {
  const [form, setForm] = useState({
    title: '',
    message: '',
    link: '',
    targetRole: '',
    customUserIds: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { title, message, link, targetRole, customUserIds } = form;
      const payload = {
        title,
        message,
        link,
        targetRole,
        customUserIds: customUserIds
          ? customUserIds.split(',').map(id => id.trim())
          : []
      };

      const token = localStorage.getItem("token");

      const response = await axios.post('http://localhost:5000/api/notifications/create-notification', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Notification sent successfully!");
      setForm({ title: '', message: '', link: '', targetRole: '', customUserIds: '' });

    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to send notification");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
      <h2 className="text-2xl font-bold mb-6">Send Notification</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Notification Title"
          required
        />

        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Notification Message"
          rows={4}
          required
        />

        <input
          name="link"
          value={form.link}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Optional Link (e.g. /dashboard)"
        />

        <select
          name="targetRole"
          value={form.targetRole}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Role to Send</option>
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
          <option value="all">All</option>
        </select>

        <input
          name="customUserIds"
          value={form.customUserIds}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Comma-separated User IDs (optional)"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Send Notification
        </button>
      </form>
    </div>
  );
};

export default SendNotificationPage;
