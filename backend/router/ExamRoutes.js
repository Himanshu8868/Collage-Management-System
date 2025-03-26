const express = require('express');
const router = express.Router();
const { createExam , getExams , getExamById , submitExam  , getResultsByStudent ,  getResultsByExam ,examDetails } = require('../controllers/ExamController');
const { protect, isFaculty , isAdmin , isStudent} = require('../middleware/authMiddleware');

// Faculty creates an exam
router.post("/",  protect , isFaculty , createExam);

//Get all exam details
router.get("/exam-details"  , examDetails);


//Get all exam for a Course
router.get("/:courseId", protect , getExams);

//Get a Exam by ID //
router.get("/id/:id" ,  protect , isStudent ,  getExamById);

// Student submits exam answers
router.post("/:id/submit", protect, isStudent, submitExam);

// Get student results
router.get("/student/:id", protect, isStudent , getResultsByStudent);

// Get all results 

    router.get("/result/exam/:id", protect, isFaculty ,   getResultsByExam );

module.exports = router;