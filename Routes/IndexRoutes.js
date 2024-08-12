const express = require('express');
const router = express.Router();

// Import route files
const clientRoutes = require('./Clients');
const carRoutes = require('./Cars');
const appointmentRoutes = require('./Appointments');
const ownershipHistoryRoutes = require('./OwnershipHistory');
const partRoutes = require('./Parts');
const serviceRoutes = require('./Service');
const partServiceRoutes = require('./PartService');
const invoiceRoutes = require('./Invoice');

// Set up routes
router.use('/clients', clientRoutes);
router.use('/cars', carRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/OwnershipHistory', ownershipHistoryRoutes);
router.use('/parts', partRoutes);
router.use('/services', serviceRoutes);
router.use('/partservice', partServiceRoutes);
router.use('/invoices', invoiceRoutes);

module.exports = router;