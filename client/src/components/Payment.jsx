import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentPage from '../pages/paymentPage/PaymentPage'

const stripePromise = loadStripe('pk_test_51QwzdyFK2BggiRNzsDeGp6dTUUxF4ApmPzpwywcgelDp4BxmwuJwkWVfZ7rV5SsBohKx2vkpV4JBQy02e2V1Z3rL00Tj5hyXrl');

const Payment = () => (
  <Elements stripe={stripePromise}>
    <PaymentPage />
  </Elements>
);

export default Payment;
