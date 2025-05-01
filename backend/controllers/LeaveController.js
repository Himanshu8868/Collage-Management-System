const Leave = require('../models/LeaveModel');
const User = require('../models/User');
const Notification = require('../models/Notification');

 // Submit a leave request
 const submitLeave = async (req, res) => {
  try {
    const { fromDate, toDate, reason, leaveType } = req.body;
  

    if (req.user.role !== "faculty" && req.user.role !== "student") {
      return res.status(400).json({ message: 'Only students or faculty can submit leave' });
    }

    // Validation
    if (!fromDate || !toDate || !reason) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    // Create new leave request
    const newLeave = new Leave({
      userId: req.user._id,
      userType: req.user.role,
      fromDate,
      toDate,
      reason,
      leaveType,
      status: 'pending',
    });

    await newLeave.save();

    // Create notification for admins
    const admins = await User.find({ role: 'admin' });
    const adminIds = admins.map(admin => admin._id);

    await Notification.create({
      userId: req.user._id,
      receiverIds: adminIds,
      title: `Leave Request from ${req.user.name}`,
      message: `New leave request from ${req.user.name} for ${leaveType} leave`,
      type: 'leave_request',
      status: 'unread',
      link: "/pending-request"
    });

    // Populate user details
    const populatedLeave = await Leave.findById(newLeave._id).populate('userId', 'name email');

    res.status(201).json({ message: 'Leave request submitted successfully', leave: populatedLeave });

  } catch (error) {
    console.error('Submit Leave Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};



 // Get Pending Leave Requests
 const PendingLeaveRequest = async (req, res) => {
  try {
    // Fetch pending leave requests
    const pendingLeaves = await Leave.find({ status: 'pending' })
      .populate('userId', 'name email'); 
    
    if (!pendingLeaves || pendingLeaves.length === 0) {
      return res.status(404).json({ message: 'No pending leave requests found' });
    }

    res.status(200).json({
      message: 'Pending leave requests fetched successfully',
      leaves: pendingLeaves,
    });

  } catch (error) {
    console.error('Error fetching pending leave requests:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

  

  //  Approve Leave Request

  const ApproveLeaveRequest = async (req, res) => { 
    try {  
      const { leaveId } = req.params; 
      const userId = req.user._id;
        
    const  updatedLeave = await Leave.findByIdAndUpdate(leaveId, { status: 'approved' }, { new: true });  
    
    if (!updatedLeave) { 
        return res.status(404).json({ message: 'Leave request not found' }); 
    }

    // Create notification for the user who requested the leave
    await Notification.create({
      userId: userId,
      receiverIds: [updatedLeave.userId], 
      title: `Leave Request Approved`,
      message: `Your leave request from ${updatedLeave.fromDate} to ${updatedLeave.toDate} has been approved.`,
      type: 'leave_request',
      status: 'unread',
      link: "/leave-request"
    });

       res.status(200).json({ message: 'Leave request approved successfully', leave: updatedLeave });
    
    }catch (error) { 
        console.error('Approve Leave Error:', error); 
        res.status(500).json({ message: 'Server Error' }); 
    };
  }

    // Reject Leave Request

    // Reject Leave Request
const RejectRequest = async (req, res) => {
  try {
    const { leaveId } = req.params;
    const userId = req.user._id;

    const updateLeave = await Leave.findByIdAndUpdate(
      leaveId,
      { status: "rejected" },
      { new: true }
    );

    if (!updateLeave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    await Notification.create({
      userId: userId,
      receiverIds: [updatedLeave.userId], 
      title: `Leave Request Approved`,
      message: `Your leave request from ${updatedLeave.fromDate} to ${updatedLeave.toDate} has been rejected.`,
      type: 'leave_request',
      status: 'unread',
      link: "/leave-request"
    });


    res.status(200).json({ message: 'Leave request rejected successfully', leave: updateLeave });
  } catch (error) {
    console.error('Reject Leave Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get All Leave Requests (Admin can access all)
const getAllLeaveRequests = async (req, res) => {
  try {
    const allLeaves = await Leave.find().populate('userId', 'name email'); // populates user info if needed
    
    if (allLeaves.length === 0) {
      return res.status(404).json({ message: 'No leave requests found' });
    }

    res.status(200).json({ leaves: allLeaves });
  } catch (error) {
    console.error('Get All Leaves Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// This api allows (admin , student  ) to fetch their own Leave requests //

const getLeaveRequestsByUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const userLeaves = await Leave.find({ userId }).populate('userId', 'name email');

    if (userLeaves.length === 0) {
      return res.status(404).json({ message: 'No leave requests found for this user' });
    }

    res.status(200).json({ leaves: userLeaves });
  } catch (error) {
    console.error('Get User Leave Requests Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};



// User cancel leave request (optional)

const cancelLeaveRequest = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.leaveId);
    
    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    // Only allow cancellation if status is pending
    if (leave.status !== 'pending') {
      return res.status(400).json({ 
        message: 'Only pending leave requests can be cancelled' 
      });
    }

    leave.status = 'cancelled';
    await leave.save();

    res.json({ message: 'Leave request cancelled successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = {
   submitLeave,
   PendingLeaveRequest,
   ApproveLeaveRequest,
   RejectRequest,
   getAllLeaveRequests,
   getLeaveRequestsByUser,
   cancelLeaveRequest
};
