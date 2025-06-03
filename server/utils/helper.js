import { pool } from "../config/database.js";
import express from 'express'
export const initRoutes = express.Router()
import { buses } from "./dummy.js";


// Initialize database with sample data (for development)
initRoutes.post('/init', async (req, res) => {
    if (process.env.NODE_ENV === 'production') {
        return res.status(403).json({ error: 'Not allowed in production' });
    }

    try {
        
        await executeQuery('DELETE FROM booking_seats');
        await executeQuery('DELETE FROM bookings');
        await executeQuery('DELETE FROM seats');
        await executeQuery('DELETE FROM buses');
       await executeQuery('DELETE FROM cities');

     

        // Insert cities
        const cities = ['Nairobi','Mombasa','Kisumu','Nakuru', 'Eldoret', 'Thika', 'Meru'];
        for (const city of cities) {
            await executeQuery('INSERT INTO cities (name) VALUES (?)', [city]);
        }

        // Get city IDs
        const cityIds = {};
        const cityRecords = await executeQuery('SELECT id, name FROM cities');
        for (const record of cityRecords) {
         cityIds[record.name] = record.id;
        //  console.log(cityIds)   
        }

        

         // Insert buses
       
        for (const bus of buses) {
            const result = await executeQuery(`
                INSERT INTO buses 
                (plate_number, model, from_city_id, to_city_id, price, departure_time, duration, total_seats)
                VALUES (?, ?, ?, ?, ?, ?, ?,?)
            `, [
                bus.plateNumber, 
                bus.model,
                cityIds[bus.from], 
                cityIds[bus.to], 
                bus.price, 
                bus.time, 
                bus.duration,
                bus.totalSeats
            ]);
            
            const busId = result.insertId;
            
            // Insert seats (some available, some not)
            for (let i = 1; i <= bus.totalSeats; i++) {
                let isAvailable = true;
                
                // Make some seats unavailable for realism
                if (Math.random() > 0.7) {
                    isAvailable = false;
                }
                
                await executeQuery(`
                    INSERT INTO seats (bus_id, seat_number, is_available)
                    VALUES (?, ?, ?)
                `, [busId, i, isAvailable]);
            }
        }

        res.json({ success: true, message: 'Database initialized with sample data' });
    } catch (err) {
        console.error('Initialization error:', err);
        res.status(500).json({ error: 'Failed to initialize database' });
    }
});






async function executeQuery(query, params = []) {
    let conn;
    try {
        conn = await pool.getConnection();
         await conn.query('USE bus_booking;');
        const result = await conn.query(query, params);
        return result;
    } catch (err) {
        console.error('Database error:', err);
        throw err;
    } finally {
        if (conn) conn.release();
    }
}











export default executeQuery