import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-dark">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l-4-4m4 4l4-4" />
                </svg>
              </div>
              <span className="font-bold text-xl text-dark">Revel <span className="text-primary">Coach</span></span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
          <Link to="/bus-booking" className="px-3 py-2 text-sm font-medium text-dark hover:text-primary transition-colors duration-200">Bus Tickets</Link>
          <Link to="/parcel-service" className="px-3 py-2 text-sm font-medium text-dark hover:text-primary transition-colors duration-200">Parcel Service</Link>
            <Link to="/print-ticket" className="px-3 py-2 text-sm font-medium text-dark hover:text-primary transition-colors duration-200">Print Ticket</Link>
            <Link to="/login" className="px-4 py-2 text-sm font-medium text-dark bg-primary rounded-md hover:bg-secondary transition-colors duration-200">Login</Link>
          </div>
          
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-dark hover:text-primary focus:outline-none"
            >
              <svg 
                className={`h-6 w-6 ${isMenuOpen ? 'hidden' : 'block'}`} 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg 
                className={`h-6 w-6 ${isMenuOpen ? 'block' : 'hidden'}`} 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-light">
          <Link 
            to="/bus-booking" 
            className="block px-3 py-2 rounded-md text-base font-medium text-dark hover:bg-primary hover:text-dark"
            onClick={() => setIsMenuOpen(false)}
          >
            Bus Tickets
          </Link>
          <Link 
            to="/parcel-service" 
            className="block px-3 py-2 rounded-md text-base font-medium text-dark hover:bg-primary hover:text-dark"
            onClick={() => setIsMenuOpen(false)}
          >
            Parcel Service
          </Link>
          <Link 
            to="/tracking" 
            className="block px-3 py-2 rounded-md text-base font-medium text-dark hover:bg-primary hover:text-dark"
            onClick={() => setIsMenuOpen(false)}
          >
            Track
          </Link>
          <Link 
            to="/login" 
            className="block px-3 py-2 rounded-md text-base font-medium text-dark hover:bg-primary hover:text-dark"
            onClick={() => setIsMenuOpen(false)}
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;