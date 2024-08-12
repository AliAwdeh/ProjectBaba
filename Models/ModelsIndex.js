// models.js
const { Clients } = require('./Clients');
const { Cars } = require('./Cars');
const { Appointments } = require('./Appointments');
const { OwnershipHistory } = require('./OwnershipHistory');
const { Parts } = require('./Parts');
const { Service } = require('./Service');
const { PartService } = require('./PartService');
const { Invoice } = require('./Invoice');
const pool = require('../DB/dbconnnect');

// Set the pool for the models
Clients.setPool(pool);
Cars.setPool(pool);
Appointments.setPool(pool);
OwnershipHistory.setPool(pool);
Parts.setPool(pool);
Service.setPool(pool);
PartService.setPool(pool);
Invoice.setPool(pool);

module.exports = {
    Clients,
    Cars,
    Appointments,
    OwnershipHistory,
    Parts,
    Service,
    PartService,
    Invoice
};
