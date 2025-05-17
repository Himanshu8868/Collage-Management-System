const express = require('express');
const router = express.Router();
const {
  createSchedule,
  getStudentSchedule,
  getAllSchedules,
  deleteSchedule
} = require('../controllers/scheduleControllers');
const { protect, isAdmin , isStudent } = require('../middleware/authMiddleware');



// Routes
router.post('/create',protect , createSchedule);
router.get('/student', protect , getStudentSchedule);
router.get('/all', getAllSchedules);
router.delete('/:id', deleteSchedule);

module.exports = router;
