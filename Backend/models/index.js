const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// --- User Model ---
const User = sequelize.define('User', {
    username: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('user', 'admin'), defaultValue: 'user' }
});

// --- Book Model ---
const Book = sequelize.define('Book', {
    title: { type: DataTypes.STRING, allowNull: false },
    author: { type: DataTypes.STRING, allowNull: false },
    isbn: { type: DataTypes.STRING, unique: true },
    quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
    available: { type: DataTypes.BOOLEAN, defaultValue: true },
    coverImage: { type: DataTypes.STRING, allowNull: true } // Store image filename
});

// --- Borrow/Schedule Model ---
const Borrowing = sequelize.define('Borrowing', {
    status: { type: DataTypes.ENUM('borrowed', 'returned'), defaultValue: 'borrowed' },
    dueDate: { type: DataTypes.DATE, allowNull: false }, // The "Schedule"
    returnDate: { type: DataTypes.DATE }
});

// Relationships
User.hasMany(Borrowing);
Borrowing.belongsTo(User);

Book.hasMany(Borrowing);
Borrowing.belongsTo(Book);

// Sync Database (Run this once or use {force: false})
sequelize.sync({ alter: true }).then(() => console.log("✅ Models Synced"));

module.exports = { User, Book, Borrowing };