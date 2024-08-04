const pool = require('../DB/dbconnnect');

class Service {
    constructor(data) {
        this.service_id = data.service_id || null;
        this.guid = data.guid;
        this.car_id = data.car_id;
        this.service_date = new Date(data.service_date);
        this.odometre = data.odometre;
        this.description = data.description || null;
        this.invoice_id = data.invoice_id || null;
        this.paid_status = data.paid_status || false;
        this.price = data.price;
    }

    static pool;

    static setPool(pool) {
        Service.pool = pool;
    }

    async create() {
        const { guid, car_id, service_date, odometre, description, invoice_id, paid_status, price } = this;
        const [result] = await pool.query(
            `INSERT INTO Service (guid, car_id, service_date, odometre, description, invoice_id, paid_status, price) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [guid, car_id, service_date, odometre, description, invoice_id, paid_status, price]
        );
        this.service_id = result.insertId; // Set the service_id after creation
        return this.service_id;
    }

    static async read(serviceId) {
        const [rows] = await pool.query(
            `SELECT * FROM Service WHERE service_id = ?`,
            [serviceId]
        );
        return rows[0];
    }

    async update() {
        const { service_id, guid, car_id, service_date, odometre, description, invoice_id, paid_status, price } = this;
        await pool.query(
            `UPDATE Service SET guid = ?, car_id = ?, service_date = ?, odometre = ?, description = ?, invoice_id = ?, paid_status = ?, price = ? 
             WHERE service_id = ?`,
            [guid, car_id, service_date, odometre, description, invoice_id, paid_status, price, service_id]
        );
    }

    static async delete(serviceId) {
        await pool.query(
            `DELETE FROM Service WHERE service_id = ?`,
            [serviceId]
        );
    }

    static async list() {
        const [rows] = await pool.query(`SELECT * FROM Service`);
        return rows;
    }
}
module.exports = { Service };