const express = require('express');
const { markAttendance , getAttendanceByStudent , getAttendanceByCourse } = require('../controllers/attendanceController');
const router = express.Router();
const {protect , isStudent , isFaculty , isAdmin} = require('../middleware/authMiddleware');

//Mark Attendance
   
router.post('/mark', protect, isFaculty, markAttendance);

//get by id //
 
// Student checks their own attendance
router.get("/student/:id", protect, isStudent, getAttendanceByStudent);

// Admin or Faculty checks attendance for a course
router.get("/course/:id", protect, isFaculty, getAttendanceByCourse);


module.exports = router;