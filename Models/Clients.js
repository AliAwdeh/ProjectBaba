const pool = require('../DB/dbconnnect');

class Clients {
    constructor(data) {
        this.phone = data.phone;
        this.name = data.name;
        this.surname = data.surname;
        this.email = data.email;
        this.address = data.address;
        this.reference = data.reference || null;
    }

    static pool;

    static setPool(pool) {
        Clients.pool = pool;
    }

    async create() {
        const { name, surname, phone, email, address, reference } = this;
        await pool.query(
            `INSERT INTO Clients (phone, name, surname, email, address, reference) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [phone, name, surname, email, address, reference]
        );
        return phone; // Returning phone as it is the primary key
    }

    static async read(phone) {
        const [rows] = await pool.query(
            `SELECT * FROM Clients WHERE phone = ?`,
            [phone]
        );
        return rows[0];
    }

    async update() {
        const { phone, name, surname, email, address, reference } = this;
        await pool.query(
            `UPDATE Clients SET name = ?, surname = ?, email = ?, address = ?, reference = ? 
             WHERE phone = ?`,
            [name, surname, email, address, reference, phone]
        );
    }

    static async delete(phone) {
        await pool.query(
            `DELETE FROM Clients WHERE phone = ?`,
            [phone]
        );
    }

    static async list() {
        const [rows] = await pool.query(`SELECT * FROM Clients`);
        return rows;
    }
}

module.exports = { Clients };
