const pool = require('../DB/dbconnnect');

class Clients {
    constructor(data) {
        this.client_id = data.client_id || null;
        this.guid = data.guid;
        this.name = data.name;
        this.surname = data.surname;
        this.phone = data.phone;
        this.email = data.email;
        this.address = data.address;
        this.reference = data.reference || null;
    }

    static pool;
    static setPool(pool) {
        Clients.pool = pool;
    }

    async create() {
        const {name, surname, phone, email, address, reference } = this;
        const [result] = await pool.query(
            `INSERT INTO Clients (name, surname, phone, email, address, reference) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [name, surname, phone, email, address, reference]
        );
        this.client_id = result.insertId;
        return this.client_id;
    }

    static async read(clientId) {
        const [rows] = await pool.query(
            `SELECT * FROM Clients WHERE client_id = ?`,
            [clientId]
        );
        return rows[0];
    }

    static async readbyphonenumber(phone) {
        const [rows] = await pool.query(
            `SELECT * FROM Clients WHERE phone = ?`,
            [phone]
        );
        return rows;
    }

    async update() {
        const { client_id,name, surname, phone, email, address, reference } = this;
        await pool.query(
            `UPDATE Clients SET name = ?, surname = ?, phone = ?, email = ?, address = ?, reference = ? 
             WHERE client_id = ?`,
            [name, surname, phone, email, address, reference, client_id]
        );
    }

    static async delete(clientId) {
        await pool.query(
            `DELETE FROM Clients WHERE client_id = ?`,
            [clientId]
        );
    }

    static async list() {
        const [rows] = await pool.query(`SELECT * FROM Clients`);
        return rows;
    }
}
module.exports = { Clients };