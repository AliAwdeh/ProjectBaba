const pool = require('../DB/dbconnnect');

class OwnershipHistory {
    constructor(data) {
        this.ownership_id = data.ownership_id || null;
        this.plate_number = data.plate_number;
        this.old_owner_phone = data.old_owner_phone || null;
        this.new_owner_phone = data.new_owner_phone || null;
        this.transfer_date = new Date(data.transfer_date);
    }

    static pool;

    static setPool(pool) {
        OwnershipHistory.pool = pool;
    }

    async create() {
        const { plate_number, old_owner_phone, new_owner_phone, transfer_date } = this;
        const [result] = await OwnershipHistory.pool.query(
            `INSERT INTO OwnershipHistory (plate_number, old_owner_phone, new_owner_phone, transfer_date) 
             VALUES (?, ?, ?, ?)`,
            [plate_number, old_owner_phone, new_owner_phone, transfer_date]
        );
        this.ownership_id = result.insertId; // Set the ownership_id after creation
        return this.ownership_id;
    }

    static async read(ownershipId) {
        const [rows] = await OwnershipHistory.pool.query(
            `SELECT * FROM OwnershipHistory WHERE ownership_id = ?`,
            [ownershipId]
        );
        return rows[0];
    }

    static async readAll() {
        const [rows] = await OwnershipHistory.pool.query(
            `SELECT * FROM OwnershipHistory`
        );
        return rows;
    }

    async update() {
        const { ownership_id, plate_number, old_owner_phone, new_owner_phone, transfer_date } = this;
        await OwnershipHistory.pool.query(
            `UPDATE OwnershipHistory SET plate_number = ?, old_owner_phone = ?, new_owner_phone = ?, transfer_date = ? 
             WHERE ownership_id = ?`,
            [plate_number, old_owner_phone, new_owner_phone, transfer_date, ownership_id]
        );
    }

    static async delete(ownershipId) {
        await OwnershipHistory.pool.query(
            `DELETE FROM OwnershipHistory WHERE ownership_id = ?`,
            [ownershipId]
        );
    }

    static async list() {
        const [rows] = await OwnershipHistory.pool.query(`SELECT * FROM OwnershipHistory`);
        return rows;
    }
}

module.exports = { OwnershipHistory };
