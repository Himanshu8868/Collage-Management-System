
const Notification = require('../models/Notification');
const User = require('../models/User');

//create a new notification
const createNotification = async (req, res) => {
  try {
    const senderId = req.user.id;
    const sender = await User.findById(senderId);

    // Only admin is allowed
    if (sender.role !== "admin") {
      
      return res.status(403).json({ success: false, message: "Only admin can send notifications" });
    }

    const { title, message, link, targetRole, customUserIds } = req.body;

    let receiverIds = [];

    // Send to role(s)
    if (targetRole === "student" || targetRole === "faculty" || targetRole === "all") {
      const roleFilter = targetRole === "all" ? ["student", "faculty"] : [targetRole];
      const users = await User.find({ role: { $in: roleFilter } });
      receiverIds = users.map(u => u._id);
    }

    // Send to specific users
    if (Array.isArray(customUserIds) && customUserIds.length > 0) {
      receiverIds.push(...customUserIds);
    }

    // Remove duplicates
    receiverIds = [...new Set(receiverIds.map(id => id.toString()))];

    if (receiverIds.length === 0) {
      return res.status(400).json({ success: false, message: "No target users found" });
    }

    const newNotification = new Notification({
      userId: senderId,
      title,
      message,
      link,
      receiverIds,
    });

    await newNotification.save();

    res.status(201).json({ success: true, data: newNotification });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};


  // Get all notification for login user
  const getUserNotifications = async (req, res) => {
    try {
      const userId = req.user._id;
  
      // Notifications where user is a receiver
      const receivedNotifications = await Notification.find({
        receiverIds: userId,
      }).sort({ createdAt: -1 });
  
      // Notifications created by the other user
      const createdNotifications = await Notification.find({
        userId: userId,
      }).sort({ createdAt: -1 });
  
      res.status(200).json({
        success: true,
        receivedNotifications,
        createdNotifications,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Server Error",
        error: err.message,
      });
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
        const deletedNotification = await Notification.findByIdAndDelete({notificationId});
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
