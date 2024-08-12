const express = require('express');
const router = express.Router();
const { PartService } = require('../Models/PartService');

// Create a new part-service record by service ID
router.post('/', async (req, res) => {
    try {
        const partService = new PartService(req.body);
        const partServiceId = await partService.create();
        res.status(201).json({ partservice_id: partServiceId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all part-service records by service ID
router.get('/service/:serviceId', async (req, res) => {
    try {
        const partServices = await PartService.getByServiceId(parseInt(req.params.serviceId));
        res.status(200).json(partServices);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a part-service record by ID
router.get('/:id', async (req, res) => {
    try {
        const partService = await PartService.read(parseInt(req.params.id));
        res.status(200).json(partService);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a part-service record
router.put('/:id', async (req, res) => {
    try {
        const partService = new PartService({ ...req.body, partservice_id: parseInt(req.params.id) });
        await partService.update();
        res.status(200).json({ message: 'PartService updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a part-service record
router.delete('/:id', async (req, res) => {
    try {
        await PartService.delete(parseInt(req.params.id));
        res.status(200).json({ message: 'PartService deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
