const express = require('express');
const router = express.Router();
const { Cars } = require('../Models/Cars');

// Create a new car
router.post('/cars', async (req, res) => {
    try {
        const car = new Car(req.body);
        const carId = await car.create();
        res.status(201).json({ carId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a car by ID
router.get('/cars/:id', async (req, res) => {
    try {
        const car = await Car.read(parseInt(req.params.id));
        res.status(200).json(car);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a car
router.put('/cars/:id', async (req, res) => {
    try {
        const car = new Car({ ...req.body, car_id: parseInt(req.params.id) });
        await car.update();
        res.status(200).json({ message: 'Car updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a car
router.delete('/cars/:id', async (req, res) => {
    try {
        await Car.delete(parseInt(req.params.id));
        res.status(200).json({ message: 'Car deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// List all cars
router.get('/cars', async (req, res) => {
    try {
        const cars = await Car.list();
        res.status(200).json(cars);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
