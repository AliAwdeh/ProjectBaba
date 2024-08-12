const express = require('express');
const router = express.Router();
const { Clients } = require('../Models/Clients');

// Create a new client
router.post('/', async (req, res) => {
    try {
        const client = new Clients(req.body);
        const clientPhone = await client.create();
        res.status(201).json({ phone: clientPhone });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a client by phone number
router.get('/:phone', async (req, res) => {
    try {
        const client = await Clients.read(req.params.phone);
        res.status(200).json(client);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a client by phone number
router.put('/:phone', async (req, res) => {
    try {
        const client = new Clients({ ...req.body, phone: req.params.phone });
        await client.update();
        res.status(200).json({ message: 'Client updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a client by phone number
router.delete('/:phone', async (req, res) => {
    try {
        await Clients.delete(req.params.phone);
        res.status(200).json({ message: 'Client deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// List all clients
router.get('/', async (req, res) => {
    try {
        const clients = await Clients.list();
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error);
    }
});

module.exports = router;
