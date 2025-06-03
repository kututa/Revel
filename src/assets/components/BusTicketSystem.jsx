import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function BusTicketSystem() {
  const location = useLocation();
  const passengerDetails = location?.state;
  
  const [ticketData, setTicketData] = useState(null);

  useEffect(() => {
    if (passengerDetails) {
      // Generate ticket using state
      const ticketId = '' // e.g., to be generated later: Math.random().toString(36).substring(2, 10).toUpperCase();
      const seatNumber = passengerDetails?.seatNumbers.join(', ');
      const seatType = 'Normal'; // Set dynamically if needed

      const travelDate = new Date(passengerDetails?.travelDate).toLocaleDateString('en-KE', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
        
      });

      setTicketData({
        fullName: passengerDetails?.customerName,
        phoneNumber: passengerDetails?.customerPhone,
        ticketId, // for now keep empty, you can generate it later
        seatNumber,
        seatType,
        amount: `KSh ${passengerDetails?.amount}`,
        busName: `${passengerDetails?.bus.model} (${passengerDetails.bus.plate_number})`,
        departure: passengerDetails?.bus.from_city,
        destination: passengerDetails?.bus.to_city,
        travelDate
      });
    }
  }, [passengerDetails]);

  const printTicket = () => window.print();

  const resetForm = () => {
    setTicketData(null);
    window.history.back(); // Go back to previous screen
  };

  if (!ticketData) return <p className="text-center p-8 text-gray-600">Loading ticket details...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 bg-yellow-300">
          <h1 className="text-2xl font-bold text-center text-gray-800">Bus Ticket</h1>
        </div>

        <div className="p-6">
          <div id="ticket" className="border-2 border-gray-300 rounded-lg overflow-hidden print:border-0">
            <div className="p-4 text-center bg-yellow-400">
              <h2 className="text-xl font-bold text-gray-800">TICKET</h2>
              <p className="text-sm text-gray-700">Revel Coach</p>
            </div>

            <div className="p-4 bg-white">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-xs text-gray-500">Ticket ID</p>
                  <p className="text-sm font-semibold">{ticketData.ticketId || 'To be assigned'}</p>
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
                  <p className="text-sm">{ticketData.seatNumber} ({ticketData.seatType})</p>
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
      </div>
    </div>
  );
}
