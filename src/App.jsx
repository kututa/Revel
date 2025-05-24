import React,{useEffect,useState} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './assets/components/Navbar';
import Home from './assets/components/Home';
import Footer from './assets/components/Footer';
import BusBookingForm from './assets/components/BusBookingForm';
import ParcelDeliveryForm from './assets/components/ParcelDeliveryForm';
import BusTicketSystem from './assets/components/BusTicketSystem'; // ✅ Import the ticket component

function App() {
const [cities,setCities]=useState(null)

 useEffect(()=>{
const getAllCities = async ()=> {
  try {
    
const response = await fetch('http://localhost:5000/api/cities')
if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json()
        
        setCities(result)

  } catch (error) {
    console.log(error)
    
  }


}
getAllCities()


 },[])




  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bus-booking" element={<BusBookingForm  cities={cities}/>} />
        <Route path="/parcel-service" element={<ParcelDeliveryForm cities={cities}/>} />
        <Route path="/print-ticket" element={<BusTicketSystem />} /> {/* ✅ Ticket route */}
      </Routes>
      <footer>
        <Footer />
      </footer>
    </Router>
  );
}

export default App;
