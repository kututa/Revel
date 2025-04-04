import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './assets/components/Navbar';
import HomePage from './assets/components/Homepage';  
import Footer from './assets/components/Footer';

function App() {
  return (
    <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
          <footer>
            <Footer />
          </footer>
    </Router>
  );
}

export default App;