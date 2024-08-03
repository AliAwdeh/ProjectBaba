const pool = require('./dbconnect');

export class Invoice {
    constructor(data) {
        this.invoice_id = data.invoice_id || null;
        this.guid = data.guid;
        this.service_id = data.service_id;
        this.labor_cost = data.labor_cost;
        this.partservice_total = data.partservice_total || null; // This is a computed field
        this.total = data.total || null; // This is a computed field
    }

    async create() {
        const { guid, service_id, labor_cost } = this;

        // Insert into Invoice table
        const [result] = await pool.query(
            `INSERT INTO Invoice (guid, service_id, labor_cost) 
             VALUES (?, ?, ?)`,
            [guid, service_id, labor_cost]
        );

        this.invoice_id = result.insertId; // Set the invoice_id after creation

        // Calculate partservice_total and total
        const [[partserviceTotalResult]] = await pool.query(
            `SELECT SUM(total_price) AS partservice_total FROM PartService WHERE service_id = ?`,
            [service_id]
        );
        this.partservice_total = partserviceTotalResult.partservice_total || 0;
        this.total = labor_cost + this.partservice_total;

        // Update the Invoice with computed fields
        await pool.query(
            `UPDATE Invoice SET partservice_total = ?, total = ? WHERE invoice_id = ?`,
            [this.partservice_total, this.total, this.invoice_id]
        );

        return this.invoice_id;
    }

    static async read(invoiceId) {
        const [rows] = await pool.query(
            `SELECT * FROM Invoice WHERE invoice_id = ?`,
            [invoiceId]
        );
        return rows[0];
    }

    async update() {
        const { invoice_id, guid, service_id, labor_cost } = this;

        // Recalculate partservice_total and total during update
        const [[partserviceTotalResult]] = await pool.query(
            `SELECT SUM(total_price) AS partservice_total FROM PartService WHERE service_id = ?`,
            [service_id]
        );
        this.partservice_total = partserviceTotalResult.partservice_total || 0;
        this.total = labor_cost + this.partservice_total;

        await pool.query(
            `UPDATE Invoice SET guid = ?, service_id = ?, labor_cost = ?, partservice_total = ?, total = ? 
             WHERE invoice_id = ?`,
            [guid, service_id, labor_cost, this.partservice_total, this.total, invoice_id]
        );
    }

    static async delete(invoiceId) {
        await pool.query(
            `DELETE FROM Invoice WHERE invoice_id = ?`,
            [invoiceId]
        );
    }

    static async list() {
        const [rows] = await pool.query(`SELECT * FROM Invoice`);
        return rows;
    }

    static async getByServiceId(serviceId) {
        const [rows] = await pool.query(
            `SELECT * FROM Invoice WHERE service_id = ?`,
            [serviceId]
        );
        return rows;
    }
}
