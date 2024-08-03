// admin-dashboard.js

const express = require('express');
const router = express.Router();
const db = require('./databaseconnect');
const middleware = require('./middleware');

const ITEMS_PER_PAGE = 10;

router.get('/', middleware.authenticateAdmin, async (req, res) => {
    try {
        const [serviceHistory] = await db.promise().query(`
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

        const page = +req.query.page || 1;
        const totalItems = serviceHistory.length;
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
        const startIndex = (page - 1) * ITEMS_PER_PAGE;
        const endIndex = page * ITEMS_PER_PAGE;

        const paginatedServiceHistory = serviceHistory.slice(startIndex, endIndex);

        res.render('history', {
            serviceHistory: paginatedServiceHistory || [],
            currentPage: page,
            totalPages: totalPages,
        });
    } catch (err) {
        console.error('Error fetching service history for admin dashboard:', err);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/:id', middleware.authenticateAdmin, async (req, res) => {
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
        console.error('Error fetching service details for admin:', err);
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
