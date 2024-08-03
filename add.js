// addcarsndcustomers.js

const express = require('express');
const router = express.Router();
const middleware = require('./middleware');
const db = require('./databaseconnect');

// Render car registration form
router.get('/add-car', middleware.authenticateUser, (req, res) => {
    try {
        res.render('addcar-form.ejs');
    } catch (err) {
        console.error('Error rendering add car form:', err);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/add-car', middleware.authenticateUser, async (req, res) => {
    try {
        const { plateNumber, odometer, colour, make, brand, yearOfProduction } = req.body;
        const userId = req.session.userId;

        // Check if the car with the given plate number is already registered for the user
        const [existingCars] = await db.promise().query('SELECT id FROM Cars WHERE plate_number = ? AND owner_id = ?', [plateNumber, userId]);

        if (existingCars.length > 0) {
            return res.status(400).send('Car with the same plate number is already registered for this user.');
        }

        // Register the new car for the user
        await db.promise().query('INSERT INTO Cars (plate_number, owner_id, odometer, colour, make, brand, year_of_production) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [plateNumber, userId, odometer, colour, make, brand, yearOfProduction]);

        res.status(200).send('Car added successfully!');
    } catch (err) {
        console.error('Error adding a new car:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Handle car registration for admins
router.post('/admin/add-car', middleware.authenticateAdmin, async (req, res) => {
    try {
        const { plateNumber, odometer, ownerId } = req.body;

        // Check if the car with the given plate number is already registered
        const [existingCars] = await db.promise().query('SELECT id FROM Cars WHERE plate_number = ?', [plateNumber]);

        if (existingCars.length > 0) {
            return res.status(400).send('Car with the same plate number is already registered.');
        }

        // Register the new car for the specified user
        await db.promise().query('INSERT INTO Cars (plate_number, owner_id, odometer) VALUES (?, ?, ?)', [plateNumber, ownerId, odometer]);

        res.status(200).send('Car added successfully!');
    } catch (err) {
        console.error('Error adding a new car:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Handle customer registration for admins
router.post('/admin/add-customer', middleware.authenticateAdmin, async (req, res) => {
    try {
        const { username, password, name, surname, email, address, phoneNumber, moreInfo } = req.body;

        // Check if the username is already taken
        const [existingUsers] = await db.promise().query('SELECT id FROM Customers WHERE username = ?', [username]);

        if (existingUsers.length > 0) {
            return res.status(400).send('Username is already taken.');
        }

        // Register the new customer
        await db.promise().query('INSERT INTO Customers (username, password, name, surname, email, address, phone_number, more_info) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [username, password, name, surname, email, address, phoneNumber, moreInfo]);

        res.status(200).send('Customer added successfully!');
    } catch (err) {
        console.error('Error adding a new customer:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
