import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BusBookingForm = ({ cities }) => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];

  // Form state
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    date: today
  });
  
  // Booking process state
  const [busData, setBusData] = useState(null);
  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [passengerDetails, setPassengerDetails] = useState({
    name: '',
    phone: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('');
  const [bookingStatus, setBookingStatus] = useState('search'); // search | select | details | payment | complete

  // Filter available buses
  const availableBuses = busData?.filter(
    bus => bus.from_city === searchParams.from && 
           bus.to_city === searchParams.to
  );

  // Calculate total price
  const totalPrice = selectedBus ? selectedBus.price * selectedSeats.length : 0;

  // Handle search submission
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchParams.from || !searchParams.to || !searchParams.date) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/buses?from=${searchParams.from}&to=${searchParams.to}&date=${searchParams.date}`
      );
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const result = await response.json();


   
      setBusData(result);
      setBookingStatus('select');
    } catch (error) {
      console.error("Error fetching buses:", error);
    }
  };

  // Handle bus selection
  const handleBusSelect = (bus) => {
    setSelectedBus(bus);
    setSelectedSeats([]);
  };

  // Handle seat selection
  const handleSeatSelect = (seatNumber) => {
    setSelectedSeats(prev => 
      prev.includes(seatNumber) 
        ? prev.filter(seat => seat !== seatNumber)
        : [...prev, seatNumber]
    );
  };

  // Handle passenger details submission
  const handlePassengerDetails = (e) => {
    e.preventDefault();
    if (passengerDetails.name && passengerDetails.phone) {
      setBookingStatus('payment');
    }
  };
  const formatPhoneNumber = (phone) => {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Convert local format to international format
  if (digits.startsWith('0')) {
    return `254${digits.substring(1)}`;
  }
  // If already starts with 254, return as-is
  if (digits.startsWith('254')) {
    return digits;
  }
  // For numbers without 0 prefix (e.g., landlines)
  return `254${digits}`;
};

  // Handle payment submission
  const handlePayment = async () => {
     const formattedPhone = formatPhoneNumber(passengerDetails.phone);
    try {
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          busId: selectedBus.id,
          paymentMethod,
          seatNumbers: selectedSeats,
          customerPhone: formattedPhone,
          customerName: passengerDetails.name,
          travelDate: searchParams.date,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Payment failed: ${errorData?.message || response.statusText}`);
      }

      const result = await response.json();
            const bookingDetails = {
  seatNumbers: selectedSeats,
  customerPhone: formattedPhone,
  customerName: passengerDetails.name,
  travelDate: searchParams.date,
  amount:result.totalAmount,
  bus:selectedBus,
};
      
      setBookingStatus('complete');
      navigate('/print-ticket', { state: bookingDetails });
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  // Reset form
  const resetForm = () => {
    setSearchParams({ from: '', to: '', date: today });
    setBusData(null);
    setSelectedBus(null);
    setSelectedSeats([]);
    setPassengerDetails({ name: '', phone: '' });
    setPaymentMethod('');
    setBookingStatus('search');
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4" style={{ backgroundColor: '#FFFFC5' }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Revel Coach Booking</h1>
        
        {/* Search Form */}
        {bookingStatus === 'search' && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6" style={{ backgroundColor: '#fffde7' }}>
            <h2 className="text-xl font-semibold mb-4">Plan Your Journey</h2>
            <form onSubmit={handleSearch}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 mb-2">From</label>
                  <select
                    name="from"
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    value={searchParams.from}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select departure</option>
                    {cities?.map((city) => (
                      <option key={`from-${city.id}`} value={city.name}>{city.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">To</label>
                  <select
                    name="to"
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    value={searchParams.to}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select destination</option>
                    {cities?.map((city) => (
                      <option key={`to-${city.id}`} value={city.name} disabled={city.name === searchParams.from}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Travel Date</label>
                  <input
                    type="date"
                    name="date"
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    value={searchParams.date}
                    onChange={handleInputChange}
                    min={today}
                    required
                  />
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full md:w-auto px-6 py-3 bg-yellow-400 text-gray-800 font-bold rounded hover:bg-yellow-500 transition duration-300"
                style={{ backgroundColor: '#ffd700' }}
              >
                Search Buses
              </button>
            </form>
          </div>
        )}

        {/* Bus Selection */}
        {bookingStatus === 'select' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Available Buses</h2>
              
              {availableBuses?.length > 0 ? (
                <div className="space-y-4">
                  {availableBuses.map((bus) => (
                    <div
                      key={bus.id}
                      className={`p-4 border rounded cursor-pointer transition duration-300 ${
                        selectedBus?.id === bus.id ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200 hover:border-yellow-400'
                      }`}
                      onClick={() => handleBusSelect(bus)}
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div>
                          <h3 className="font-bold text-lg">{bus.model}</h3>
                          <p className="text-gray-600">{bus.time} • {bus.duration}</p>
                        </div>
                        <div className="mt-2 md:mt-0">
                          <span className="text-xl font-bold">KSh {bus.price}</span>
                          <p className="text-sm text-gray-500">{bus.availableSeats.length} seats available</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-4 text-gray-600">No buses available for the selected route</p>
              )}
            </div>

            {selectedBus && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Select Your Seats</h2>
                <p className="mb-4">Bus: <span className="font-medium">{selectedBus.model}</span> • {selectedBus.time} • {selectedBus.duration}</p>
                
                <div className="mb-6">
                  <div className="flex justify-center mb-4 gap-4">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
                      <span>Available</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-gray-400 rounded mr-2"></div>
                      <span>Booked</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-yellow-400 rounded mr-2"></div>
                      <span>Selected</span>
                    </div>
                  </div>
                  
                  <div className="border-b-8 border-gray-700 w-full mb-8 rounded"></div>
                  
                  <div className="grid grid-cols-4 gap-3 max-w-md mx-auto mb-8">
                    {Array.from({ length: selectedBus.total_seats }, (_, i) => i + 1).map((seat) => {
                      const isAvailable = selectedBus.availableSeats.includes(seat);
                      const isSelected = selectedSeats.includes(seat);
                      
                      return (
                        <div
                          key={seat}
                          className={`h-12 flex items-center justify-center rounded cursor-pointer ${
                            isSelected ? 'bg-yellow-400 text-gray-800 font-bold' :
                            isAvailable ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-400 cursor-not-allowed'
                          }`}
                          onClick={() => isAvailable && handleSeatSelect(seat)}
                        >
                          {seat}
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                  <div>
                    <p className="text-lg">Selected: <span className="font-medium">{selectedSeats.length} seat(s)</span></p>
                    {selectedSeats.length > 0 && (
                      <p className="text-sm text-gray-600">Seats Number: {selectedSeats.sort((a, b) => a - b).join(', ')}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xl font-bold mb-2">Total: KSh {totalPrice}</p>
                    <button
                      className={`px-6 py-3 font-bold rounded transition duration-300 ${
                        selectedSeats.length > 0 ? 'bg-yellow-400 text-gray-800 hover:bg-yellow-500' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      style={selectedSeats.length > 0 ? { backgroundColor: '#ffd700' } : {}}
                      onClick={() => setBookingStatus('details')}
                      disabled={selectedSeats.length === 0}
                    >
                      Continue to Passenger Details
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Passenger Details */}
        {bookingStatus === 'details' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Passenger Information</h2>
            <form onSubmit={handlePassengerDetails}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    value={passengerDetails.name}
                    onChange={(e) => setPassengerDetails({...passengerDetails, name: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Phone Number</label>
  <input
    type="tel"
    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
    value={passengerDetails.phone}
    onChange={(e) => {
      // Basic validation - only allow numbers
      const value = e.target.value.replace(/[^0-9]/g, '');
      setPassengerDetails({...passengerDetails, phone: value});
    }}
    placeholder="07XXXXXXXX or 011XXXXXXX"
    pattern="[0-9]{9,12}"
    minLength="9"
    maxLength="12"
    required
  />
                </div>
              </div>
              
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setBookingStatus('select')}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-yellow-400 text-gray-800 font-bold rounded hover:bg-yellow-500"
                  style={{ backgroundColor: '#ffd700' }}
                >
                  Proceed to Payment
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Payment Section */}
        {bookingStatus === 'payment' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
            
            <div className="mb-6">
              <h3 className="font-medium mb-2">Trip Summary</h3>
              <div className="bg-gray-50 p-4 rounded">
                <p><span className="font-medium">Route:</span> {selectedBus.from_city} to {selectedBus.to_city}</p>
                <p><span className="font-medium">Bus:</span> {selectedBus.model} ({selectedBus.time})</p>
                <p><span className="font-medium">Seats:</span> {selectedSeats.sort((a, b) => a - b).join(', ')}</p>
                <p className="text-lg font-bold mt-2">Total: KSh {totalPrice}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Payment Method</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  required
                >
                  <option value="">Select Payment Method</option>
                  <option value="mpesa">M-Pesa</option>
                  <option value="card">Credit/Debit Card</option>
                </select>
              </div>
              
              {paymentMethod === 'mpesa' && (
                <div>
                  {passengerDetails.phone && (
    <p className="text-sm text-gray-500 mt-1">
      Will be sent as: {formatPhoneNumber(passengerDetails.phone)}
    </p>
  )}
                </div>
              )}
              
              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setBookingStatus('details')}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                  Back
                </button>
                <button
                  onClick={handlePayment}
                  className="px-6 py-3 bg-yellow-400 text-gray-800 font-bold rounded hover:bg-yellow-500"
                  style={{ backgroundColor: '#ffd700' }}
                  disabled={!paymentMethod}
                >
                  Confirm Payment
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Booking Complete */}
        {bookingStatus === 'complete' && (
          <div className="text-center space-y-4 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-2xl text-green-600 font-bold">🎉 Booking Confirmed!</h3>
            <p className="text-gray-700">Thank you for booking with Revel Coach</p>
            <p className="text-sm text-gray-500">Your ticket has been sent to {passengerDetails.phone}</p>
            
            <button
              onClick={resetForm}
              className="w-full mt-6 bg-yellow-400 text-gray-800 py-2 rounded-lg font-semibold hover:bg-yellow-500"
              style={{ backgroundColor: '#ffd700' }}
            >
              Make Another Booking
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusBookingForm;