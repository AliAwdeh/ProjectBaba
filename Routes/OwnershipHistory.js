const express = require('express');
const router = express.Router();
const { OwnershipHistory } = require('../Models/OwnershipHistory');

// Create a new ownership history record
router.post('/', async (req, res) => {
    try {
        const ownershipHistory = new OwnershipHistory(req.body);
        const ownershipId = await ownershipHistory.create();
        res.status(201).json({ ownership_id: ownershipId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get an ownership history record by ID
router.get('/:id', async (req, res) => {
    try {
        const ownershipHistory = await OwnershipHistory.read(parseInt(req.params.id));
        res.status(200).json(ownershipHistory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update an ownership history record
router.put('/:id', async (req, res) => {
    try {
        const ownershipHistory = new OwnershipHistory({ ...req.body, ownership_id: parseInt(req.params.id) });
        await ownershipHistory.update();
        res.status(200).json({ message: 'Ownership history updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete an ownership history record
router.delete('/:id', async (req, res) => {
    try {
        await OwnershipHistory.delete(parseInt(req.params.id));
        res.status(200).json({ message: 'Ownership history deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// List all ownership history records
router.get('/', async (req, res) => {
    try {
        const ownershipHistories = await OwnershipHistory.list();
        res.status(200).json(ownershipHistories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
