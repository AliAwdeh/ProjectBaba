const cron = require('node-cron');
const { Appointments } = require('./Models/Appointments');

// Schedule a job to run every day at midnight
cron.schedule('0 0 * * *', async () => {
    try {
        await Appointments.updateCompletedFlag();
        console.log('Updated appointment completed flags.');
    } catch (error) {
        console.error('Error updating appointment completed flags:', error);
    }
});
