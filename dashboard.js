// dashboard.js

const express = require('express');
const router = express.Router();
const db = require('./databaseconnect');
const middleware = require('./middleware');

const ITEMS_PER_PAGE = 10;

router.get('/', middleware.authenticateUser, async (req, res) => {
    try {
        let serviceHistory;
        let carStats = {};
        
        if (req.session.userType === 'customer') {
            [serviceHistory] = await db.promise().query(`
                SELECT 
                    services.*, 
                    cars.plate_number,
                    cars.colour,
                    cars.make,
                    cars.brand,
                    cars.year_of_production,
                    GROUP_CONCAT(parts.part_name SEPARATOR ', ') AS changed_parts,
                    SUM(parts.part_price) AS total_parts_price
                FROM services
                JOIN cars ON services.car_id = cars.id
                LEFT JOIN serviceparts ON services.id = serviceparts.service_id
                LEFT JOIN parts ON serviceparts.part_id = parts.id
                WHERE cars.owner_id = ?
                GROUP BY services.id
            `, [req.session.userId]);

            const [carStatsResult] = await db.promise().query(`
                SELECT 
                    MIN(service_date) AS firstServiceDate,
                    MIN(odometer) AS firstOdometer,
                    MAX(service_date) AS lastServiceDate,
                    MAX(odometer) AS lastOdometer,
                    COUNT(*) AS totalServices
                FROM services
                WHERE car_id IN (SELECT id FROM cars WHERE owner_id = ?)
            `, [req.session.userId]);

            carStats = carStatsResult[0] || {};
        } else if (req.session.userType === 'admin') {
            [serviceHistory] = await db.promise().query(`
                SELECT 
                    services.*, 
                    cars.plate_number,
                    cars.colour,
                    cars.make,
                    cars.brand,
                    cars.year_of_production,
                    GROUP_CONCAT(parts.part_name SEPARATOR ', ') AS changed_parts,
                    SUM(parts.part_price) AS total_parts_price
                FROM services
                JOIN cars ON services.car_id = cars.id
                LEFT JOIN serviceparts ON services.id = serviceparts.service_id
                LEFT JOIN parts ON serviceparts.part_id = parts.id
                GROUP BY services.id
            `);

            const [carStatsResult] = await db.promise().query(`
                SELECT 
                    car_id,
                    MIN(service_date) AS firstServiceDate,
                    MIN(odometer) AS firstOdometer,
                    MAX(service_date) AS lastServiceDate,
                    MAX(odometer) AS lastOdometer,
                    COUNT(*) AS totalServices
                FROM services
                GROUP BY car_id
            `);

            carStats = {};
        }

        const totalOutstanding = serviceHistory.reduce((total, service) => total + parseFloat(service.outstanding), 0);

        const page = +req.query.page || 1;
        const totalItems = serviceHistory.length;
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
        const startIndex = (page - 1) * ITEMS_PER_PAGE;
        const endIndex = page * ITEMS_PER_PAGE;

        const paginatedServiceHistory = serviceHistory.slice(startIndex, endIndex);

        const [userCarsResult] = await db.promise().query(`
            SELECT id, make, brand, plate_number
            FROM cars
            WHERE owner_id = ?
        `, [req.session.userId]);

        const userCars = userCarsResult || [];

        res.render('dashboard', {
            serviceHistory: paginatedServiceHistory || [],
            carStats: carStats || {},
            totalOutstanding: totalOutstanding || 0,
            userCars: userCars || [],
            currentPage: page,
            totalPages: totalPages,
        });
    } catch (err) {
        console.error('Error fetching service history for dashboard:', err);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/:id', middleware.authenticateUser, async (req, res) => {
    try {
        const serviceId = req.params.id;
        const [serviceDetails] = await db.promise().query(`
            SELECT 
                services.*, 
                cars.plate_number,
                parts.part_name,
                parts.part_price
            FROM services
            JOIN cars ON services.car_id = cars.id
            LEFT JOIN serviceparts ON services.id = serviceparts.service_id
            LEFT JOIN parts ON serviceparts.part_id = parts.id
            WHERE services.id = ?
            GROUP BY services.id, parts.id
        `, [serviceId]);

        res.render('service-details', { serviceDetails: formatServiceDetails(serviceDetails) });
    } catch (err) {
        console.error('Error fetching service details:', err);
        res.status(500).send('Internal Server Error');
    }
});

function formatServiceDetails(serviceDetails) {
    const formattedDetails = {
        ...serviceDetails[0],
        parts: [],
    };

    serviceDetails.forEach(detail => {
        formattedDetails.parts.push({
            name: detail.part_name,
            price: detail.part_price,
        });
    });

    return formattedDetails;
}

module.exports = router;
