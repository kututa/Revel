import express from 'express'
import executeQuery from '../utils/helper.js';

export const parcelRoutes = express.Router()


parcelRoutes.get('/parcel/sizes', async (req, res) => {
    try {
        const sizes = await executeQuery('SELECT * FROM parcel_sizes ORDER BY base_price');
        res.json(sizes);
    } catch (err) {
        
        res.status(500).json({ error: 'Failed to fetch parcel sizes' });
    }
});

parcelRoutes.post('/parcel/deliveries', async (req, res) => {
    const {
        pickupLocationId,
        deliveryLocationId,
        parcelSizeId,
        deliveryDate,
        receiverName,
        receiverPhone,
        estimatedCost
    } = req.body;

    // Validate required fields
    const requiredFields = [
        pickupLocationId, deliveryLocationId, parcelSizeId,
        deliveryDate, receiverName, receiverPhone, estimatedCost
    ];
    
    if (requiredFields.some(field => !field)) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Generate tracking number
        const trackingNumber = 'PK-' + Math.random().toString(36).substring(2, 10).toUpperCase();

        // Create delivery record
        const result = await executeQuery(`
            INSERT INTO parcel_deliveries (
                tracking_number, pickup_location_id, delivery_location_id,
                parcel_size_id, delivery_date, receiver_name, receiver_phone,
                estimated_cost
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            trackingNumber, pickupLocationId, deliveryLocationId,
            parcelSizeId, deliveryDate, receiverName, receiverPhone,
            estimatedCost
        ]);

        res.json({
            success: true,
            trackingNumber,
            deliveryId: result.insertId
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create delivery' });
    }
});

// Process payment for parcel delivery
parcelRoutes.post('/parcel/payments', async (req, res) => {
    const {
        deliveryId,
        amount,
        paymentMethod,
        paymentReference
    } = req.body;

    if (!deliveryId || !amount || !paymentMethod) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Create payment record
        await executeQuery(`
            INSERT INTO parcel_payments (
                delivery_id, amount, payment_method, payment_reference, status
            ) VALUES (?, ?, ?, ?, 'Completed')
        `, [deliveryId, amount, paymentMethod, paymentReference]);

        // Update delivery status
        await executeQuery(`
            UPDATE parcel_deliveries SET status = 'Processing' WHERE id = ?
        `, [deliveryId]);

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to process payment' });
    }
});

// Get delivery by tracking number
parcelRoutes.get('/parcel/deliveries/:trackingNumber', async (req, res) => {
    const { trackingNumber } = req.params;

    try {
        const deliveries = await executeQuery(`
            SELECT pd.*, 
                   c1.name as pickup_location, 
                   c2.name as delivery_location,
                   ps.name as parcel_size_name,
                   ps.description as parcel_size_description
            FROM parcel_deliveries pd
            JOIN cities c1 ON pd.pickup_location_id = c1.id
            JOIN cities c2 ON pd.delivery_location_id = c2.id
            JOIN parcel_sizes ps ON pd.parcel_size_id = ps.id
            WHERE pd.tracking_number = ?
        `, [trackingNumber]);

        if (!deliveries.length) {
            return res.status(404).json({ error: 'Delivery not found' });
        }

        const delivery = deliveries[0];
        
        // Get payment info if exists
        const payments = await executeQuery(`
            SELECT * FROM parcel_payments 
            WHERE delivery_id = ?
            ORDER BY payment_date DESC
            LIMIT 1
        `, [delivery.id]);

        res.json({
            ...delivery,
            payment: payments[0] || null
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch delivery' });
    }
});