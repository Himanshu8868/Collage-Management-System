const express = require('express');

const { markAttendance , getAttendanceByStudent , getAttendanceByCourse , markGeoAttendance , markAttendanceRequest ,getFacultyAttendanceRequests ,respondToAttendanceRequest ,getAttendanceSummaryByStudent ,getOverallAttendanceStats ,markSelfAttendance ,  getInstructorAttendanceSummary  } = require('../controllers/attendanceController');

const router = express.Router();
const {protect , isStudent , isFaculty , isAdmin , isAdminOrFaculty} = require('../middleware/authMiddleware');

//Mark Attendance
   
router.post('/self-attendance', protect,isAdminOrFaculty, markSelfAttendance);

//get by id //
 
// Student checks their own attendance
router.get("/student/:id", protect, isStudent, getAttendanceByStudent);

// Admin or Faculty checks attendance for a course
router.get("/course/:id", protect, isFaculty, getAttendanceByCourse);

router.post("/geo-mark", protect, isAdmin , markGeoAttendance)

// router.get("/get", protect, isAdmin , getAttendance)

//Mark Attendance with Geo location request
router.post('/request-attendance', protect, isStudent , markAttendanceRequest);

//relted instructor by the course  can approve attendance request

router.get('/requests', protect, isFaculty, getFacultyAttendanceRequests);

//  Respond attendance request //

router.put('/respond/:id', protect, isFaculty, respondToAttendanceRequest );

// provides a summary of attendance for a specific student by student id //

  router.get('/summary/student/:id' ,protect, getAttendanceSummaryByStudent )

  //toal student presense by student id
  router.get('/overall-attendance/:id', protect, getOverallAttendanceStats);


// Instructor gets attendance summary of their students in a specific course
router.get('/instructor/students/attendance-summary/:courseId', protect, isFaculty, getInstructorAttendanceSummary);


module.exports = router;