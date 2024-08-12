const pool = require('../DB/dbconnnect');

class PartService {
    constructor(data) {
        this.partservice_id = data.partservice_id || null;
        this.part_id = data.part_id;
        this.service_id = data.service_id;
        this.unit_price = data.unit_price; 
        this.quantity = data.quantity;
        this.total_price = data.total_price || null; // Computed field
    }

    static pool;

    static setPool(pool) {
        PartService.pool = pool;
    }

    async create() {
        const { part_id, service_id, unit_price, quantity, total_price } = this;
        const [result] = await PartService.pool.query(
            `INSERT INTO PartService (part_id, service_id, unit_price, quantity, total_price) 
             VALUES (?, ?, ?, ?, ?)`,
            [part_id, service_id, unit_price, quantity, total_price]
        );

        this.partservice_id = result.insertId; // Set the partservice_id after creation
        return this.partservice_id;
    }

    static async read(partserviceId) {
        const [rows] = await PartService.pool.query(
            `SELECT * FROM PartService WHERE partservice_id = ?`,
            [partserviceId]
        );
        return rows[0];
    }

    static async getByServiceId(serviceId) {
        const [rows] = await PartService.pool.query(
            `SELECT * FROM PartService WHERE service_id = ?`,
            [serviceId]
        );
        return rows;
    }

    async update() {
        const { partservice_id, part_id, service_id, unit_price, quantity } = this;

        // Recalculate total_price during update
        const total_price = quantity * unit_price;

        await PartService.pool.query(
            `UPDATE PartService SET part_id = ?, service_id = ?, unit_price = ?, quantity = ?, total_price = ? 
             WHERE partservice_id = ?`,
            [part_id, service_id, unit_price, quantity, total_price, partservice_id]
        );
    }

    static async delete(partserviceId) {
        await PartService.pool.query(
            `DELETE FROM PartService WHERE partservice_id = ?`,
            [partserviceId]
        );
    }

    static async list() {
        const [rows] = await PartService.pool.query(`SELECT * FROM PartService`);
        return rows;
    }
}

module.exports = { PartService };
