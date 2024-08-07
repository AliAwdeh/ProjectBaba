const express = require('express');
const router = express.Router();
const { Parts } = require('../Models/Parts');

// Create a new part
router.post('/', async (req, res) => {
    try {
        const part = new Parts(req.body);
        const partId = await part.create();
        res.status(201).json({ partId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a part by ID
router.get('/:id', async (req, res) => {
    try {
        const part = await Parts.read(parseInt(req.params.id));
        res.status(200).json(part);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a part
router.put('/:id', async (req, res) => {
    try {
        const part = new Parts({ ...req.body, part_id: parseInt(req.params.id) });
        await part.update();
        res.status(200).json({ message: 'Part updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a part
router.delete('/:id', async (req, res) => {
    try {
        await Parts.delete(parseInt(req.params.id));
        res.status(200).json({ message: 'Part deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// List all parts
router.get('/', async (req, res) => {
    try {
        const parts = await Parts.list();
        res.status(200).json(parts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
