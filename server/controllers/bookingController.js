import express  from 'express'
import { pool } from "../config/database.js";
import executeQuery from '../utils/helper.js';



export const bookingRoutes = express.Router()



// API Routes

// 1. Get all cities
bookingRoutes.get('/cities', async (req, res) => {
    try {
        const cities = await executeQuery('SELECT * FROM cities ORDER BY name');
        res.json(cities);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch cities' });
    }
});

// 2. Get available buses for a route
bookingRoutes.get('/buses', async (req, res) => {
    const { from, to, date } = req.query;
    
    if (!from || !to || !date) {
        return res.status(400).json({ error: 'Missing required parameters: from, to, date' });
    }

    try {
        // First check if cities exist
        const fromCity = await executeQuery('SELECT id FROM cities WHERE name = ?', [from]);
       
        const toCity = await executeQuery('SELECT id FROM cities WHERE name = ?', [to]);
       
        if (!fromCity.length || !toCity.length) {
            return res.status(404).json({ error: 'Invalid city names' });
        }

        // Get buses for the route
        const buses = await executeQuery(`
            SELECT b.id, b.plate_number ,b.model, c1.name as from_city, c2.name as to_city, 
                   b.price, TIME_FORMAT(b.departure_time, '%h:%i %p') as time, 
                   b.duration, b.total_seats
            FROM buses b
            JOIN cities c1 ON b.from_city_id = c1.id
            JOIN cities c2 ON b.to_city_id = c2.id
            WHERE b.from_city_id = ? AND b.to_city_id = ?
        `, [fromCity[0].id, toCity[0].id]);

        // For each bus, get available seats
        const busesWithSeats = await Promise.all(buses.map(async bus => {
            const availableSeats = await executeQuery(`
                SELECT seat_number 
                FROM seats 
                WHERE bus_id = ? AND is_available = TRUE
            `, [bus.id]);
            
            return {
                ...bus,
                availableSeats: availableSeats.map(s => s.seat_number)
            };
        }));

        res.json(busesWithSeats);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch buses' });
    }
});

// 3. Select seats (check availability)
bookingRoutes.post('/seats/check', async (req, res) => {
    const { busId, seatNumbers } = req.body;
    
    if (!busId || !seatNumbers || !Array.isArray(seatNumbers)) {
        return res.status(400).json({ error: 'Missing required parameters: busId, seatNumbers' });
    }

    try {
        // Check if all seats are available
        const placeholders = seatNumbers.map(() => '?').join(',');
        const query = `
            SELECT COUNT(*) as unavailable 
            FROM seats 
            WHERE bus_id = ? AND seat_number IN (${placeholders}) AND is_available = FALSE
        `;
        
        const result = await executeQuery(query, [busId, ...seatNumbers]);
        
        if (result[0].unavailable > 0) {
            return res.status(409).json({ error: 'Some seats are no longer available' });
        }
        
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to check seat availability' });
    }
});

// 4. Create booking
bookingRoutes.post('/bookings', async (req, res) => {
    const { busId, seatNumbers, travelDate, customerPhone, paymentMethod } = req.body;
    
    if (!busId || !seatNumbers || !travelDate || !paymentMethod) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Start transaction
    let conn;
    try {
        conn = await pool.getConnection();
         await conn.query('USE bus_booking;');
        await conn.beginTransaction();

        // 1. Get bus price
        const bus = await conn.query('SELECT price FROM buses WHERE id = ?', [busId]);
        if (!bus.length) {
            throw new Error('Bus not found');
        }
        
        const totalAmount = bus[0].price * seatNumbers.length;

        // 2. Create booking record
        const bookingResult = await conn.query(`
            INSERT INTO bookings 
            (bus_id, travel_date, customer_phone, payment_method, total_amount)
            VALUES (?, ?, ?, ?, ?)
        `, [busId, travelDate, customerPhone, paymentMethod, totalAmount]);
        
        const bookingId = bookingResult.insertId;

        // 3. Mark seats as unavailable and add to booking
        for (const seatNumber of seatNumbers) {
            // Check if seat is still available
            const seat = await conn.query(`
                SELECT is_available FROM seats 
                WHERE bus_id = ? AND seat_number = ? FOR UPDATE
            `, [busId, seatNumber]);
            
            if (!seat.length || !seat[0].is_available) {
                throw new Error(`Seat ${seatNumber} is no longer available`);
            }

            // Mark as unavailable
            await conn.query(`
                UPDATE seats SET is_available = FALSE 
                WHERE bus_id = ? AND seat_number = ?
            `, [busId, seatNumber]);
            
            // Add to booking_seats
            await conn.query(`
                INSERT INTO booking_seats (booking_id, seat_number)
                VALUES (?, ?)
            `, [bookingId, seatNumber]);
        }

        await conn.commit();
        
        // Generate payment reference (simplified)
        const paymentReference = `PAY-${Date.now()}`;
        
        res.json({ 
            success: true,
            bookingId:Number(bookingId),
            totalAmount,
            paymentReference
        });
    } catch (err) {
        if (conn) await conn.rollback();
        console.error('Booking error:', err);
        res.status(500).json({ error: err.message || 'Failed to create booking' });
    } finally {
        if (conn) conn.release();
    }
});

// 5. Confirm payment
bookingRoutes.post('/payments/confirm', async (req, res) => {
    const { bookingId, paymentReference } = req.body;
    
    if (!bookingId || !paymentReference) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    try {
        // In a real bookingRoutes, you would verify the payment with the payment provider
        // Here we just update the booking with the payment reference
        await executeQuery(`
            UPDATE bookings 
            SET payment_reference = ? 
            WHERE id = ?
        `, [paymentReference, bookingId]);
        
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to confirm payment' });
    }
});


