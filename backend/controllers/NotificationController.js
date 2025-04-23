
const Notification = require('../models/Notification');

//create a new notification

const createNotification = async (req, res) => {
  try {
    const { userId, title, message, link } = req.body;

    const newNotification = new Notification({ userId, title, message, link });
    await newNotification.save();

    res.status(201).json({ success: true, data: newNotification });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
  // Get all notification for login user
const getUserNotifications = async (req, res) => {
    try {
      const userId = req.user._id;
  
      const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
  
      res.status(200).json({ success: true, data: notifications });
    } catch (err) {
      res.status(500).json({ success: false, message: "Server Error", error: err.message });
    }
  };

  //mark notification as read 

  const markAsRead = async (req, res) => {
    try {
      const notificationId = req.params.id;
      await Notification.findByIdAndUpdate(notificationId, { isRead: true });
  
      res.status(200).json({ success: true, message: "Notification marked as read" , data: notificationId });
    } catch (err) {
      res.status(500).json({ success: false, message: "Server Error", error: err.message });
    } 
  };

  // Delete notification //
    const deleteNotfication = async (req , res ) => {
       const notificationId = req.params.id;
        const deletedNotification = await Notification.findByIdAndDelete(notificationId);
        if (!deletedNotification) {
            return res.status(404).json({ success: false, message: "Notification not found" });
        }
        res.status(200).json({ success: true, message: "Notification deleted successfully" });
    };  

    
   
  // Delete All Notification //
  const deleteAllNotifications = async (req, res) => {
    try {
      const notificationId = req.params.id;
     const deleteAllNotifications =  await Notification.deleteMany({ notificationId });
  
      res.status(200).json({ success: true, message: "All notifications deleted successfully" , deleteAllNotifications});
    } catch (err) {
      res.status(500).json({ success: false, message: "Server Error", error: err.message });
    }
  };
module.exports = { 
    createNotification,
    getUserNotifications,
    markAsRead,
    deleteNotfication,
    deleteAllNotifications
};
