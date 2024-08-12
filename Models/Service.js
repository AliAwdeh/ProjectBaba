const pool = require('../DB/dbconnnect');

class Service {
    constructor(data) {
        this.service_id = data.service_id || null;
        this.plate_number = data.plate_number;
        this.service_date = new Date(data.service_date);
        this.odometer = data.odometer; // Updated the spelling to match your schema
        this.description = data.description || null;
        this.invoice_id = data.invoice_id || null;
        this.service_done = data.service_done || false; // Updated field name to service_done
    }

    static pool;

    static setPool(pool) {
        Service.pool = pool;
    }

    async create() {
        const { plate_number, service_date, odometer, description, invoice_id, service_done } = this;
        const [result] = await Service.pool.query(
            `INSERT INTO Service (plate_number, service_date, odometer, description, invoice_id, service_done) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [plate_number, service_date, odometer, description, invoice_id, service_done]
        );
        this.service_id = result.insertId; // Set the service_id after creation
        return this.service_id;
    }

    static async read(serviceId) {
        const [rows] = await Service.pool.query(
            `SELECT * FROM Service WHERE service_id = ?`,
            [serviceId]
        );
        return rows[0];
    }

    async update() {
        const { service_id, plate_number, service_date, odometer, description, invoice_id, service_done } = this;
        await Service.pool.query(
            `UPDATE Service SET plate_number = ?, service_date = ?, odometer = ?, description = ?, invoice_id = ?, service_done = ? 
             WHERE service_id = ?`,
            [plate_number, service_date, odometer, description, invoice_id, service_done, service_id]
        );
    }

    static async delete(serviceId) {
        await Service.pool.query(
            `DELETE FROM Service WHERE service_id = ?`,
            [serviceId]
        );
    }

    static async list() {
        const [rows] = await Service.pool.query(`SELECT * FROM Service`);
        return rows;
    }
}

module.exports = { Service };
