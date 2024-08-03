const pool = require('./dbconnect');

export class Cars {
    constructor(data) {
        this.car_id = data.car_id || null;
        this.plate_number = data.plate_number;
        this.guid = data.guid;
        this.make = data.make;
        this.model = data.model;
        this.year = data.year;
        this.Colour = data.Colour;
        this.vin = data.vin || null;
    }

    async create() {
        const { plate_number, guid, make, model, year, Colour, vin } = this;
        const [result] = await pool.query(
            `INSERT INTO Cars (plate_number, guid, make, model, year, Colour, vin) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [plate_number, guid, make, model, year, Colour, vin]
        );
        this.car_id = result.insertId; // Set the car_id after creation
        return this.car_id;
    }

    static async read(carId) {
        const [rows] = await pool.query(
            `SELECT * FROM Cars WHERE car_id = ?`,
            [carId]
        );
        return rows[0];
    }

    static async readall() {
        const [rows] = await pool.query(
            `SELECT * FROM Cars`
        );
        return rows;
    }

    async update() {
        const { car_id, plate_number, guid, make, model, year, Colour, vin } = this;
        await pool.query(
            `UPDATE Cars SET plate_number = ?, guid = ?, make = ?, model = ?, year = ?, Colour = ?, vin = ? 
             WHERE car_id = ?`,
            [plate_number, guid, make, model, year, Colour, vin, car_id]
        );
    }

    static async delete(carId) {
        await pool.query(
            `DELETE FROM Cars WHERE car_id = ?`,
            [carId]
        );
    }

    static async list() {
        const [rows] = await pool.query(`SELECT * FROM Cars`);
        return rows;
    }
}
