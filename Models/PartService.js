const pool = require('../DB/dbconnnect');

class PartService {
    constructor(data) {
        this.partservice_id = data.partservice_id || null;
        this.guid = data.guid;
        this.part_id = data.part_id;
        this.service_id = data.service_id;
        this.quantity = data.quantity;
        this.total_price = data.total_price || null; // This is a computed field
    }

    static pool;
    static setPool(pool) {
        PartService.pool = pool;
    }
    async create() {
        const { guid, part_id, service_id, quantity } = this;
        const [result] = await pool.query(
            `INSERT INTO PartService (guid, part_id, service_id, quantity) 
             VALUES (?, ?, ?, ?)`,
            [guid, part_id, service_id, quantity]
        );

        // Calculate total_price after insertion
        const [[part]] = await pool.query(
            `SELECT price FROM Parts WHERE part_id = ?`,
            [part_id]
        );
        this.total_price = quantity * part.price;

        await pool.query(
            `UPDATE PartService SET total_price = ? WHERE partservice_id = ?`,
            [this.total_price, result.insertId]
        );

        this.partservice_id = result.insertId; // Set the partservice_id after creation
        return this.partservice_id;
    }

    static async read(partserviceId) {
        const [rows] = await pool.query(
            `SELECT * FROM PartService WHERE partservice_id = ?`,
            [partserviceId]
        );
        return rows[0];
    }

    async update() {
        const { partservice_id, guid, part_id, service_id, quantity } = this;

        // Recalculate total_price during update
        const [[part]] = await pool.query(
            `SELECT price FROM Parts WHERE part_id = ?`,
            [part_id]
        );
        const total_price = quantity * part.price;

        await pool.query(
            `UPDATE PartService SET guid = ?, part_id = ?, service_id = ?, quantity = ?, total_price = ? 
             WHERE partservice_id = ?`,
            [guid, part_id, service_id, quantity, total_price, partservice_id]
        );
    }

    static async delete(partserviceId) {
        await pool.query(
            `DELETE FROM PartService WHERE partservice_id = ?`,
            [partserviceId]
        );
    }

    static async list() {
        const [rows] = await pool.query(`SELECT * FROM PartService`);
        return rows;
    }

    static async getByServiceId(serviceId) {
        const [rows] = await pool.query(
            `SELECT * FROM PartService WHERE service_id = ?`,
            [serviceId]
        );
        return rows;
    }
}
module.exports = { PartService };