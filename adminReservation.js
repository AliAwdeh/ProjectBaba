// routes/adminReservation.js

const express = require('express');
const router = express.Router();
const middleware = require('./middleware');
const pool = require('./databaseconnect');

// Render the admin reservation page
router.get('/admin-res', middleware.authenticateAdmin, (req, res) => {
    // Fetch and pass all reservations to the view
    pool.execute('SELECT * FROM appointments')
        .then(([results]) => {
            const allReservations = results;
            res.render('admin-res.js', { allReservations });
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).json({ success: false, message: 'Failed to fetch reservations' });
        });
});

module.exports = router;
