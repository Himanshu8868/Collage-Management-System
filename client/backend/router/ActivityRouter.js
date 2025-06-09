const express = require('express');
const router = express.Router();

const { CreateActivity , AllActivities , recentActivity  } = require('../controllers/activityController');
const {protect , isAdmin, isAdminOrFaculty , isFaculty } = require('../middleware/authMiddleware')

// Create a new activity
router.post('/create', protect, CreateActivity);

// Get all activities (Admin only)
router.get('/all', protect, isAdmin, AllActivities);

// student activity for instructor //

// router.get("/student-activity" ,protect , isFaculty , getInstructorActivities)
//Fetch recent Activeiy 
router.get('/recent' , protect , recentActivity); // fetch recent activity that is not older than 7 days or just creaeted 

module.exports = router;