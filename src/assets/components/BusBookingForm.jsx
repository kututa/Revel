import React, { useState } from 'react';

const BusBookingForm = () => {
  // Cities data
  const cities = [
    'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Meru'
  ];

  // Sample bus data
  const busData = [
    { id: 1, name: 'Express Morning', from: 'Nairobi', to: 'Mombasa', price: 1200, time: '07:00 AM', duration: '8h', availableSeats: [1, 2, 4, 5, 7, 8, 10, 11, 13, 14, 16, 17, 19, 20, 22, 23, 25, 26, 28, 29, 31, 32, 34, 35] },
    { id: 2, name: 'Coastal Rider', from: 'Nairobi', to: 'Mombasa', price: 1500, time: '09:30 AM', duration: '7h 30m', availableSeats: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35] },
    { id: 3, name: 'Night Traveler', from: 'Nairobi', to: 'Mombasa', price: 1000, time: '08:00 PM', duration: '8h', availableSeats: [2, 3, 6, 7, 10, 11, 14, 15, 18, 19, 22, 23, 26, 27, 30, 31, 34, 35] },
    { id: 4, name: 'Lake Express', from: 'Nairobi', to: 'Kisumu', price: 800, time: '10:00 AM', duration: '6h', availableSeats: [1, 2, 3, 4, 9, 10, 11, 12, 17, 18, 19, 20, 25, 26, 27, 28, 33, 34, 35, 36] },
    { id: 5, name: 'Highland Shuttle', from: 'Nakuru', to: 'Eldoret', price: 600, time: '11:30 AM', duration: '3h', availableSeats: [1, 2, 5, 6, 9, 10, 13, 14, 17, 18, 21, 22, 25, 26, 29, 30, 33, 34] },
  ];

  // Form states
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookingComplete, setBookingComplete] = useState(false);

  // Filtered buses based on selection
  const availableBuses = busData.filter(
    bus => bus.from === from && bus.to === to
  );

  // Handle search button click
  const handleSearch = (e) => {
    e.preventDefault();
    if (from && to && date) {
      setFormSubmitted(true);
      setSelectedBus(null);
      setSelectedSeats([]);
      setBookingComplete(false);
    }
  };

  // Handle bus selection
  const handleBusSelect = (bus) => {
    setSelectedBus(bus);
    setSelectedSeats([]);
  };

  // Handle seat selection
  const handleSeatSelect = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(seat => seat !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  // Handle proceed button click
  const handleProceed = () => {
    if (selectedSeats.length > 0) {
      setBookingComplete(true);
    }
  };

  // Calculate total price
  const totalPrice = selectedBus ? selectedBus.price * selectedSeats.length : 0;

  // Format today's date for min attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Revel Coach Booking</h1>
        
        {!bookingComplete ? (
          <div>
            {/* Booking Form */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6" style={{ backgroundColor: '#fffde7' }}>
              <h2 className="text-xl font-semibold mb-4">Plan Your Journey</h2>
              <form onSubmit={handleSearch}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 mb-2">From</label>
                    <select 
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                      required
                    >
                      <option value="">Select departure</option>
                      {cities.map((city) => (
                        <option key={`from-${city}`} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">To</label>
                    <select 
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      required
                    >
                      <option value="">Select destination</option>
                      {cities.map((city) => (
                        <option key={`to-${city}`} value={city} disabled={city === from}>{city}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">Travel Date</label>
                    <input 
                      type="date" 
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
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
            
            {/* Bus Results */}
            {formSubmitted && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Available Buses</h2>
                
                {availableBuses.length > 0 ? (
                  <div className="space-y-4">
                    {availableBuses.map((bus) => (
                      <div 
                        key={bus.id} 
                        className={`p-4 border rounded cursor-pointer transition duration-300 ${selectedBus && selectedBus.id === bus.id ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200 hover:border-yellow-400'}`}
                        onClick={() => handleBusSelect(bus)}
                      >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                          <div>
                            <h3 className="font-bold text-lg">{bus.name}</h3>
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
            )}
            
            {/* Seat Selection */}
            {selectedBus && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Select Your Seats</h2>
                <p className="mb-4">Bus: <span className="font-medium">{selectedBus.name}</span> • {selectedBus.time} • {selectedBus.duration}</p>
                
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
                    {Array.from({ length: 36 }, (_, i) => i + 1).map((seat) => {
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
                      <p className="text-sm text-gray-600">Seats: {selectedSeats.sort((a, b) => a - b).join(', ')}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xl font-bold mb-2">Total: KSh {totalPrice}</p>
                    <button 
                      className={`px-6 py-3 font-bold rounded transition duration-300 ${
                        selectedSeats.length > 0 ? 'bg-yellow-400 text-gray-800 hover:bg-yellow-500' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      style={selectedSeats.length > 0 ? { backgroundColor: '#ffd700' } : {}}
                      onClick={handleProceed}
                      disabled={selectedSeats.length === 0}
                    >
                      Proceed to Payment
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 text-center" style={{ backgroundColor: '#fffde7' }}>
            <div className="p-8">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-4">Booking Successful!</h2>
              <p className="mb-6">Your booking for <span className="font-medium">{selectedBus.name}</span> on <span className="font-medium">{new Date(date).toDateString()}</span> is confirmed.</p>
              <div className="bg-gray-100 p-4 rounded-lg max-w-md mx-auto text-left">
                <p className="font-bold mb-2">Booking Details:</p>
                <p>Journey: {selectedBus.from} to {selectedBus.to}</p>
                <p>Date: {new Date(date).toDateString()}</p>
                <p>Bus: {selectedBus.name} ({selectedBus.time})</p>
                <p>Seats: {selectedSeats.sort((a, b) => a - b).join(', ')}</p>
                <p>Total Amount: KSh {totalPrice}</p>
              </div>
              <button 
                className="mt-6 px-6 py-3 bg-yellow-400 text-gray-800 font-bold rounded hover:bg-yellow-500 transition duration-300"
                style={{ backgroundColor: '#ffd700' }}
                onClick={() => {
                  setFormSubmitted(false);
                  setSelectedBus(null);
                  setSelectedSeats([]);
                  setBookingComplete(false);
                  setFrom('');
                  setTo('');
                  setDate('');
                }}
              >
                Book Another Trip
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusBookingForm;