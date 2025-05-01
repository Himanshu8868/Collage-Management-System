const express = require("express");
const {
    createCourse,
    getPendingCourseRequests , //Admins Can ApproverejectCourse
    approveCourseById,
    rejectCourseById,
    GetInstructors,
    getCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    enrollInCourse,
    getEnrolledCourses,
    getMyCourses,
    deleteAllCourses
} = require("../controllers/CourseController");
const { protect, isAdmin, isFaculty, isStudent , isAdminOrFaculty } = require("../middleware/authMiddleware");

const router = express.Router();

// Admin creates a new course
router.post("/create-course", protect, isAdminOrFaculty, createCourse);

router.get("/pending-requests" , protect , isAdmin , getPendingCourseRequests)

// Admin approves a course request
    router.patch("/approve-course/:id", protect, isAdmin, approveCourseById);

// Reject course By course Id
router.patch("/reject-course/:id", protect, isAdmin, rejectCourseById);


// Get all Instructors for creating course
router.get("/instructors", protect, isAdmin, GetInstructors);

// Faculty get all courses they are teaching
router.get("/my-courses", protect, isFaculty, getMyCourses);

router.delete("/delete-all", protect, isAdmin, deleteAllCourses);

// Get enrolled courses for a student 
router.get("/enrolled", protect, isStudent, getEnrolledCourses);

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



// Delete all courses (Admin only)

module.exports = router;
