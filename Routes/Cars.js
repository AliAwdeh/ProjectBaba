const express = require('express');
const router = express.Router();
const { Cars } = require('../Models/Cars');

// Create a new car
router.post('/', async (req, res) => {
    try {
        const cars = new Cars(req.body);
        const carId = await cars.create();
        res.status(201).json({ carId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a car by ID
router.get('/:id', async (req, res) => {
    try {
        const cars = await Cars.read(parseInt(req.params.id));
        res.status(200).json(cars);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a car by ID
router.get('/byplate/:platenb', async (req, res) => {
    try {
        const cars = await Cars.readbyplate(parseInt(req.params.platenb));
        res.status(200).json(cars);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a car by ID
router.get('/byowner/:ownerid', async (req, res) => {
    try {
        const cars = await Cars.readbyownerid(parseInt(req.params.ownerid));
        res.status(200).json(cars);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a car
router.put('/:id', async (req, res) => {
    try {
        const cars = new Cars({ ...req.body, car_id: parseInt(req.params.id) });
        await cars.update();
        res.status(200).json({ message: 'Car updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a car
router.delete('/:id', async (req, res) => {
    try {
        await Cars.delete(parseInt(req.params.id));
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