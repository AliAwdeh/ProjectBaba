const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('./databaseconnect');

router.get('/', (req, res) => {
    res.render('login.ejs');
});

// Define the authenticateUser function outside the router
async function authenticateUser(username, password) {
    try {
        // Check if the user is a customer
        const [customerRows] = await db.promise().query('SELECT * FROM customers WHERE username = ?', [username]);

        if (customerRows.length > 0) {
            const customer = customerRows[0];

            // Check if the account is active
            if (!customer.is_active) {
                return { userType: 'inactive', userId: null };
            }

            const isPasswordValid = await bcrypt.compare(password, customer.password);

            if (isPasswordValid) {
                return { userType: 'customer', userId: customer.id };
            } else {
                return { userType: 'wrongpassword', userId: null };
            }
        }

        // Check if the user is an admin
        const [adminRows] = await db.promise().query('SELECT * FROM admins WHERE username = ?', [username]);

        if (adminRows.length > 0) {
            const admin = adminRows[0];
            const isPasswordValid = await bcrypt.compare(password, admin.password);

            if (isPasswordValid) {
                return { userType: 'admin', userId: admin.id };
            } else {
                return { userType: 'wrongpassword', userId: null };
            }
        }

        return { userType: 'notfound', userId: null }; // User not found
    } catch (err) {
        console.error('Error during user authentication:', err);
        throw err; // Rethrow the error to be caught in the calling function
    }
}

router.post('/', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Authenticate user using the login module
        const authenticatedUser = await authenticateUser(username, password);

        if (authenticatedUser.userType === 'inactive') {
            res.send('Account is not active. Please contact support.');
        } else if (authenticatedUser.userType === 'wrongpassword') {
            res.send('Incorrect password.');
        } else if (authenticatedUser.userType === 'notfound') {
            // Check admin table here or redirect to signup
            res.redirect('/signup');
        } else {
            // Set the userType and userId in the session
            req.session.userType = authenticatedUser.userType;
            req.session.userId = authenticatedUser.userId;

            // Redirect to the appropriate dashboard
            if (authenticatedUser.userType === 'customer') {
                res.redirect('/dashboard');
            } else if (authenticatedUser.userType === 'admin') {
                res.redirect('/dashboard-admin');
            }
        }
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
