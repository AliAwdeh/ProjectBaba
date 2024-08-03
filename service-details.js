// service-details.js

const express = require('express');
const router = express.Router();
const db = require('./databaseconnect');
const middleware = require('./middleware');

// Route to fetch and display detailed service information
router.get('/:id', middleware.authenticateUser, async (req, res) => {
    try {
        const serviceId = req.params.id;

        // Fetch detailed service information including parts
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

        // Format the service details with parts grouped by service ID
        const formattedDetails = formatServiceDetails(serviceDetails);

        // Render the service-details page with the formatted details
        res.render('service-details', { serviceDetails: formattedDetails });
    } catch (err) {
        console.error('Error fetching service details:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Function to format service details with parts grouped by service ID
function formatServiceDetails(serviceDetails) {
    const formattedDetails = {
        ...serviceDetails[0],  // Extract the first service detail (assuming the details are the same for all rows)
        parts: [],
    };

    serviceDetails.forEach(detail => {
        formattedDetails.parts.push({
            name: detail.part_name,
            price: detail.part_price,
        });
    });

    // Add labor charge to the formatted details, defaulting to 0 if empty
    formattedDetails.labor = formattedDetails.labor || 0;

    return formattedDetails;
}

module.exports = router;
