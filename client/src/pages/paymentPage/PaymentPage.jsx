import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaCreditCard, FaSpinner, FaCheckCircle } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';

const mapStripeMethodToMode = (type) => {
  switch (type) {
    case "card": return "Card";
    case "upi": return "UPI";
    case "netbanking": return "NetBanking";
    case "wallet": return "Wallet";
    default: return "Online";
  }
};

const PaymentPage = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [amount, setAmount] = useState(0);
  const [paymentError, setPaymentError] = useState(null);
  const [feeStructureId, setFeeStructureId] = useState(null);
  const [message , setMessage] = useState(null);
 
  const [studentInfo, setStudentInfo] = useState({ name: '', email: '', _id: '' });

 useEffect(() => {
  const fetchSecret = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/fee/create-payment-intent`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setClientSecret(res.data.clientSecret);
      setAmount(res.data.amount);
      setFeeStructureId(res.data.feeStructureId);
      setStudentInfo({
        name: res.data.name,
        email: res.data.email,
        _id: res.data.studentId || ""
      });

      setMessage(null); 
    } catch (error) {
      toast.info("payment information.")
      setMessage(error.response?.data?.error || "Failed to fetch payment information.");
    } finally {
      setLoading(false);
    }
  };

  fetchSecret();
}, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setPaymentError(null);

    if (!stripe || !elements || !clientSecret) {
      return toast.error("Payment system not ready. Please wait...");
    }

    setLoading(true);

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: studentInfo.name,
          },
        },
        receipt_email: studentInfo.email,
      });

      if (error) {
        setPaymentError(error.message);
        toast.error(`Payment failed: ${error.message}`);
      } else if (paymentIntent.status === 'succeeded') {
        setPaymentSuccess(true);
        toast.success("Payment successful!");

        const paymentMethodType = paymentIntent.payment_method_types[0];
        const paymentMode = mapStripeMethodToMode(paymentMethodType);

        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/fee/record`, {
          feeStructure: feeStructureId,
          amountPaid: paymentIntent.amount / 100,
          paymentMode,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        toast.success(`You paid via ${paymentMode}`);
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      toast.error("An unexpected error occurred during payment.");
    } finally {
      setLoading(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className=" mt-12 min-h-screen flex items-center justify-center bg-green-50">
        <div className="max-w-md p-6 bg-white rounded-lg shadow-lg text-center">
          <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-4">Your payment of ₹{amount} has been processed.</p>
          <p className="text-sm text-gray-500 mb-4">Receipt sent to your email.</p>
          <button
            onClick={() =>window.history.back()}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (


    <div className="mt-17 min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-lg">
        <div className="flex items-center mb-6">
          <FaCreditCard className="text-blue-500 text-3xl mr-3" />
          <h2 className="text-2xl font-bold text-gray-800">Fee Payment</h2>
        </div>

        <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
          <p className="text-sm text-gray-700"><strong>Student:</strong> {studentInfo.name}</p>
          <p className="text-sm text-gray-700"><strong>Email:</strong> {studentInfo.email}</p>
          <p className="text-sm text-gray-700"><strong>Amount Due:</strong> ₹{amount}</p>
        </div>

        <form onSubmit={handleSubmit}>
              {message && (
      <div className="text-green-600 bg-green-100 border border-green-300 rounded-md p-3 mb-4 text-sm">
        {message}
      </div>
    )}

          <label className="block text-gray-700 text-sm font-medium mb-2">Card Details</label>
          <div className="p-3 border border-gray-300 rounded-md mb-4 bg-white">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': { color: '#aab7c4' },
                  },
                  invalid: { color: '#9e2146' },
                },
              }}
            />
          </div>

          {paymentError && (
            <div className="text-red-500 text-sm mb-4">{paymentError}</div>
          )}

          <button
            type="submit"
            disabled={!stripe || loading}
            className={`w-full py-3 px-4 rounded-md text-white font-semibold flex items-center justify-center ${
              !stripe || loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            } transition duration-200`}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Processing...
              </>
            ) : (
              `Pay ₹${amount}`
            )}
          </button>

          <p className="text-xs text-gray-500 mt-4 text-center">
            Your payment is secure and encrypted.
          </p>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;
