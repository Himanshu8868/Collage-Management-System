const express = require('express');
const router = express.Router();
const { createFeeStructure , getMyFeeDetails  , getFeeStructures ,getStudentPayments ,  createStripePaymentIntent , recordFeePayment} = require('../controllers/FeeController');

const { protect, isAdmin , isStudent } = require('../middleware/authMiddleware');

//  Create Fee Structure
router.post('/create', protect , isAdmin ,createFeeStructure);

// Get studnet fee  //

router.get('/my-fee' , protect ,isStudent ,  getMyFeeDetails)

// get fess structures //
 
router.get('/'  , getFeeStructures )

// get student fee details //
router.get('/payments', protect , isStudent , getStudentPayments);

router.post('/record'  ,protect , isStudent , recordFeePayment)

router.post('/create-payment-intent',protect , isStudent , createStripePaymentIntent);




module.exports = router;
