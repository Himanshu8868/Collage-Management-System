const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
  },
  instructorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  userType: {
    type: String,
    enum: ['student', 'faculty'],
    ref: 'User',
    required: true,
  },
  fromDate: {
    type: Date,
    required: true,
  },
  toDate: {
    type: Date,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  leaveType: {
    type: String,
    enum: ['Paid', 'Sick', 'Casual', 'Other'],
    default: 'Paid',
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected ', 'cancelled'],
    default: 'pending',
  },
}, { timestamps: true });

module.exports = mongoose.model('Leave', leaveSchema);
