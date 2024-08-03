// app.js

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
const db = require('./databaseconnect');
const middleware = require('./middleware');
const loginRouter = require('./login.js');
const signupRouter = require('./signup');
//const adminLoginRouter = require('./admin-login');
const dashboardRouter = require('./dashboard.js');
const serviceDetailsRouter = require('./service-details.js');
const admindashboardRouter = require('./dashboard-admin.js');
const addCarsAndCustomersRouter = require('./add');
const adminRoute = require('./admin');
const clientReservationRouter = require('./clientReservation');
const historyrouter = require('./history');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
}));

app.get('/', (req, res) => {
    res.render('index');
});
app.get('/logout', (req, res) => {
    // Clear the session to sign out the user
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            res.status(500).send('Internal Server Error');
        } else {
            // Redirect the user to the login page after signing out
            res.redirect('/login'); // You should replace '/login' with the actual path of your login page
        }
    });
});
app.use('/login', loginRouter);
//app.use('/login-admin', adminLoginRouter);
app.use('/signup', signupRouter);
app.use('/dashboard', dashboardRouter);
app.use('/dashboard-admin', admindashboardRouter);
app.use('/service-details', serviceDetailsRouter);
app.use('/add', addCarsAndCustomersRouter);
app.use('/history', historyrouter);

app.use('/admin', adminRoute);
app.use('/clientReservation', clientReservationRouter); // Client reservations

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
