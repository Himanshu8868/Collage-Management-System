
const Attendance = require('../models/Attandance');
const User = require('../models/User');
const Course = require('../models/Course');
const geolib = require('geolib');
const Notification = require('../models/Notification');
const {ALLOWED_LOCATION, ALLOWED_RADIUS } = require('../config');


// Mark self  attendance (faculty/admin)
const markSelfAttendance = async (req, res) => {
  try {
    const userId = req.user._id;
    const role = req.user.role;

    if (role !== 'faculty' && role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only faculty or admin can mark self-attendance' });
    }

    const { latitude, longitude } = req.body;
    const date = new Date().toISOString().split('T')[0]; // Just the date

    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Latitude and longitude are required.' });
    }

    const alreadyMarked = await Attendance.findOne({ user: userId, date });
    if (alreadyMarked) {
      return res.status(400).json({ success: false, message: 'Attendance already marked for today' });
    }

    const isInside = geolib.isPointWithinRadius(
      { latitude, longitude },
      ALLOWED_LOCATION,
      ALLOWED_RADIUS
    );

    if (!isInside) {
      return res.status(403).json({ success: false, message: 'You are outside the allowed location.' });
    }

    const attendance = new Attendance({
      user: userId,
      role,
      date,
      status: 'present',
      requestedBy: userId,
      approvedBy: userId
    });

    await attendance.save();

    return res.status(201).json({ success: true, message: 'Self-attendance marked successfully' , attendance });
  } catch (err) {
    console.error('Self-attendance error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Mark attendance directly with geo-location (auto Present)
const markGeoAttendance = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { courseId, latitude, longitude } = req.body;

    if (!courseId || latitude == null || longitude == null) {
      return res.status(400).json({ success: false, message: "Course and location are required." });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found." });
    }

    const isInside = geolib.isPointWithinRadius(
      { latitude, longitude },
      ALLOWED_LOCATION,
      ALLOWED_RADIUS
    );

    if (!isInside) {
      return res.status(403).json({ success: false, message: "You are outside the allowed location." });
    }

    const startOfDay = new Date(); startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(); endOfDay.setHours(23, 59, 59, 999);

    const alreadyMarked = await Attendance.findOne({
      student: studentId,
      course: courseId,
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    if (alreadyMarked) {
      return res.status(409).json({ success: false, message: "Attendance already marked today." });
    }

    const attendance = new Attendance({
      student: studentId,
      course: courseId,
      date: new Date(),
      status: "Present",
      location: { latitude, longitude }
    });

    await attendance.save();

    res.status(200).json({
      success: true,
      message: "Attendance marked successfully.",
      data: attendance,
    });

  } catch (error) {
    console.error("Geo Attendance Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Submit attendance request for faculty approval (pending)
const markAttendanceRequest = async (req, res) => {
  try {
    const studentId = req.user._id;
    const role = req.user.role;
    const { courseId, latitude, longitude } = req.body;

    if (!latitude || !longitude || !courseId) {
      return res.status(400).json({ success: false, message: "Latitude, longitude, and courseId are required." });
    }

    const isInside = geolib.isPointWithinRadius(
      { latitude, longitude },
      ALLOWED_LOCATION,
      ALLOWED_RADIUS
    );

    if (!isInside) {
      return res.status(403).json({ success: false, message: "You are outside the allowed location." });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found." });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const existing = await Attendance.findOne({
      student: studentId,
      course: courseId,
      date: { $gte: today, $lt: tomorrow }
    });

    if (existing) {
      return res.status(409).json({ success: false, message: "Attendance already requested today." });
    }

    const attendance = new Attendance({
      student: studentId,
      user: studentId,
      role,
      course: courseId,
      date: new Date(),
      location: { latitude, longitude },
      status: "pending",
      requestedBy: studentId,
    });

    await attendance.save();

    //  Notify the instructor
    await Notification.create({
      userId: course.instructor,
      title: "New Attendance Request",
      message: `Student has requested attendance for ${new Date().toDateString()}.`,
      link: `/attendance-request`, // or wherever the instructor sees requests
    });

    res.status(200).json({
      success: true,
      message: "Attendance request submitted successfully.",
      data: attendance,
    });
  } catch (error) {
    console.error("Attendance Request Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


// Faculty fetches pending requests
const getFacultyAttendanceRequests = async (req, res) => {
  try {
    const facultyId = req.user._id;

    const courses = await Course.find({ instructor: facultyId }).select('_id');
    const courseIds = courses.map(course => course._id);

    if (courseIds.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    const requests = await Attendance.find({
      course: { $in: courseIds },
      status: 'pending'
    })
      .populate('student', 'name email')
      .populate({
        path: 'course',
        select: 'name instructor',
        populate: {
          path: 'instructor',
          select: 'name email'
        }
      });

    res.status(200).json({ success: true, message: "Attendance found", data: requests });

  } catch (err) {
    console.error("Faculty Request Error:", err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};


// Faculty responds to request by attendance id
const respondToAttendanceRequest = async (req, res) => {
  try {
    const facultyId = req.user._id;
    const attendanceId = req.params.id;
    const action = req.body.action?.toLowerCase();

    if (!["approved", "rejected"].includes(action)) {
      return res.status(400).json({ success: false, message: "Invalid action" });
    }

    const attendance = await Attendance.findById(attendanceId).populate('course');
    if (!attendance) return res.status(404).json({ success: false, message: "Attendance not found" });

    if (String(attendance.course.instructor) !== String(facultyId)) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    if (attendance.status !== "pending") {
      return res.status(400).json({ success: false, message: "Already responded" });
    }

    attendance.status = action;
    await attendance.save();

    await Notification.create({
      userId: attendance.student,
      title: `Attendance ${action.charAt(0).toUpperCase() + action.slice(1)}`,
      message: `Your attendance request for ${attendance.course.name} has been ${action}.`,
      link: `/attendance-record`,
    });

    res.status(200).json({ message: `Attendance ${action} successfully` });

  } catch (error) {
    console.error("Error in respondToAttendanceRequest:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get student-wise attendance
const getAttendanceByStudent = async (req, res) => {
  try {
    const studentId = req.params.id;
    const attendance = await Attendance.find({ student: studentId })
      .populate("course", "name code");
    res.status(200).json({ success: true, data: attendance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get course-wise attendance
const getAttendanceByCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const attendance = await Attendance.find({ course: courseId })
      .populate("student", "name email")
      .populate("course", "name code");
    res.status(200).json({ success: true, data: attendance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAttendanceSummaryByStudent = async (req, res) => {
  try {
    const studentId = req.params.id;

    // Only fetch courses the student is enrolled in
    const enrolledCourses = await Course.find({ enrolledStudents: studentId });

    const summary = [];

    for (const course of enrolledCourses) {
      const total = await Attendance.countDocuments({ student: studentId, course: course._id });
      const present = await Attendance.countDocuments({ student: studentId, course: course._id, status: 'approved' });

      const percentage = total === 0 ? 0 : Math.round((present / total) * 100);

      summary.push({
        course: course.name,
        totalDays: total,
        presentDays: present,
        percentage,
      });
    }

    res.json({ message: "enrolled course data found " ,  success: true, data: summary });

  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};


//total attendance of a student in his career by stusent id //
// controllers/attendanceController.js

const getOverallAttendanceStats = async (req, res) => {
  try {
    const role = req.user.role;
    let userId = req.user._id;

    // Allow faculty or admin to specify a studentId
    if ((role === 'faculty' || role === 'admin') && req.params.studentId) {
      userId = req.params.studentId;
    }

    let attendanceRecords;

    if (role === 'student') {
      attendanceRecords = await Attendance.find({ student: userId });
    } else if (role === 'faculty' || role === 'admin') {
      attendanceRecords = await Attendance.find({ student: userId });
    } else {
      return res.status(403).json({ success: false, message: "Unauthorized role" });
    }

    const totalDays = attendanceRecords.length;
    const presentDays = attendanceRecords.filter(record =>
      record.status === 'present' || record.status === 'approved'
    ).length;

    const absentDays = totalDays - presentDays;
    const attendancePercentage = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(2) : 0;

    res.status(200).json({
      success: true,
      data: {
        totalDays,
        presentDays,
        absentDays,
        attendancePercentage,
      },
    });
  } catch (err) {
    console.error("Error fetching overall attendance:", err);
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};



//  instructor can see their students attendance summary //
const getInstructorAttendanceSummary = async (req, res) => {
  try {
    const instructorId = req.user.id; // assuming authenticated user
    const courseId = req.params.courseId;

    // Confirm course belongs to this instructor
    const course = await Course.findOne({ _id: courseId, instructor: instructorId }).populate('studentsEnrolled', 'name email');
    if (!course) {
      return res.status(403).json({ success: false, message: "Unauthorized or course not found" });
    }

    const summary = [];

    for (const student of course.studentsEnrolled) {
      const total = await Attendance.countDocuments({ course: courseId, student: student._id });
      const present = await Attendance.countDocuments({ course: courseId, student: student._id, status: 'approved' });

      summary.push({
        studentId: student._id,
        name: student.name,
        email: student.email,
        total,
        present,
        absent: total - present,
        percentage: total === 0 ? 0 : Math.round((present / total) * 100),
      });
    }

    res.json({ success: true, data: summary });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};



module.exports = {
  markSelfAttendance,
  markGeoAttendance,
  markAttendanceRequest, 
  getFacultyAttendanceRequests,
  respondToAttendanceRequest,
  getAttendanceByStudent,
  getAttendanceByCourse,
  getAttendanceSummaryByStudent,
  getOverallAttendanceStats,
  getInstructorAttendanceSummary,
};
