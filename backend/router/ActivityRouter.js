const express = require('express');
const router = express.Router();

const { CreateActivity , AllActivities , recentActivity } = require('../controllers/activityController');
const {protect , isAdmin } = require('../middleware/authMiddleware')

// Create a new activity
router.post('/create', protect, CreateActivity);

// Get all activities (Admin only)
router.get('/all', protect, isAdmin, AllActivities);

//Fetch recent Activeiy 
router.get('/recent' , protect , recentActivity);

module.exports = router;