const express = require('express');
const router = express.Router();
const { Clients } = require('../Models/Clients');

// Create a new client
router.post('/', async (req, res) => {
    try {
        const client = new Clients(req.body);
        const clientId = await client.create();
        res.status(201).json({ clientId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a client by ID
router.get('/:id', async (req, res) => {
    try {
        const client = await Clients.read(parseInt(req.params.id));
        res.status(200).json(client);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/byphone/:phone', async (req, res) => {
    try {
        const client = await Clients.readbyphonenumber(parseInt(req.params.phone));
        res.status(200).json(client);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a client
router.put('/:id', async (req, res) => {
    try {
        const client = new Clients({ ...req.body, client_id: parseInt(req.params.id) });
        await client.update();
        res.status(200).json({ message: 'Client updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a client
router.delete('/:id', async (req, res) => {
    try {
        await Clients.delete(parseInt(req.params.id));
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
