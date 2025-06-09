// models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiverIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // who will receive the notification
  title: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  link: { type: String }, // Optional: Link to navigate on click
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
