const mysql = require('mysql2/promise'); // Ensure you're using mysql2/promise for async/await

let pool; // Declare pool here

class Cars {
    constructor(data) {
        this.car_id = data.car_id;
        this.plate_number = data.plate_number;
        this.guid = data.guid;
        this.make = data.make;
        this.model = data.model;
        this.year = data.year;
        this.Colour = data.Colour;
        this.vin = data.vin;
        this.owner_id = data.owner_id;
    }
    static pool;

    static setPool(dbPool) {
        Cars.pool = dbPool;
    }

    async create() {
        const { plate_number, make, model, year, Colour, vin, owner_id } = this;
        const [result] = await Cars.pool.query(
            `INSERT INTO Cars (plate_number, make, model, year, Colour, vin, owner_id) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [plate_number, make, model, year, Colour, vin, owner_id]
        );
        this.car_id = result.insertId; // Set the car_id after creation
        return this.car_id;
    }

    static async read(carId) {
        const [rows] = await Cars.pool.query(
            `SELECT * FROM Cars WHERE car_id = ?`,
            [carId]
        );
        return rows[0];
    }

    static async readall() {
        const [rows] = await Cars.pool.query(
            `SELECT * FROM Cars`
        );
        return rows;
    }

    async update() {
        const { car_id, plate_number, make, model, year, Colour, vin, owner_id } = this;
        await Cars.pool.query(
            `UPDATE Cars SET plate_number = ?, make = ?, model = ?, year = ?, Colour = ?, vin = ?, owner_id = ?
             WHERE car_id = ?`,
            [plate_number, make, model, year, Colour, vin, owner_id, car_id]
        );
    }

    static async delete(carId) {
        await Cars.pool.query(
            `DELETE FROM Cars WHERE car_id = ?`,
            [carId]
        );
    }

    static async list() {
        const [rows] = await Cars.pool.query(`SELECT * FROM Cars`);
        return rows;
    }
}

module.exports = { Cars };
