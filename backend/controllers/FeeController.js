const stripe = require('../utils/Stripe');
const FeeStructure = require('../models/FeeStructure');
const FeePayment = require('../models/FeePayment');
const User = require('../models/User');

// 1. Create a new fee structure
const createFeeStructure = async (req, res) => {
  try {
    const { department, year, semester, amount } = req.body;
    const feeStructure = new FeeStructure({ department, year, semester, amount });

    await feeStructure.save();
    res.status(201).json(feeStructure);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create fee structure' });
  }
};

// 2. Get all fee structures
const getFeeStructures = async (req, res) => {
  try {
    const structures = await FeeStructure.find();
    res.json(structures);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch fee structures' });
  }
};

// 3. Record a student's fee payment
const recordFeePayment = async (req, res) => {
  try {
    const studentId = req.user.id; // from auth middleware

    const { feeStructure, amountPaid, paymentMode } = req.body;

    const payment = new FeePayment({
      student: studentId,
      feeStructure,
      amountPaid,
      paymentMode,
      status: 'Paid',
    });

    await payment.save();

    // Populate name and email from student
    const populatedPayment = await FeePayment.findById(payment._id)
      .populate('student', 'name email ');

    res.status(201).json(populatedPayment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to record payment' });
  }
};



// 4. Get payment history for a student
const getStudentPayments = async (req, res) => {
  try {
    const studentId = req.user?._id; // Automatically fetched from token/session

    if (!studentId) {
      return res.status(401).json({ error: 'Unauthorized: Student ID not found' });
    }

    const payments = await FeePayment.find({ student: studentId })
      .populate('feeStructure')
      .sort({ paymentDate: -1 });

    if (payments.length === 0) {
      return res.status(200).json({ message: 'No payments found for this student' });
    }

    res.json(payments);
  } catch (error) {
    console.error('Error fetching student payments:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
};


// 5. Get fee details for a student
const getMyFeeDetails = async (req, res) => {
  try {
    const  studentId  = req.user?._id; 

    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const feeStructure = await FeeStructure.findOne({
      department: student.department,
      year: student.enrollYear,
      semester: student.semester,
    });

    if (!feeStructure) {
      return res.status(404).json({ error: 'No fee structure found for your course/year' });
    }
    

    const payment = await FeePayment.findOne({
      student: studentId,
      feeStructure: feeStructure._id,
    });

    const totalFee = feeStructure.amount;
    const amountPaid = payment ? payment.amountPaid : 0;
    const remaining = totalFee - amountPaid;

    res.json({
      student: student.name,
      email: student.email,
      course: student.department,
      year: student.enrollYear,
      semester: feeStructure.semester,
      totalFee,
      amountPaid,
      remaining,
      status: payment ? payment.status : "Not Paid",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong while fetching fee details' });
  }
};

// 6. Create Stripe Payment Intent



const createStripePaymentIntent = async (req, res) => {
  try {
    const student = req.user;

    const fee = await FeeStructure.findOne({
      department: student.department,
      year: student.enrollYear,
      semester: student.semester,
    });

    if (!fee) return res.status(404).json({ error: "Fee structure not found" });

    // Check if payment already exists for this student and feeStructure
    const existingPayment = await FeePayment.findOne({
      student: student._id,
      feeStructure: fee._id,
      status: "Paid", // only block if paid
    });

    if (existingPayment) {
      return res.status(400).json({ error: "Fee already submitted for this semester" });
    }

    // If no payment found, create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: fee.amount * 100,
      currency: "inr",
      automatic_payment_methods: { enabled: true },
      receipt_email: student.email,
      metadata: {
        studentId: student._id.toString(),
        department: student.department,
        year: student.enrollYear,
        semester: student.semester,
        name: student.name,
        email: student.email,
        phone: student.phone || '',
      },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
      amount: fee.amount,
      feeStructureId: fee._id,
      email: student.email,
      name: student.name,
      studentId: student._id,
    });

  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ error: "Stripe payment initiation failed" });
  }
};


// Export all controllers
module.exports = {
  createFeeStructure,
  getFeeStructures,
  recordFeePayment,
  getStudentPayments,
  getMyFeeDetails,
  createStripePaymentIntent,
};
