const express = require('express');
const router = express.Router();
const { createNotification ,getUserNotifications ,markAsRead ,deleteNotfication ,deleteAllNotifications} = require('../controllers/NotificationController');
const { protect , isFaculty , isAdmin  , isStudent } = require('../middleware/authMiddleware');

//create a new notification
router.post('/', protect, createNotification);

//get all notifications for a user
router.get('/all-notifications', protect, getUserNotifications);

//Notification marked as read 
router.put('/:id/read' ,  protect, markAsRead);

//Delete All Notification //
router.delete('/all-notifications', protect, deleteAllNotifications);

//Delete Notifcation BY id //
router.delete('/delete', protect,  deleteNotfication);




module.exports = router;