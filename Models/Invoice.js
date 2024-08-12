const pool = require('../DB/dbconnnect');

class Invoice {
    constructor(data) {
        this.invoice_id = data.invoice_id || null;
        this.service_id = data.service_id;
        this.labor_cost = parseFloat(data.labor_cost) || 0; // Ensure labor_cost is a number and defaults to 0
        this.partservice_total = data.partservice_total || null; // Computed field
        this.total_price = data.total_price || null; // Computed field
    }

    static pool;

    static setPool(pool) {
        Invoice.pool = pool;
    }

    async create() {
        const { service_id, labor_cost } = this;

        try {
            // Insert into Invoice table
            const [result] = await Invoice.pool.query(
                `INSERT INTO Invoice (service_id, labor_cost) 
                 VALUES (?, ?)`,
                [service_id, labor_cost]
            );

            this.invoice_id = result.insertId; // Set the invoice_id after creation

            // Refresh partservice_total and total_price
            await this.refreshPartserviceTotal(this.invoice_id);

            return this.invoice_id;
        } catch (error) {
            console.error('Error creating invoice:', error);
            throw error; // Re-throw the error after logging
        }
    }

    async refreshPartserviceTotal(invoice_id) {
        try {
            // First, get the service_id associated with this invoice
            const [[invoice]] = await Invoice.pool.query(
                `SELECT service_id FROM Invoice WHERE invoice_id = ?`,
                [invoice_id]
            );

            const service_id = invoice.service_id;

            // Calculate partservice_total from PartService where service_id matches
            const [[partserviceTotalResult]] = await Invoice.pool.query(
                `SELECT SUM(total_price) AS partservice_total FROM PartService WHERE service_id = ?`,
                [service_id]
            );

            this.partservice_total = parseFloat(partserviceTotalResult.partservice_total) || 0; // Ensure it's a number
            this.total_price = this.labor_cost + this.partservice_total; // Calculate total_price

            // Update the Invoice with computed fields
            await Invoice.pool.query(
                `UPDATE Invoice SET partservice_total = ?, total_price = ? WHERE invoice_id = ?`,
                [this.partservice_total, this.total_price, invoice_id]
            );

        } catch (error) {
            console.error('Error refreshing partservice_total:', error);
            throw error; // Re-throw the error after logging
        }
    }

    static async read(invoiceId) {
        try {
            const [rows] = await Invoice.pool.query(
                `SELECT * FROM Invoice WHERE invoice_id = ?`,
                [invoiceId]
            );
            return rows[0] || null; // Return null if no row is found
        } catch (error) {
            console.error('Error reading invoice:', error);
            throw error; // Re-throw the error after logging
        }
    }

    async update() {
        const { invoice_id, service_id, labor_cost } = this;

        try {
            // Update the invoice details
            await Invoice.pool.query(
                `UPDATE Invoice SET service_id = ?, labor_cost = ? 
                 WHERE invoice_id = ?`,
                [service_id, labor_cost, invoice_id]
            );

            // Refresh partservice_total and total_price
            await this.refreshPartserviceTotal(invoice_id);
            
        } catch (error) {
            console.error('Error updating invoice:', error);
            throw error; // Re-throw the error after logging
        }
    }

    static async delete(invoiceId) {
        try {
            await Invoice.pool.query(
                `DELETE FROM Invoice WHERE invoice_id = ?`,
                [invoiceId]
            );
        } catch (error) {
            console.error('Error deleting invoice:', error);
            throw error; // Re-throw the error after logging
        }
    }

    static async list() {
        try {
            const [rows] = await Invoice.pool.query(`SELECT * FROM Invoice`);
            return rows;
        } catch (error) {
            console.error('Error listing invoices:', error);
            throw error; // Re-throw the error after logging
        }
    }

    static async getByServiceId(serviceId) {
        try {
            const [rows] = await Invoice.pool.query(
                `SELECT * FROM Invoice WHERE service_id = ?`,
                [serviceId]
            );
            return rows;
        } catch (error) {
            console.error('Error getting invoices by service ID:', error);
            throw error; // Re-throw the error after logging
        }
    }
}

module.exports = { Invoice };
