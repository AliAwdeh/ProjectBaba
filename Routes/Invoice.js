const express = require('express');
const router = express.Router();
const { Invoice } = require('../Models/Invoice');

// Create a new invoice
router.post('/', async (req, res) => {
    try {
        const invoice = new Invoice(req.body);
        const invoiceId = await invoice.create();
        res.status(201).json({ invoice_id: invoiceId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get an invoice by ID
router.get('/:id', async (req, res) => {
    try {
        const invoice = await Invoice.read(parseInt(req.params.id));
        res.status(200).json(invoice);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update an invoice
router.put('/:id', async (req, res) => {
    try {
        const invoice = new Invoice({ ...req.body, invoice_id: parseInt(req.params.id) });
        await invoice.update();
        res.status(200).json({ message: 'Invoice updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete an invoice
router.delete('/:id', async (req, res) => {
    try {
        await Invoice.delete(parseInt(req.params.id));
        res.status(200).json({ message: 'Invoice deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// List all invoices
router.get('/', async (req, res) => {
    try {
        const invoices = await Invoice.list();
        res.status(200).json(invoices);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Refresh the partservice_total and total_price of an invoice by ID
router.put('/:id/refresh-total', async (req, res) => {
    try {
        const invoice = await Invoice.read(parseInt(req.params.id));
        if (!invoice) {
            return res.status(404).json({ error: 'Invoice not found' });
        }

        // Create an Invoice instance with the retrieved data
        const invoiceInstance = new Invoice(invoice);

        // Call the refreshPartserviceTotal method with the invoice_id
        await invoiceInstance.refreshPartserviceTotal(invoice.invoice_id);

        res.status(200).json({ message: 'Invoice totals refreshed', invoice: invoiceInstance });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
