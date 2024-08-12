const pool = require('../DB/dbconnnect');

class Appointments {
    constructor(data) {
        this.appointment_id = data.appointment_id || null;
        this.client_phone = data.client_phone;
        this.plate_number = data.plate_number;
        this.appointment_date = new Date(data.appointment_date);
        this.service_details = data.service_details || null;
        this.completed = data.completed || false; // New flag
    }

    static pool;

    static setPool(pool) {
        Appointments.pool = pool;
    }

    async create() {
        const { client_phone, plate_number, appointment_date, service_details, completed } = this;
        const [result] = await Appointments.pool.query(
            `INSERT INTO Appointments (client_phone, plate_number, appointment_date, service_details, completed) 
             VALUES (?, ?, ?, ?, ?)`,
            [client_phone, plate_number, appointment_date, service_details, completed]
        );
        this.appointment_id = result.insertId; // Set the appointment_id after creation
        return this.appointment_id;
    }

    static async read(appointmentId) {
        const [rows] = await Appointments.pool.query(
            `SELECT * FROM Appointments WHERE appointment_id = ?`,
            [appointmentId]
        );
        return rows[0];
    }

    async update() {
        const { appointment_id, client_phone, plate_number, appointment_date, service_details, completed } = this;
        await Appointments.pool.query(
            `UPDATE Appointments SET client_phone = ?, plate_number = ?, appointment_date = ?, service_details = ?, completed = ? 
             WHERE appointment_id = ?`,
            [client_phone, plate_number, appointment_date, service_details, completed, appointment_id]
        );
    }

    static async delete(appointmentId) {
        await Appointments.pool.query(
            `DELETE FROM Appointments WHERE appointment_id = ?`,
            [appointmentId]
        );
    }

    static async list() {
        const [rows] = await Appointments.pool.query(`SELECT * FROM Appointments`);
        return rows;
    }

    static async getByClientPhone(phone) {
        const [rows] = await Appointments.pool.query(
            `SELECT * FROM Appointments WHERE client_phone = ?`,
            [phone]
        );
        return rows;
    }

    static async getByCarPlate(plate_number) {
        const [rows] = await Appointments.pool.query(
            `SELECT * FROM Appointments WHERE plate_number = ?`,
            [plate_number]
        );
        return rows;
    }

    static formatDateForSQL(date) {
        return date.toISOString().slice(0, 19).replace('T', ' ');
    }

    static async getAppointmentsForToday() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const [rows] = await Appointments.pool.query(
            `SELECT * FROM Appointments WHERE appointment_date >= ? AND appointment_date < ?`,
            [Appointments.formatDateForSQL(today), Appointments.formatDateForSQL(tomorrow)]
        );
        return rows;
    }

    static async getAppointmentsForTomorrow() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        const dayAfterTomorrow = new Date(tomorrow);
        dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

        const [rows] = await Appointments.pool.query(
            `SELECT * FROM Appointments WHERE appointment_date >= ? AND appointment_date < ?`,
            [Appointments.formatDateForSQL(tomorrow), Appointments.formatDateForSQL(dayAfterTomorrow)]
        );
        return rows;
    }

    static async updateCompletedFlag() {
        await Appointments.pool.query(
            `UPDATE Appointments SET completed = TRUE 
             WHERE appointment_date < NOW() - INTERVAL 1 DAY AND completed = FALSE`
        );
    }
}

module.exports = { Appointments };
