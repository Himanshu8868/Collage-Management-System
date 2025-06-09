const express = require('express');
const router = express.Router();
const { getMyResults, getMyResultsByCourse , getAllResults , updateResult , getStudentsByExam , deleteResult} = require('../controllers/ResultControllers');
const { protect, isStudent , isAdmin , isFaculty } = require('../middleware/authMiddleware');

// Route to get logged-in student's results by student ID

  router.get('/:studentId/my-results', protect, isStudent, getMyResults);

// Route to get results by course ID For student //
      
router.get('/:courseId/my-results', protect, isStudent, getMyResultsByCourse);
      
// Route to get all results for admin and faculty
router.get('/all-results', protect, isFaculty ,  getAllResults);  

//Route for Update Result //

router.put("/update-by-details", protect,updateResult); 

// fetch only students related to a selected exam  //

router.get('/by-exam/:examId', protect,  getStudentsByExam); // Fetch students related to selected exam

//Delete result route for admin or instructor //
 router.delete('/delete-result', protect, isAdmin , deleteResult);
module.exports = router;