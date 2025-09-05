// front/src/pages/auth/PaymentPage.jsx
import React from 'react';
import { Container, Paper, Typography, Box } from '@mui/material';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import Button from '../../components/common/Button';
import useAuth from '../../hooks/useAuth';
import { createRazorpayOrder, verifyRazorpayPayment } from '../../services/paymentService';

const PaymentPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const lockerFee = 500; // Example fee in INR

  const handlePayment = async () => {
    try {
      // 1. Create Order on your backend
      const { data: order } = await createRazorpayOrder(lockerFee);
      
      // 2. Configure Razorpay options
      const options = {
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        name: "Bank Locker System",
        description: "Annual Locker Fee",
        order_id: order.order_id,
        // 3. This handler function is called by Razorpay on successful payment
        handler: async (response) => {
          try {
            await verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast.success('Payment successful! Your account is being activated.');
            // Webhook will handle final activation. Redirect user.
            navigate('/user/dashboard');
          } catch (error) {
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: user.full_name,
          email: user.email,
          contact: user.phone_number,
        },
        theme: {
          color: "#0D47A1", // Your primary theme color
        },
      };

      // 4. Open the Razorpay Checkout form
      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      toast.error('Could not initiate payment. Please try again later.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>Complete Your Payment</Typography>
        <Typography variant="h6" color="text.secondary">
          Annual Locker Fee: ₹{lockerFee.toFixed(2)}
        </Typography>
        <Typography sx={{ my: 3 }}>
          Click the button below to proceed with our secure payment gateway. Your account will be activated upon successful payment.
        </Typography>
        <Button variant="contained" size="large" onClick={handlePayment}>
          Pay Now with Razorpay
        </Button>
      </Paper>
    </Container>
  );
};

export default PaymentPage;