const mongoose = require('mongoose');
const colors = require('colors');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL); // Removed deprecated options
        console.log(`Connected to database ${mongoose.connection.host}`.green); // Correct template literal and color usage
    } catch (error) {
        console.log(`Mongodb Database error: ${error.message}`.bgRed.white); // Correct template literal and color usage
    }
};

module.exports = connectDB;
