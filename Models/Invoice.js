const pool = require('../DB/dbconnnect');

class Invoice {
    constructor(data) {
        this.invoice_id = data.invoice_id || null;
        this.guid = data.guid;
        this.service_id = data.service_id;
        this.labor_cost = parseFloat(data.labor_cost); // Ensure labor_cost is a number
        this.partservice_total = data.partservice_total || null; // This is a computed field
        this.total = data.total || null; // This is a computed field
    }

    static pool;

    static setPool(pool) {
        Invoice.pool = pool;
    }

    async create() {
        const { service_id, labor_cost } = this;

        // Insert into Invoice table
        const [result] = await Invoice.pool.query(
            `INSERT INTO Invoice (service_id, labor_cost) 
             VALUES (?, ?)`,
            [service_id, labor_cost]
        );

        this.invoice_id = result.insertId; // Set the invoice_id after creation

        // Calculate partservice_total and total
        const [[partserviceTotalResult]] = await Invoice.pool.query(
            `SELECT SUM(total_price) AS partservice_total FROM PartService WHERE service_id = ?`,
            [service_id]
        );
        this.partservice_total = parseFloat(partserviceTotalResult.partservice_total) || 0; // Ensure it's a number
        this.total = parseFloat(labor_cost) + this.partservice_total; // Ensure correct addition

        // Update the Invoice with computed fields
        await Invoice.pool.query(
            `UPDATE Invoice SET partservice_total = ?, total = ? WHERE invoice_id = ?`,
            [this.partservice_total, this.total, this.invoice_id]
        );

        return this.invoice_id;
    }

    static async read(invoiceId) {
        const [rows] = await Invoice.pool.query(
            `SELECT * FROM Invoice WHERE invoice_id = ?`,
            [invoiceId]
        );
        return rows[0];
    }

    async update() {
        const { invoice_id, service_id, labor_cost } = this;

        // Recalculate partservice_total and total during update
        const [[partserviceTotalResult]] = await Invoice.pool.query(
            `SELECT SUM(total_price) AS partservice_total FROM PartService WHERE service_id = ?`,
            [service_id]
        );
        this.partservice_total = parseFloat(partserviceTotalResult.partservice_total) || 0; // Ensure it's a number
        this.total = parseFloat(labor_cost) + this.partservice_total; // Ensure correct addition

        await Invoice.pool.query(
            `UPDATE Invoice SET service_id = ?, labor_cost = ?, partservice_total = ?, total = ? 
             WHERE invoice_id = ?`,
            [service_id, labor_cost, this.partservice_total, this.total, invoice_id]
        );
    }

    static async delete(invoiceId) {
        await Invoice.pool.query(
            `DELETE FROM Invoice WHERE invoice_id = ?`,
            [invoiceId]
        );
    }

    static async list() {
        const [rows] = await Invoice.pool.query(`SELECT * FROM Invoice`);
        return rows;
    }

    static async getByServiceId(serviceId) {
        const [rows] = await Invoice.pool.query(
            `SELECT * FROM Invoice WHERE service_id = ?`,
            [serviceId]
        );
        return rows;
    }
}

module.exports = { Invoice };
