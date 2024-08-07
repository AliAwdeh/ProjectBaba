const express = require('express');
const router = express.Router();
const { Service } = require('../Models/Service');

// Create a new service
router.post('/', async (req, res) => {
    try {
        const service = new Service(req.body);
        const serviceId = await service.create();
        res.status(201).json({ serviceId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a service by ID
router.get('/:id', async (req, res) => {
    try {
        const service = await Service.read(parseInt(req.params.id));
        res.status(200).json(service);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a service
router.put('/:id', async (req, res) => {
    try {
        const service = new Service({ ...req.body, service_id: parseInt(req.params.id) });
        await service.update();
        res.status(200).json({ message: 'Service updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a service
router.delete('/:id', async (req, res) => {
    try {
        await Service.delete(parseInt(req.params.id));
        res.status(200).json({ message: 'Service deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// List all services
router.get('/', async (req, res) => {
    try {
        const services = await Service.list();
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
