import React, { useState } from 'react';

const ParcelDeliveryForm = () => {
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

  const locations = ['Nairobi', 'Mombasa', 'Kisumu', 'Eldoret', 'Nakuru'];
  const sizes = ['Small (up to 1 kg)', 'Medium (1-3 kg)', 'Large (3-5 kg)'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateCost = () => {
    const sizeFactors = { 'Small (up to 1 kg)': 200, 'Medium (1-3 kg)': 350, 'Large (3-5 kg)': 500 };
    const distanceFactor = Math.abs(
      locations.indexOf(formData.pickupLocation) -
      locations.indexOf(formData.deliveryLocation)
    ) || 1;

    const baseCost = sizeFactors[formData.parcelSize] || 200;
    const totalCost = baseCost * distanceFactor;
    setEstimatedCost(totalCost);
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

  const handlePayment = () => {
    if (paymentMethod) {
      setTimeout(() => {
        setPaymentConfirmed(true);
      }, 1500);
    } else {
      alert('Please select a payment method');
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
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-100  p-4 sm:p-8 flex items-center justify-center"
      style={{ backgroundColor: '#FFFFC5' }}
    >
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-[#ffd700] mb-6">
          🚚 Parcel Delivery Form
        </h2>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            {[{ name: 'pickupLocation', label: 'Pickup Location', options: locations },
              { name: 'deliveryLocation', label: 'Delivery Location', options: locations },
              { name: 'parcelSize', label: 'Parcel Size', options: sizes }
            ].map(({ name, label, options }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <select
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffd700]"
                >
                  <option value="">Select {label.toLowerCase()}</option>
                  {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
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
            <p className="text-lg font-medium">Estimated Cost: KSh {estimatedCost.toFixed(2)}</p>

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

            {paymentMethod && (
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  {paymentMethod === 'mpesa' ? 'Enter M-Pesa Number' : 'Enter Card Number'}
                </label>
                <input
                  type="text"
                  placeholder={paymentMethod === 'mpesa' ? '07XXXXXXXX' : '1234 5678 9012 3456'}
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
