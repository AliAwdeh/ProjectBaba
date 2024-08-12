const mysql = require('mysql2/promise'); // Ensure you're using mysql2/promise for async/await

let pool; // Declare pool here

class Cars {
    constructor(data) {
        this.plate_number = data.plate_number;
        this.make = data.make;
        this.model = data.model;
        this.year = data.year;
        this.colour = data.colour; // Fixed the casing for consistency
        this.vin = data.vin;
        this.owner_phone = data.owner_phone;
        this.odometer = data.odometer; // Added odometer attribute
    }

    static pool;

    static setPool(dbPool) {
        Cars.pool = dbPool;
    }

    async create() {
        const { plate_number, make, model, year, colour, vin, owner_phone, odometer } = this;
        const [result] = await Cars.pool.query(
            `INSERT INTO Cars (plate_number, make, model, year, colour, vin, owner_phone, odometer) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [plate_number, make, model, year, colour, vin, owner_phone, odometer]
        );
        return plate_number; // Returning plate_number as it is the primary key
    }

    static async read(plate_number) {
        const [rows] = await Cars.pool.query(
            `SELECT * FROM Cars WHERE plate_number = ?`,
            [plate_number]
        );
        return rows[0];
    }

    static async readByOwnerPhone(owner_phone) {
        const [rows] = await Cars.pool.query(
            `SELECT * FROM Cars WHERE owner_phone = ?`,
            [owner_phone]
        );
        return rows;
    }

    async update() {
        const { plate_number, make, model, year, colour, vin, owner_phone, odometer } = this;
        await Cars.pool.query(
            `UPDATE Cars SET make = ?, model = ?, year = ?, colour = ?, vin = ?, owner_phone = ?, odometer = ?
             WHERE plate_number = ?`,
            [make, model, year, colour, vin, owner_phone, odometer, plate_number]
        );
    }

    static async delete(plate_number) {
        await Cars.pool.query(
            `DELETE FROM Cars WHERE plate_number = ?`,
            [plate_number]
        );
    }

    static async list() {
        const [rows] = await Cars.pool.query(`SELECT * FROM Cars`);
        return rows;
    }
}

module.exports = { Cars };
