const express = require('express');
const router = express.Router();
const { Cars } = require('../Models/Cars');

// Create a new car
router.post('/', async (req, res) => {
    try {
        const car = new Cars(req.body);
        const plateNumber = await car.create();
        res.status(201).json({ plate_number: plateNumber });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a car by plate number
router.get('/:plate_number', async (req, res) => {
    try {
        const car = await Cars.read(req.params.plate_number);
        res.status(200).json(car);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get cars by owner phone
router.get('/byowner/:owner_phone', async (req, res) => {
    try {
        const cars = await Cars.readByOwnerPhone(req.params.owner_phone);
        res.status(200).json(cars);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a car by plate number
router.put('/:plate_number', async (req, res) => {
    try {
        const car = new Cars({ ...req.body, plate_number: req.params.plate_number });
        await car.update();
        res.status(200).json({ message: 'Car updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a car by plate number
router.delete('/:plate_number', async (req, res) => {
    try {
        await Cars.delete(req.params.plate_number);
        res.status(200).json({ message: 'Car deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// List all cars
router.get('/', async (req, res) => {
    try {
        const cars = await Cars.list();
        res.status(200).json(cars);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;