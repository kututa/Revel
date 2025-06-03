import React, { useState, useEffect } from 'react';
import { initiateMpesaPayment, checkPaymentStatus } from '../components/services/Payment';

const ParcelDeliveryForm = ({ cities }) => {
  const [formData, setFormData] = useState({
    pickupLocation: '',
    deliveryLocation: '',
    parcelSize: '',
    deliveryDate: '',
    receiverName: '',
    receiverPhone: '',
  });

  const [estimatedCost, setEstimatedCost] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [mpesaPhone, setMpesaPhone] = useState('');
  const [checkoutRequestId, setCheckoutRequestId] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const locations = cities?.map((city) => city.name);

  useEffect(() => {
    const getSizes = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/parcel/sizes');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setSizes(result);
      } catch (error) {
        console.error('Failed to fetch parcel sizes:', error);
      }
    };
    getSizes();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(formData).every(val => val)) {
      calculateCost();
      setIsSubmitted(true);
    } else {
      alert('Please fill in all fields');
    }
  };

  const calculateCost = () => {
    const sizeFactors = sizes?.reduce((accumulator, current) => {
      accumulator[current.description] = parseFloat(current.base_price);
      return accumulator;
    }, {});

    const distanceFactor = Math.abs(
      locations.indexOf(formData.pickupLocation) -
      locations.indexOf(formData.deliveryLocation)
    ) || 1;

    const baseCost = sizeFactors[formData.parcelSize] || 200;
    const totalCost = baseCost * distanceFactor;
    setEstimatedCost(totalCost);
  };

  const handleMpesaPayment = async () => {
    if (!mpesaPhone || !estimatedCost) {
      alert('Please enter your M-Pesa number');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await initiateMpesaPayment(mpesaPhone, estimatedCost);
      setCheckoutRequestId(response.CheckoutRequestID);
      startPaymentPolling(response.CheckoutRequestID);
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment initiation failed. Please try again.');
      setIsProcessing(false);
    }
  };

  const startPaymentPolling = (checkoutId) => {
    const pollInterval = setInterval(async () => {
      try {
        const status = await checkPaymentStatus(checkoutId);
        
        if (status.result_code === '0') {
          clearInterval(pollInterval);
          setPaymentConfirmed(true);
          setPaymentStatus('success');
          setIsProcessing(false);
        } else if (status.result_code && status.result_code !== '0') {
          clearInterval(pollInterval);
          setPaymentStatus('failed');
          setIsProcessing(false);
          alert(`Payment failed: ${status.result_desc}`);
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 5000);

    return () => clearInterval(pollInterval);
  };

  const handlePayment = () => {
    if (paymentMethod === 'mpesa') {
      handleMpesaPayment();
    } else {
      setTimeout(() => {
        setPaymentConfirmed(true);
      }, 1500);
    }
  };

  const resetForm = () => {
    setFormData({
      pickupLocation: '',
      deliveryLocation: '',
      parcelSize: '',
      deliveryDate: '',
      receiverName: '',
      receiverPhone: '',
    });
    setEstimatedCost(null);
    setIsSubmitted(false);
    setShowPayment(false);
    setPaymentMethod('');
    setPaymentConfirmed(false);
    setMpesaPhone('');
    setCheckoutRequestId(null);
    setPaymentStatus(null);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 p-4 sm:p-8 flex items-center justify-center" style={{ backgroundColor: '#FFFFC5' }}>
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-[#ffd700] mb-6">
          🚚 Parcel Delivery Form
        </h2>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              { name: 'pickupLocation', label: 'Pickup Location', options: locations },
              { name: 'deliveryLocation', label: 'Delivery Location', options: locations },
              { name: 'parcelSize', label: 'Parcel Size', options: sizes?.map((size) => size.description) }
            ].map(({ name, label, options }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <select
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffd700]"
                  required
                >
                  <option value="">Select {label.toLowerCase()}</option>
                  {options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Date</label>
              <input
                type="date"
                name="deliveryDate"
                value={formData.deliveryDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffd700]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Receiver Name</label>
              <input
                type="text"
                name="receiverName"
                value={formData.receiverName}
                onChange={handleChange}
                placeholder="Enter receiver name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffd700]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Receiver Phone</label>
              <input
                type="tel"
                name="receiverPhone"
                value={formData.receiverPhone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffd700]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#ffd700] text-black py-2 rounded-lg font-semibold hover:bg-[#ffeb3b] transition-all duration-200"
            >
              Calculate & Confirm
            </button>
          </form>
        ) : !showPayment ? (
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold text-green-600">✅ Delivery Details Confirmed</h3>
            <p>From: {formData.pickupLocation} → To: {formData.deliveryLocation}</p>
            <p>Receiver: {formData.receiverName}</p>
            <p className="text-lg font-medium">Estimated Cost: KSh {estimatedCost?.toFixed(2)}</p>

            <button
              onClick={() => setShowPayment(true)}
              className="w-full bg-[#ffd700] text-black py-2 rounded-lg font-semibold hover:bg-[#ffeb3b]"
            >
              Proceed to Payment
            </button>

            <button
              onClick={resetForm}
              className="w-full mt-2 bg-gray-200 text-dark py-2 rounded-md"
            >
              Cancel
            </button>
          </div>
        ) : !paymentConfirmed ? (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-center text-[#ffd700]">💳 Choose Payment Method</h3>

            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Payment Method</option>
              <option value="mpesa">M-Pesa</option>
              <option value="card">Card</option>
            </select>

            {paymentMethod === 'mpesa' && (
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Enter M-Pesa Number
                </label>
                <input
                  type="tel"
                  value={mpesaPhone}
                  onChange={(e) => setMpesaPhone(e.target.value)}
                  placeholder="07XXXXXXXX"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className={`mt-4 w-full ${isProcessing ? 'bg-gray-400' : 'bg-[#ffd700]'} text-black py-2 rounded-lg font-semibold hover:bg-[#ffeb3b]`}
                >
                  {isProcessing ? 'Processing...' : 'Pay Now'}
                </button>
                {isProcessing && (
                  <p className="text-sm text-gray-600 mt-2">
                    Please check your phone to complete the M-Pesa payment...
                  </p>
                )}
              </div>
            )}

            {paymentMethod === 'card' && (
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Enter Card Number
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <button
                  onClick={handlePayment}
                  className="mt-4 w-full bg-[#ffd700] text-black py-2 rounded-lg font-semibold hover:bg-[#ffeb3b]"
                >
                  Pay Now
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center space-y-3">
            <h3 className="text-2xl text-green-600 font-bold">🎉 Payment Successful!</h3>
            <p className="text-gray-700">Thank you. Your parcel is being processed.</p>
            <button
              onClick={resetForm}
              className="w-full bg-[#ffd700] text-black py-2 rounded-lg font-semibold hover:bg-[#ffeb3b] mt-4"
            >
              New Delivery
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParcelDeliveryForm;