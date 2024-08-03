const express = require('express');
const router = express.Router();
const middleware = require('./middleware');
const util = require('util');
const pool = require('./databaseconnect');

function executeQuery(sql, values) {
    return new Promise((resolve, reject) => {
        pool.execute(sql, values, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve([results, fields]);
            }
        });
    });
}

// Handle POST request to save client reservation data
router.post('/make-reservation', middleware.authenticateUser, async (req, res) => {
    try {
        const { date, time } = req.body;

        // Insert the data into the 'appointments' table
        await executeQuery('INSERT INTO appointments (user_id, date, time) VALUES (?, ?, ?)', [req.session.userId, date, time]);

        console.log('Reservation successfully made');
        res.status(200).json({ success: true, message: 'Reservation successfully made' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Failed to make a reservation' });
    }
});

// Render the client reservation page
router.get('/resclient', middleware.authenticateUser, async (req, res) => {
    try {
        // Fetch and pass client reservations to the view
        const [results] = await executeQuery('SELECT * FROM appointments WHERE user_id = ?', [req.session.userId]);
        console.log(results); // Log the results to the console
        const reservations = results;
        res.render('resclient', { reservations });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch reservations' });
    }
});

// Render the admin reservation page
router.get('/admin-res', middleware.authenticateAdmin, async (req, res) => {
    try {
        // Fetch and pass all reservations to the view
        const [results] = await executeQuery('SELECT * FROM appointments');
        const completedReservations = results;
        res.render('admin-res', { completedReservations });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch reservations' });
    }
});




module.exports = router;
