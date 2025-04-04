import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="text-center sm:text-left mb-6 sm:mb-0">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-yellow-500">Revel Coach</h2>
            <p className="mt-1 sm:mt-2 text-sm text-gray-400">Your journey, our passion.</p>
          </div>

          <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row sm:space-x-6 text-center sm:text-right">
            {/* Added proper spacing for mobile layout */}
            <a href="https://facebook.com" className="text-yellow-500 hover:text-yellow-400 transition duration-300 mb-3 sm:mb-0">Facebook</a>
            <a href="https://twitter.com" className="text-yellow-500 hover:text-yellow-400 transition duration-300 mb-3 sm:mb-0">Twitter</a>
            <a href="https://instagram.com" className="text-yellow-500 hover:text-yellow-400 transition duration-300 mb-3 sm:mb-0">Instagram</a>
            <a href="https://linkedin.com" className="text-yellow-500 hover:text-yellow-400 transition duration-300">LinkedIn</a>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 border-t border-gray-600 pt-4 sm:pt-6 text-center">
          <p className="text-xs sm:text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Revel Travel. All rights reserved.
          </p>
          <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row justify-center sm:space-x-6 space-y-3 sm:space-y-0">
            <a href="/privacy-policy" className="text-yellow-500 hover:text-yellow-400 transition duration-300">Privacy Policy</a>
            <a href="/terms" className="text-yellow-500 hover:text-yellow-400 transition duration-300">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;