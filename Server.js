const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const indexRoutes = require('./Routes/IndexRoutes.js');
const models = require('./Models/ModelsIndex.js');

// Initialize the Express app
const app = express();

// Middleware setup
app.use(bodyParser.json());
app.use(cors());

// Use routes
app.use('/api', indexRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Port and server setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
