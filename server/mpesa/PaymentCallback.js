

app.post('/callback', (req, res) => {
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
//ngrok http 5000  # Maps https://your-ngrok-url.ngrok.io → localhost:5000