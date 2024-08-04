const express = require('express');
const router = express.Router();
const { Part } = require('../Models/Parts');

// Create a new part
router.post('/parts', async (req, res) => {
    try {
        const part = new Part(req.body);
        const partId = await part.create();
        res.status(201).json({ partId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a part by ID
router.get('/parts/:id', async (req, res) => {
    try {
        const part = await Part.read(parseInt(req.params.id));
        res.status(200).json(part);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a part
router.put('/parts/:id', async (req, res) => {
    try {
        const part = new Part({ ...req.body, part_id: parseInt(req.params.id) });
        await part.update();
        res.status(200).json({ message: 'Part updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a part
router.delete('/parts/:id', async (req, res) => {
    try {
        await Part.delete(parseInt(req.params.id));
        res.status(200).json({ message: 'Part deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// List all parts
router.get('/parts', async (req, res) => {
    try {
        const parts = await Part.list();
        res.status(200).json(parts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
