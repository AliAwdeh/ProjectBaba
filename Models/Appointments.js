const pool = require('../DB/dbconnnect');

class Appointments {
    constructor(data) {
        this.appointment_id = data.appointment_id || null;
        this.guid = data.guid;
        this.client_id = data.client_id;
        this.car_id = data.car_id;
        this.appointment_date = new Date(data.appointment_date);
        this.service_details = data.service_details || null;
    }
    static pool;
    static setPool(pool) {
        Appointments.pool = pool;
    }
    
    async create() {
        const { guid, client_id, car_id, appointment_date, service_details } = this;
        const [result] = await pool.query(
            `INSERT INTO Appointments (guid, client_id, car_id, appointment_date, service_details) 
             VALUES (?, ?, ?, ?, ?)`,
            [guid, client_id, car_id, appointment_date, service_details]
        );
        this.appointment_id = result.insertId; // Set the appointment_id after creation
        return this.appointment_id;
    }

    static async read(appointmentId) {
        const [rows] = await pool.query(
            `SELECT * FROM Appointments WHERE appointment_id = ?`,
            [appointmentId]
        );
        return rows[0];
    }

    static async readall() {
        const [rows] = await pool.query(
            `SELECT * FROM Appointments`
        );
        return rows;
    }

    async update() {
        const { appointment_id, guid, client_id, car_id, appointment_date, service_details } = this;
        await pool.query(
            `UPDATE Appointments SET guid = ?, client_id = ?, car_id = ?, appointment_date = ?, service_details = ? 
             WHERE appointment_id = ?`,
            [guid, client_id, car_id, appointment_date, service_details, appointment_id]
        );
    }

    static async delete(appointmentId) {
        await pool.query(
            `DELETE FROM Appointments WHERE appointment_id = ?`,
            [appointmentId]
        );
    }

    static async list() {
        const [rows] = await pool.query(`SELECT * FROM Appointments`);
        return rows;
    }
}
module.exports = { Appointments };