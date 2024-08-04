const express = require('express');
const router = express.Router();
const { Appointment } = require('../Models/Appointments');

// Create a new appointment
router.post('/appointments', async (req, res) => {
    try {
        const appointment = new Appointment(req.body);
        const appointmentId = await appointment.create();
        res.status(201).json({ appointmentId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get an appointment by ID
router.get('/appointments/:id', async (req, res) => {
    try {
        const appointment = await Appointment.read(parseInt(req.params.id));
        res.status(200).json(appointment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update an appointment
router.put('/appointments/:id', async (req, res) => {
    try {
        const appointment = new Appointment({ ...req.body, appointment_id: parseInt(req.params.id) });
        await appointment.update();
        res.status(200).json({ message: 'Appointment updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete an appointment
router.delete('/appointments/:id', async (req, res) => {
    try {
        await Appointment.delete(parseInt(req.params.id));
        res.status(200).json({ message: 'Appointment deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// List all appointments
router.get('/appointments', async (req, res) => {
    try {
        const appointments = await Appointment.list();
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
