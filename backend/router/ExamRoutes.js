const express = require('express');
const router = express.Router();
const { createExam , getExams , getExamById , submitExam  , getResultsByStudent ,  getResultsByExam ,examDetails ,UpdateExam ,Details  ,RequestDelete , GetPendingExams ,DeleteExam } = require('../controllers/ExamController');
const { protect, isFaculty , isAdmin , isStudent} = require('../middleware/authMiddleware');

// Faculty creates an exam
router.post("/",  protect , isFaculty , createExam);

// Update exam //
  router.put("/:id" , isFaculty , isAdmin , UpdateExam) 

  //Request - delete for Admin //
  router.put('/:examId/request-delete', protect , isFaculty  , RequestDelete)

  // Exam pending-deletion --Admin //
     router.get("/pending-deletion" ,  protect ,isAdmin, GetPendingExams )

  //Delete Exam Approved  BY Admin //
  router.delete('/delete-approved/:examId', protect , isAdmin, DeleteExam );

//Get all exam details
router.get("/exam-details"  , protect , examDetails);

// Get Exam for a Speciic  techer //

router.get("/exam-specific", protect, isFaculty, Details); 

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