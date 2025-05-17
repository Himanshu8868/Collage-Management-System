import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentPage from '../pages/paymentPage/PaymentPage';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const Payment = () => (
  <Elements stripe={stripePromise}>
    <PaymentPage />
  </Elements>
);

export default Payment;
