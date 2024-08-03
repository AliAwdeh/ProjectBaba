const pool = require('./dbconnect');

export class OwnershipHistory {
    constructor(data) {
        this.ownership_id = data.ownership_id || null;
        this.guid = data.guid;
        this.car_id = data.car_id;
        this.old_owner_id = data.old_owner_id || null;
        this.new_owner_id = data.new_owner_id || null;
        this.transfer_date = new Date(data.transfer_date);
    }

    async create() {
        const { guid, car_id, old_owner_id, new_owner_id, transfer_date } = this;
        const [result] = await pool.query(
            `INSERT INTO OwnershipHistory (guid, car_id, old_owner_id, new_owner_id, transfer_date) 
             VALUES (?, ?, ?, ?, ?)`,
            [guid, car_id, old_owner_id, new_owner_id, transfer_date]
        );
        this.ownership_id = result.insertId; // Set the ownership_id after creation
        return this.ownership_id;
    }

    static async read(ownershipId) {
        const [rows] = await pool.query(
            `SELECT * FROM OwnershipHistory WHERE ownership_id = ?`,
            [ownershipId]
        );
        return rows[0];
    }

    static async readall() {
        const [rows] = await pool.query(
            `SELECT * FROM OwnershipHistory`
        );
        return rows;
    }

    async update() {
        const { ownership_id, guid, car_id, old_owner_id, new_owner_id, transfer_date } = this;
        await pool.query(
            `UPDATE OwnershipHistory SET guid = ?, car_id = ?, old_owner_id = ?, new_owner_id = ?, transfer_date = ? 
             WHERE ownership_id = ?`,
            [guid, car_id, old_owner_id, new_owner_id, transfer_date, ownership_id]
        );
    }

    static async delete(ownershipId) {
        await pool.query(
            `DELETE FROM OwnershipHistory WHERE ownership_id = ?`,
            [ownershipId]
        );
    }

    static async list() {
        const [rows] = await pool.query(`SELECT * FROM OwnershipHistory`);
        return rows;
    }
}
