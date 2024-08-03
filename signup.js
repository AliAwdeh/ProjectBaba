// signup.js

const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('./databaseconnect');

router.get('/', (req, res) => {
    res.render('signup');
});

router.post('/', async (req, res) => {
    const { username, password, name, surname, email, address, phoneNumber, moreInfo } = req.body;

    try {
        // Hash the password before storing it in the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the customer into the customers table
        await db.promise().query('INSERT INTO customers (username, password, name, surname, email, address, phone_number, more_info) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [username, hashedPassword, name, surname, email, address, phoneNumber, moreInfo]);

        // Redirect after successful signup
        res.redirect('/login');
    } catch (err) {
        console.error('Error during signup:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
