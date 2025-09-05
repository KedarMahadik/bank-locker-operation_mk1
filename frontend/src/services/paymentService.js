// front/src/services/paymentService.js
import apiClient from './apiClient';

export const createRazorpayOrder = (amount) => {
  return apiClient.post('/payment/create-order', { amount });
};

export const verifyRazorpayPayment = (paymentData) => {
  return apiClient.post('/payment/verify-payment', paymentData);
};