const express = require('express');
const router = express.Router();

// 1. Import Controllers
const { register, login, logout } = require('../controllers/authController');
const {
    getAllBooks,
    borrowBook,
    createBook,
    deleteBook,
    returnBook,
    getMyBorrowedBooks,
    getAllBorrows
} = require('../controllers/bookController');

// 2. Import Middleware
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// --- AUTH ROUTES ---
router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/logout', logout);

// --- BOOK ROUTES (Order Matters!) ---

// Specific routes must go BEFORE generic routes (like /:id)
router.get('/books/my-history', verifyToken, getMyBorrowedBooks);

router.get('/books', getAllBooks); // Search
router.post('/books/borrow', verifyToken, borrowBook);

// --- ADMIN ROUTES ---
router.get('/admin/borrows', [verifyToken, isAdmin], getAllBorrows);
router.post('/admin/return', [verifyToken, isAdmin], returnBook);
router.post('/admin/books', [verifyToken, isAdmin, upload.single('coverImage')], createBook);
router.delete('/admin/books/:id', [verifyToken, isAdmin], deleteBook);

module.exports = router;