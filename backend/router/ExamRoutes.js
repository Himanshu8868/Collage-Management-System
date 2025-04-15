const express = require('express');
const router = express.Router();
const { createExam  , getStudentExams, getExams , getExamById , submitExam  , getResultsByStudent ,  getResultsByExam ,ResultDelete ,ResultDeleteByCourse ,examDetails ,UpdateExam ,Details  ,RequestDelete , GetPendingExams ,DeleteExam } = require('../controllers/ExamController');
const { protect, isFaculty , isAdmin , isStudent} = require('../middleware/authMiddleware');

// Faculty creates an exam
router.post("/",  protect , isFaculty , createExam);

// Attending exam for Students //
router.get("/my/exams"  ,protect , isStudent  ,getStudentExams)

// Update exam //
router.put("/:id" , isFaculty , isAdmin , UpdateExam) 

  //Request - delete for Admin //
router.put('/:examId/request-delete', protect , isFaculty  , RequestDelete)

  // Exam pending-deletion --Admin //
router.get("/pending-deletion" ,  protect ,isAdmin, GetPendingExams )

  //Delete Exam Approved  BY Admin //
router.delete('/delete-approved/:examId', protect , isAdmin, DeleteExam );

//Get all exam details
router.get("/all-exams"  , protect , examDetails);

// Get Exam for a Speciic  teacher //
router.get("/exam-specific", protect, isFaculty, Details); 

//Get all exam for a Course
router.get("/:courseId", protect , getExams);

//Get a Exam by ID //
router.get("/id/:id" ,  protect , isStudent ,  getExamById);

// Student submits exam answers 
router.post("/submit/:id",protect , isStudent ,  submitExam);

 //Cheeck submition status //
router.get("/:id/status", protect , isStudent ,  submitExam);

// Result  Delete result by result id //
router.delete("/delete/result/:resultId", protect  , ResultDelete);

//Result ->  Delete all result that realated course by Course id //
 
 router.delete("/delete/results/:examId", protect , isFaculty , ResultDeleteByCourse);

// Get student results
router.get("/student/:id", protect, isStudent , getResultsByStudent);

// Get all results 
 router.get("/result/exam/:id", protect, isFaculty ,   getResultsByExam );

module.exports = router;