import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const features = [
    {
      title: "Online Bus Booking",
      description: "Book bus tickets from the comfort of your home and choose your preferred seats.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-12 md:w-12 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      title: "Parcel Delivery",
      description: "Send parcels to your loved ones with our secure and reliable delivery service.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-12 md:w-12 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    },
    {
      title: "Real-time Tracking",
      description: "Track your parcels and know exactly when they will arrive at their destination.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-12 md:w-12 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      )
    },
    {
      title: "Secure Payments",
      description: "Pay securely using M-Pesa or credit/debit cards for all our services.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-12 md:w-12 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#dadce3' }}>
      {/* Hero Section - Improved responsiveness */}
      <div className="relative bg-gray-900 overflow-hidden pt-16">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-gray-900 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <svg
              className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-gray-900 transform translate-x-1/2"
              fill="currentColor"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <polygon points="50,0 100,0 50,100 0,100" />
            </svg>

            <div className="pt-6 sm:pt-10 lg:pt-8 xl:pt-16">
              <div className="px-4 sm:px-6 lg:px-8">
                <div className="text-center lg:text-left">
                  <h1 className="text-3xl tracking-tight font-extrabold text-white sm:text-4xl md:text-5xl lg:text-6xl">
                    <span className="block">Travel with</span>
                    <span className="block" style={{ color: '#ffd700' }}>Comfort and Style</span>
                  </h1>
                  <p className="mt-3 text-sm text-gray-300 sm:mt-5 sm:text-base md:text-lg lg:text-xl sm:max-w-xl sm:mx-auto md:mt-5 lg:mx-0">
                    Book your bus tickets and send parcels with Revel's online booking system. 
                    Enjoy hassle-free travel and reliable delivery services.
                  </p>
                  <div className="mt-5 sm:mt-8 flex flex-col sm:flex-row justify-center lg:justify-start space-y-3 sm:space-y-0 sm:space-x-3">
                    <div className="rounded-md shadow">
                      <Link
                        to="/bus-booking"
                        className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-black hover:bg-yellow-300 transition-colors duration-300"
                        style={{ backgroundColor: '#ffd700' }}
                      >
                        Book Bus Ticket
                      </Link>
                    </div>
                    <div>
                      <Link
                        to="/parcel-service"
                        className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md bg-gray-800 hover:bg-gray-700 transition-colors duration-300"
                        style={{ color: '#ffd700' }}
                      >
                        Send Parcel
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-48 w-full object-cover sm:h-56 md:h-72 lg:w-full lg:h-full"
            src="https://plus.unsplash.com/premium_photo-1716999429943-f3c7c89267e2?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Luxury bus travel"
          />
        </div>
      </div>

      {/* Features Section - Responsive grid */}
      <div className="py-8 sm:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold tracking-wide uppercase" style={{ color: '#ffd700' }}>Our Services</h2>
            <p className="mt-2 text-2xl sm:text-3xl leading-8 font-extrabold tracking-tight text-gray-900 md:text-4xl">
              Everything you need for comfortable travel
            </p>
            <p className="mt-4 max-w-2xl text-lg text-gray-500 mx-auto">
              Revel Travel provides comprehensive travel and delivery solutions designed to make your journey smooth and stress-free.
            </p>
          </div>

          <div className="mt-8 sm:mt-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="relative p-4 sm:p-6 border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 bg-white group hover:border-yellow-400 transform hover:-translate-y-1"
                >
                  <div className="absolute top-0 left-0 w-full h-1 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" 
                       style={{ backgroundColor: '#ffd700' }}></div>
                  <div>
                    <div className="flex items-center justify-center h-16 w-16 sm:h-20 sm:w-20 rounded-full mx-auto" 
                         style={{ backgroundColor: 'rgba(255, 235, 59, 0.2)' }} >
                      {feature.icon}
                    </div>
                    <h3 className="mt-3 sm:mt-4 text-center text-base sm:text-lg font-medium text-gray-900">{feature.title}</h3>
                    <p className="mt-2 text-center text-sm sm:text-base text-gray-500">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action - Responsive button layout */}
      <div style={{ backgroundColor: '#ffeb3b' }}>
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 sm:py-12 lg:py-16 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl text-center lg:text-left">
              <span className="block">Ready to get started?</span>
              <span className="block">Book your first trip today.</span>
            </h2>
            <div className="mt-6 flex flex-col sm:flex-row justify-center lg:justify-end lg:mt-0 space-y-3 sm:space-y-0 sm:space-x-3">
              <div className="rounded-md shadow">
                <Link
                  to="/bus-booking"
                  className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-black bg-gray-900 hover:bg-gray-800 transition-colors duration-300"
                  style={{ color: '#ffd700' }}
                >
                  Book Now
                </Link>
              </div>
              <div className="rounded-md shadow">
                <Link
                  to="/tracking"
                  className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md bg-white hover:bg-gray-50 transition-colors duration-300"
                  style={{ color: '#ffd700', borderColor: '#ffd700' }}
                >
                  Track Parcel
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;