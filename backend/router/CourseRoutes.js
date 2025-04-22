const express = require("express");
const {
    createCourse,
    GetInstructors,
    getCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    enrollInCourse,
    getEnrolledCourses,
    getMyCourses
} = require("../controllers/CourseController");
const { protect, isAdmin, isFaculty, isStudent } = require("../middleware/authMiddleware");

const router = express.Router();

// Admin creates a new course
router.post("/create-course", protect, isAdmin, createCourse);

// Get all Instructors for creating course
router.get("/instructors", protect, isAdmin, GetInstructors);

// Faculty get all courses they are teaching
router.get("/my-courses", protect, isFaculty, getMyCourses);

// Get all courses (for students and faculty)
router.get("/", getCourses);

// Get course by ID By course Id  for public
router.get("/:id", getCourseById);

// Admin or faculty updates a course
router.put("/:id", protect, isAdmin, updateCourse);

// Admin deletes a course
router.delete("/:id", protect, isAdmin, deleteCourse);

// Student enrolls in a course
router.post("/:id/enroll", protect, isStudent, enrollInCourse);

// Get enrolled courses for a student 
router.get("/:id/enrolled", protect, isStudent, getEnrolledCourses);

module.exports = router;
