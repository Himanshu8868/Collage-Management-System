const mongoose = require('mongoose');

const feePaymentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  feeStructure: { type: mongoose.Schema.Types.ObjectId, ref: 'FeeStructure', required: true },
  amountPaid: Number,
  paymentDate: { type: Date, default: Date.now },
  paymentMode: String, // e.g., Cash, UPI, Bank Transfer
  status: { type: String, enum: ['Paid', 'Pending'], default: 'Paid' },
});

module.exports = mongoose.model('FeePayment', feePaymentSchema);
