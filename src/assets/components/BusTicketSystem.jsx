import { useState } from 'react';

export default function BusTicketSystem() {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: ''
  });

  const [ticketData, setTicketData] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const generateTicket = (e) => {
    e.preventDefault();

    // Randomize data
    const ticketId = Math.random().toString(36).substring(2, 10).toUpperCase();
    const seatNumber = Math.floor(Math.random() * 50) + 1;
    const seatType = Math.random() > 0.5 ? 'VIP' : 'Normal';
    const amount = seatType === 'VIP' ? 'KSh 2,000' : 'KSh 1,200';
    const busOptions = ['Dreamline Express', 'Transline Classic', 'Guardian Angel', 'Easy Coach'];
    const busName = busOptions[Math.floor(Math.random() * busOptions.length)];

    const destinations = [
      { departure: 'Nairobi', destination: 'Mombasa' },
      { departure: 'Kisumu', destination: 'Nairobi' },
      { departure: 'Eldoret', destination: 'Kisumu' },
      { departure: 'Nakuru', destination: 'Eldoret' },
      { departure: 'Meru', destination: 'Nairobi' },
      { departure: 'Thika', destination: 'Nyeri' }
    ];

    const routeInfo = destinations[Math.floor(Math.random() * destinations.length)];

    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + Math.floor(Math.random() * 30) + 1);
    const travelDate = futureDate.toLocaleDateString('en-KE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    setTicketData({
      ...formData,
      ticketId,
      seatNumber,
      seatType,
      amount,
      busName,
      departure: routeInfo.departure,
      destination: routeInfo.destination,
      travelDate
    });
  };

  const printTicket = () => {
    window.print();
  };

  const resetForm = () => {
    setFormData({ fullName: '', phoneNumber: '' });
    setTicketData(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 bg-yellow-300">
          <h1 className="text-2xl font-bold text-center text-gray-800">Bus Ticket Generator (Kenya)</h1>
        </div>

        {!ticketData ? (
          <form onSubmit={generateTicket} className="p-6">
            <div className="mb-4">
              <label htmlFor="fullName" className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. Alex Kiptoo"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="phoneNumber" className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                required
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="e.g. 0712345678"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="px-6 py-2 font-bold text-white bg-yellow-500 rounded hover:bg-yellow-600 focus:outline-none"
              >
                Generate Ticket
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6">
            <div id="ticket" className="border-2 border-gray-300 rounded-lg overflow-hidden print:border-0">
              <div className="p-4 text-center bg-yellow-400">
                <h2 className="text-xl font-bold text-gray-800">BUS TICKET</h2>
                <p className="text-sm text-gray-700">Revel Coach</p>
              </div>

              <div className="p-4 bg-white">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Ticket ID</p>
                    <p className="text-sm font-semibold">{ticketData.ticketId}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Travel Date</p>
                    <p className="text-sm font-semibold">{ticketData.travelDate}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-gray-500">Passenger</p>
                  <p className="text-base font-semibold">{ticketData.fullName}</p>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm">{ticketData.phoneNumber}</p>
                </div>

                <div className="flex mb-4">
                  <div className="w-1/2 pr-2">
                    <p className="text-xs text-gray-500">From</p>
                    <p className="text-base font-semibold">{ticketData.departure}</p>
                  </div>
                  <div className="w-1/2 pl-2">
                    <p className="text-xs text-gray-500">To</p>
                    <p className="text-base font-semibold">{ticketData.destination}</p>
                  </div>
                </div>

                <div className="flex mb-4">
                  <div className="w-1/2 pr-2">
                    <p className="text-xs text-gray-500">Bus</p>
                    <p className="text-sm">{ticketData.busName}</p>
                  </div>
                  <div className="w-1/2 pl-2">
                    <p className="text-xs text-gray-500">Seat</p>
                    <p className="text-sm">Seat {ticketData.seatNumber} ({ticketData.seatType})</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-500">Amount Paid</p>
                      <p className="text-lg font-bold">{ticketData.amount}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-1">Status</p>
                      <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded">CONFIRMED</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 text-center text-xs text-gray-600 bg-yellow-200">
                <p>Arrive 30 minutes before departure. Ticket is non-refundable.</p>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button onClick={resetForm} className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100">
                New Ticket
              </button>
              <button
                onClick={printTicket}
                className="px-4 py-2 font-bold text-white bg-yellow-500 rounded hover:bg-yellow-600"
              >
                Print Ticket
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
