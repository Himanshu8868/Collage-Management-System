const express = require('express');
const router = express.Router();
const {submitLeave ,
     PendingLeaveRequest , 
     ApproveLeaveRequest, 
     RejectRequest , 
     getAllLeaveRequests ,
     getLeaveRequestsByUser,
     cancelLeaveRequest
    } = require('../controllers/LeaveController');
const { protect , isAdmin} = require('../middleware/authMiddleware');

// Route to submit a leave request
router.post('/submit', protect, submitLeave);

 
// Get all pending leave requests
router.get('/requests/pending', protect, isAdmin, PendingLeaveRequest);


// Route to approve a leave request
 router.put('/approve/:leaveId' , protect, isAdmin , ApproveLeaveRequest) 

// Route to Reject a leave request 
router.put('/reject/:leaveId' , protect, isAdmin , RejectRequest) 

// Route to get all leave requests 
router.get('/all-records' , protect , isAdmin , getAllLeaveRequests)
         
// Route to get leave requests by user

router.get('/my-leaves', protect, getLeaveRequestsByUser)


//Route for cancel leave request
  router.put('/cancel/:leaveId', protect, cancelLeaveRequest)
 module.exports = router;