import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './assets/components/Navbar';
import Home from './assets/components/Home';
import Footer from './assets/components/Footer';
import BusBookingForm from './assets/components/BusBookingForm.'; // Import BusBookingForm

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bus-booking" element={<BusBookingForm />} /> {/* Add the route for BusBookingForm */}
      </Routes>
      <footer>
        <Footer />
      </footer>
    </Router>
  );
}

export default App;
