import axios from "axios";
import dotenv from 'dotenv'
dotenv.config()
const consumerKey = process.env.CONSUMER_KEY;
const consumerSecret = process.env.CONSUMERSECRET
const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

export const getAccessToken = async () => {
  try {
    
    const response = await axios.get(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
};