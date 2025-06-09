
const Notification = require('../models/Notification');

const sendNotification = async (userId, title, message, link = "/") => {
  await Notification.create({ userId, title, message, link });
};

module.exports = sendNotification;
