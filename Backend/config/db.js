const { Sequelize } = require('sequelize');
require('dotenv').config();

// Ensure you created a database named 'library_db' in MySQL Workbench/CLI first
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false // Set to console.log to see raw SQL queries
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ MySQL Database Connected...');
    } catch (error) {
        console.error('❌ Database Connection Failed:', error);
    }
};

module.exports = { sequelize, connectDB };