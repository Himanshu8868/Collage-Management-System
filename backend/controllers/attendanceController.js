const Attendance = require('../models/Attandance');
const User = require('../models/User');
const Course = require('../models/Course');



// Faculty marks attendance
const markAttendance = async (req, res) => {
    try {
        const { studentId, courseId, status } = req.body;

        const student = await User.findById(studentId)

        if (!student || student.role !== "student") {
            return res.status(400).json({ message: "Invalid student ID" });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(400).json({ message: "Invalid course ID" });
        }

        // Ensure faculty is assigned to this course
        if (String(course.instructor) !== String(req.user.id)) {
            return res.status(403).json({ message: "Not authorized to mark attendance for this course" });
        }

        const attendance = await Attendance.create({
            student: studentId,
            course: courseId,
            status,
        });
        // Populate student and course details in response
        const populatedAttendance = await Attendance.findById(attendance._id)
            .populate("student", "name email")
            .populate("course", "name code");

        res.status(201).json({
            success: true,
            message: "Attendance marked successfully",
            attendance: populatedAttendance
        });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

   // Get attendance for a student
const getAttendanceByStudent = async (req, res) => {
    try {
        const studentId = req.params.id;
        const attendance = await Attendance.find({ student: studentId }).populate("course", "name code");
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get attendance for a course
const getAttendanceByCourse = async (req, res) => {
    try {
        const courseId = req.params.id;

        const attendance = await Attendance.find({ course: courseId })
            .populate("student", "name email")
            .populate("course", "name code");

        res.json(attendance);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
module.exports = {
    markAttendance ,
    getAttendanceByStudent,
    getAttendanceByCourse
};






