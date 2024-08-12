const pool = require('../DB/dbconnnect');

class Parts {
    constructor(data) {
        this.part_id = data.part_id || null;
        this.name = data.name;
    }

    static pool;

    static setPool(pool) {
        Parts.pool = pool;
    }

    async create() {
        const { name } = this;
        const [result] = await Parts.pool.query(
            `INSERT INTO Parts (name) VALUES (?)`,
            [name]
        );
        this.part_id = result.insertId; // Set the part_id after creation
        return this.part_id;
    }

    static async read(partId) {
        const [rows] = await Parts.pool.query(
            `SELECT * FROM Parts WHERE part_id = ?`,
            [partId]
        );
        return rows[0];
    }

    static async readByName(name) {
        const [rows] = await Parts.pool.query(
            `SELECT * FROM Parts WHERE name = ?`,
            [name]
        );
        
        // Check if rows are found, if not return 0
        return rows.length > 0 ? rows[0] : 0;
    }
    
    static async readAll() {
        const [rows] = await Parts.pool.query(
            `SELECT * FROM Parts`
        );
        return rows;
    }

    async update() {
        const { part_id, name } = this;
        await Parts.pool.query(
            `UPDATE Parts SET name = ? WHERE part_id = ?`,
            [name, part_id]
        );
    }

    static async delete(partId) {
        await Parts.pool.query(
            `DELETE FROM Parts WHERE part_id = ?`,
            [partId]
        );
    }

    static async list() {
        const [rows] = await Parts.pool.query(`SELECT * FROM Parts`);
        return rows;
    }
}

module.exports = { Parts };
