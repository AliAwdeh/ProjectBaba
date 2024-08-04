const express = require('express');
const router = express.Router();
const { Invoice } = require('../Models/Invoice');

// Create a new invoice
router.post('/invoice', async (req, res) => {
    try {
        const invoice = new Invoice(req.body);
        const invoiceId = await invoice.create();
        res.status(201).json({ invoiceId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get an invoice by ID
router.get('/invoice/:id', async (req, res) => {
    try {
        const invoice = await Invoice.read(parseInt(req.params.id));
        res.status(200).json(invoice);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update an invoice
router.put('/invoice/:id', async (req, res) => {
    try {
        const invoice = new Invoice({ ...req.body, invoice_id: parseInt(req.params.id) });
        await invoice.update();
        res.status(200).json({ message: 'Invoice updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete an invoice
router.delete('/invoice/:id', async (req, res) => {
    try {
        await Invoice.delete(parseInt(req.params.id));
        res.status(200).json({ message: 'Invoice deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// List all invoices
router.get('/invoice', async (req, res) => {
    try {
        const invoices = await Invoice.list();
        res.status(200).json(invoices);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
