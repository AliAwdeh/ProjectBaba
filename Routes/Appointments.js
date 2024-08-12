const express = require('express');
const router = express.Router();
const { Appointments } = require('../Models/Appointments');

// Create a new appointment
router.post('/', async (req, res) => {
    try {
        const appointment = new Appointments(req.body);
        const appointmentId = await appointment.create();
        res.status(201).json({ appointment_id: appointmentId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get an appointment by ID
router.get('/:id', async (req, res) => {
    try {
        const appointment = await Appointments.read(parseInt(req.params.id));
        res.status(200).json(appointment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get appointments by client phone number
router.get('/client/:phone', async (req, res) => {
    try {
        const appointments = await Appointments.getByClientPhone(req.params.phone);
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get appointments by car plate number
router.get('/car/:plate_number', async (req, res) => {
    try {
        const appointments = await Appointments.getByCarPlate(req.params.plate_number);
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update an appointment
router.put('/:id', async (req, res) => {
    try {
        const appointment = new Appointments({ ...req.body, appointment_id: parseInt(req.params.id) });
        await appointment.update();
        res.status(200).json({ message: 'Appointment updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete an appointment
router.delete('/:id', async (req, res) => {
    try {
        await Appointments.delete(parseInt(req.params.id));
        res.status(200).json({ message: 'Appointment deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get appointments for today
router.get('/date/today', async (req, res) => {
    try {
        const appointments = await Appointments.getAppointmentsForToday();
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get appointments for tomorrow
router.get('/date/tomorrow', async (req, res) => {
    try {
        const appointments = await Appointments.getAppointmentsForTomorrow();
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// List all appointments
router.get('/', async (req, res) => {
    try {
        const appointments = await Appointments.list();
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
