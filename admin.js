// admin.js
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const middleware = require('./middleware');
const db = require('./databaseconnect');

// Render admin add car form
router.get('/add-car', middleware.authenticateAdmin, (req, res) => {
    try {
        res.render('admin-addcar-form.ejs');
    } catch (err) {
        console.error('Error rendering admin add car form:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Handle admin add car with user search
router.post('/add-car', middleware.authenticateAdmin, async (req, res) => {
    try {
        const { plateNumber, odometer, ownerId, brand, make, colour, yearOfProduction } = req.body;

        // Check if the car with the given plate number is already registered
        const [existingCars] = await db.promise().query('SELECT id FROM Cars WHERE plate_number = ?', [plateNumber]);

        if (existingCars.length > 0) {
            return res.status(400).send('Car with the same plate number is already registered.');
        }

        // Register the new car for the specified user
        await db.promise().query('INSERT INTO Cars (plate_number, owner_id, odometer, brand, make, colour, year_of_production) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [plateNumber, ownerId, odometer, brand, make, colour, yearOfProduction]);

        res.status(200).send('Car added successfully!');
    } catch (err) {
        console.error('Error adding a new car (admin):', err);
        res.status(500).send('Internal Server Error');
    }
});

// Handle admin modify car data
router.post('/modify-car', middleware.authenticateAdmin, async (req, res) => {
    try {
        // Add logic to modify car data based on the request body
        // Use the car ID or plate number to identify the car and update the data in the database

        res.status(200).send('Car data modified successfully!');
    } catch (err) {
        console.error('Error modifying car data (admin):', err);
        res.status(500).send('Internal Server Error');
    }
});

// Render admin add customer form for both adding and updating
router.get('/add-customer', middleware.authenticateAdmin, (req, res) => {
    try {
        // Pass an empty object if customer is not available
        res.render('admin-addcustomer-form.ejs', { customer: {} });
    } catch (err) {
        console.error('Error rendering admin add customer form:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Render admin update customer form
/*
router.get('/update-customer/:id', middleware.authenticateAdmin, async (req, res) => {
    try {
        const customerId = req.params.id;
        // Fetch customer data by ID and render the update form
        const [customer] = await db.promise().query('SELECT * FROM Customers WHERE id = ?', [customerId]);

        if (customer.length === 0) {
            return res.status(404).send('Customer not found');
        }

        res.render('admin-updatecustomer-form.ejs', { customer });
    } catch (err) {
        console.error('Error rendering admin update customer form:', err);
        res.status(500).send('Internal Server Error');
    }
});
*/
// Admin update customer
router.post('/update-customer/:id', middleware.authenticateAdmin, async (req, res) => {
    try {
        const is_active = 0;
        const customerId = req.params.id;
        const { username, password, name, surname, email, address, phone_number, more_info } = req.body;

        // Check if the customer with the given ID exists
        const [existingCustomer] = await db.promise().query('SELECT * FROM Customers WHERE id = ?', [customerId]);

        if (existingCustomer.length === 0) {
            return res.status(404).send('Customer not found');
        }

        // Update the existing customer if the corresponding fields are not empty
        const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

        const updateFields = {
            username,
            password: hashedPassword,
            name,
            surname,
            email,
            address,
            phone_number,
            more_info,
            is_active
        };

        const nonEmptyFields = Object.fromEntries(
            Object.entries(updateFields).filter(([key, value]) => value !== null && value !== undefined)
        );

        const query = `UPDATE Customers SET ${Object.keys(nonEmptyFields).map(field => `${field} = ?`).join(', ')} WHERE id = ?`;
        const values = [...Object.values(nonEmptyFields), customerId];

        await db.promise().query(query, values);

        res.send('Customer data updated successfully!');
    } catch (err) {
        console.error('Error updating a customer (admin):', err);
        res.status(500).send('Internal Server Error');
    }
});

// Admin add customer
router.post('/add-customer', middleware.authenticateAdmin, async (req, res) => {
    try {
        const is_active = 0;
        const { username, password, name, surname, email, address, phone_number, more_info } = req.body;

        // Check if the customer with the given username already exists
        const [existingCustomer] = await db.promise().query('SELECT * FROM Customers WHERE username = ?', [username]);

        if (existingCustomer && existingCustomer.length > 0) {
            // The username already exists
            res.status(400).send('Customer with the same username already exists.');
        } else {
            // Add a new customer
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert the new user after hashing the password
            await db.promise().query(
                'INSERT INTO Customers (username, password, name, surname, email, address, phone_number, more_info, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [username, hashedPassword, name, surname, email, address, phone_number, more_info, is_active]
            );

            res.send('Customer added successfully!');
        }
    } catch (err) {
        console.error('Error adding a new customer (admin):', err);
        res.status(500).send('Internal Server Error');
    }
});

// Endpoint for user search
router.get('/search-users', middleware.authenticateAdmin, async (req, res) => {
    try {
        const searchQuery = req.query.search;

        // Perform a database query to find users matching the username
        const [matchingUsers] = await db.promise().query('SELECT * FROM Customers WHERE username LIKE ?', [`%${searchQuery}%`]);

        res.json(matchingUsers);
    } catch (err) {
        console.error('Error searching users:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
