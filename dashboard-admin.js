// dashboard-admin.js

const express = require('express');
const router = express.Router();
const middleware = require('./middleware');
const db = require('./databaseconnect');

// Admin Dashboard
router.get('/', middleware.authenticateAdmin, async (req, res) => {
    try {
        // Fetch all service history for admins
        const serviceRows = await db.promise().query('SELECT services.*, cars.plate_number FROM services JOIN cars ON services.car_id = cars.id');

        // Extract service history or default to an empty array
        const serviceHistory = serviceRows?.[0] ?? [];

        // Pass the isAdmin variable when rendering the template
        res.render('dashboard-admin.ejs', { serviceHistory, isAdmin: true, successMessage: null });
    } catch (err) {
        console.error('Error fetching service history for admin dashboard:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Handle the addition of a new service with parts
router.post('/add-service', middleware.authenticateAdmin, async (req, res) => {
    try {
        // Extract necessary information from the request body
        const { licensePlate, serviceDate, odometer, description, totalCost, paid, outstanding, parts, labor } = req.body;

        // Fetch the car ID based on the license plate
        const [carRows] = await db.promise().query('SELECT id FROM cars WHERE plate_number = ?', [licensePlate]);
        const carId = carRows[0]?.id;

        if (!carId) {
            // Car not found
            return res.status(404).send('Car not found');
        }

        // Insert the new service into the services table
        const [insertedService] = await db.promise().query(
            'INSERT INTO services (car_id, service_date, odometer, description, total_cost, paid, outstanding, labor) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [carId, serviceDate, odometer, description, totalCost, paid, outstanding, labor]
        );

        const serviceId = insertedService.insertId;

        // Insert parts into the Parts table if they don't already exist
        if (Array.isArray(parts) && parts.length > 0) {
            // Process parts data and build an array of objects with part_name and part_price
            const partValues = parts.map((part, index) => [part, req.body.partPrices[index]]);

            // Insert parts into the Parts table using INSERT IGNORE
            await db.promise().query('INSERT IGNORE INTO Parts (part_name, part_price) VALUES ?', [partValues]);

            // Fetch the IDs of the inserted parts
            const [partIds] = await db.promise().query('SELECT id FROM Parts WHERE part_name IN (?)', [parts]);

            // Insert the associations into the ServiceParts table
            if (partIds.length > 0) {
                // Process service-part associations and build an array of objects with service_id and part_id
                const servicePartValues = partIds.map(partId => [serviceId, partId.id]);

                // Insert associations into the ServiceParts table
                await db.promise().query('INSERT INTO ServiceParts (service_id, part_id) VALUES ?', [servicePartValues]);
            }
        }

        // Redirect to the service-added-prompt template after adding the service
        res.render('service-added-prompt.ejs', { serviceId });
    } catch (err) {
        console.error('Error adding a new service:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
