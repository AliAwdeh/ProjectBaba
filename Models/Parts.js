const pool = require('../DB/dbconnnect');

class Parts {
    constructor(data) {
        this.part_id = data.part_id || null;
        this.guid = data.guid;
        this.name = data.name;
        this.price = data.price;
    }

    static pool;
    static setPool(pool) {
        Parts.pool = pool;
    }

    async create() {
        const {name, price } = this;
        const [result] = await pool.query(
            `INSERT INTO Parts (name, price) VALUES (?, ?)`,
            [name, price]
        );
        this.part_id = result.insertId; // Set the part_id after creation
        return this.part_id;
    }

    static async read(partId) {
        const [rows] = await pool.query(
            `SELECT * FROM Parts WHERE part_id = ?`,
            [partId]
        );
        return rows[0];
    }

    static async readall() {
        const [rows] = await pool.query(
            `SELECT * FROM Parts`
        );
        return rows;
    }

    async update() {
        const { part_id, name, price } = this;
        await pool.query(
            `UPDATE Parts SET name = ?, price = ? WHERE part_id = ?`,
            [name, price, part_id]
        );
    }

    static async delete(partId) {
        await pool.query(
            `DELETE FROM Parts WHERE part_id = ?`,
            [partId]
        );
    }

    static async list() {
        const [rows] = await pool.query(`SELECT * FROM Parts`);
        return rows;
    }
}
module.exports = { Parts };