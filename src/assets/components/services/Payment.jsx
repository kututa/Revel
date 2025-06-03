import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api'; // Adjust to your backend URL

export const initiateMpesaPayment = async (phone, amount) => {
  try {
    const response = await axios.post(`${BASE_URL}/initiate-payment`, {
      phone: `254${phone.substring(1)}`, // Convert 07... to 2547...
      amount
    });
    return response.data;
  } catch (error) {
    console.error('Payment initiation failed:', error);
    throw error;
  }
};

export const checkPaymentStatus = async (checkoutId) => {
  try {
    const response = await axios.get(`${BASE_URL}/payment-status/${checkoutId}`);
    return response.data;
  } catch (error) {
    console.error('Status check failed:', error);
    throw error;
  }
};