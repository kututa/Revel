import express from 'express'
import { getAccessToken } from './getToken.js';
import axios from 'axios';
export const paymentRoutes = express.Router()
paymentRoutes.post('/initiate-payment', async (req, res) => {
  const { phone, amount } = req.body; // Phone in format 2547XXXXXXXX
  const accessToken = await getAccessToken();

  if (!accessToken) {
    return res.status(500).json({ error: 'Failed to get access token' });
  }

  const timestamp = new Date()
    .toISOString()
    .replace(/[^0-9]/g, '')
    .slice(0, -3);
  const shortcode = '174379';
  const passkey = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';
  const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');

  try {
    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: phone,
        PartyB: shortcode,
        PhoneNumber: phone,
        CallBackURL: 'https://1029-102-0-5-80.ngrok-free.app/api/mpesa-callback', // Your server endpoint for M-Pesa callbacks
        AccountReference: 'Test Payment',
        TransactionDesc: 'Payment for service',
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }//
    );

    res.json(response.data);
  } catch (error) {
    console.error('STK Push error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Payment request failed' });
  }
});

paymentRoutes.post('/mpesa-callback', (req, res) => {
  const callbackData = req.body;
  console.log('Payment callback received:', callbackData);

  // Check if payment was successful
  if (callbackData.Body.stkCallback.ResultCode === 0) {
    console.log('Payment successful!', callbackData.Body.stkCallback.CallbackMetadata);
    // Update your database here
  } else {
    console.log('Payment failed:', callbackData.Body.stkCallback.ResultDesc);
  }

  res.status(200).send(); // Always acknowledge receipt
});