import express from 'express'
import dotenv from 'dotenv'
import { getAccessToken } from './getToken.js';
import axios from 'axios';
export const paymentRoutes = express.Router()
import executeQuery from '../utils/helper.js';
dotenv.config()

const timestamp = new Date()
    .toISOString()
    .replace(/[^0-9]/g, '')
    .slice(0, -3);
  const shortcode = '174379';
  const passkey = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';
  const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');
paymentRoutes.post('/initiate-payment', async (req, res) => {
  const { phone, amount } = req.body; // Phone in format 2547XXXXXXXX
  const accessToken = await getAccessToken();

  if (!accessToken) {
    return res.status(500).json({ error: 'Failed to get access token' });
  }

  

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
        CallBackURL:`${process.env.BASE_URL}/api/mpesa-callback`, // Your server endpoint for M-Pesa callbacks
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
paymentRoutes.post('/mpesa-callback', async (req, res) => {
  const callbackData = req.body;
  
  if (!callbackData?.Body?.stkCallback) {
    return res.status(400).json({ error: 'Invalid callback format' });
  }

  const stkCallback = callbackData.Body.stkCallback;

  try {
    // Upsert pattern - tries insert, falls back to update
    await executeQuery(
      `INSERT INTO mpesa_transactions 
      (checkout_request_id, result_code, callback_metadata, result_desc, raw_data)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        result_code = VALUES(result_code),
        callback_metadata = VALUES(callback_metadata),
        result_desc = VALUES(result_desc),
        raw_data = VALUES(raw_data)`,
      [
        stkCallback.CheckoutRequestID,
        stkCallback.ResultCode,
        stkCallback.CallbackMetadata ? JSON.stringify(stkCallback.CallbackMetadata.Item) : null,
        stkCallback.ResultDesc || null,
        JSON.stringify(callbackData)
      ]
    );

    res.status(200).send();
  } catch (error) {
    console.error('Failed to store callback:', error);
    
    // Critical: Always respond with 200 to prevent M-Pesa retries
    res.status(200).send();
  }
});

paymentRoutes.get('/payment-status/:checkoutId', async (req, res) => {
  const { checkoutId } = req.params;
  
  try {
    // 1. First check local database
    const [localResult] = await executeQuery(
      `SELECT checkout_request_id, result_code, callback_metadata, result_desc
       FROM mpesa_transactions 
       WHERE checkout_request_id = ?`,
      [checkoutId]
    );

    // 2. If found in DB, return it
    if (localResult) {
      return res.json(localResult);
    }

    // 3. If not found, query M-Pesa directly
    const accessToken = await getAccessToken();
    if (!accessToken) {
      throw new Error('Failed to get access token');
    }

    // const timestamp = new Date()
    //   .toISOString()
    //   .replace(/[^0-9]/g, '')
    //   .slice(0, -3);
    // const password = Buffer.from(`174379bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919${timestamp}`).toString('base64');

    const queryResponse = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query',
      
        {
    BusinessShortCode: shortcode,
    Password: password,
    Timestamp: timestamp,
    CheckoutRequestID: checkoutId
  },
       { headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
      
    );

   const result = await queryResponse.data;

    if (result.ResultCode !== undefined) {
      await executeQuery(
        `INSERT INTO mpesa_transactions 
        (checkout_request_id, result_code, callback_metadata, result_desc, raw_data)
        VALUES (?, ?, ?, ?, ?)`,
        [
          checkoutId,
          result.ResultCode,
          result.CallbackMetadata ? JSON.stringify(result.CallbackMetadata) : null,
          result.ResultDesc || null,
          JSON.stringify(result)
        ]
      );
    }

    return res.json({
      checkout_request_id: checkoutId,
      result_code: result.ResultCode,
      callback_metadata: result.CallbackMetadata,
      result_desc: result.ResultDesc
    });
   } catch (error) {
    // console.error('Status check failed:', error);
    res.json({ 
      status: 'pending',
      message: 'Payment status could not be verified'
    });
  }
});