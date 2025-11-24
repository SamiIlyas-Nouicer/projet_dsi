const { Book, Borrowing, User } = require('../models');
const { Op } = require('sequelize'); // For search operators

// --- Public / User ---

// --- NEW: Mark a book as returned (Admin Only) ---
exports.returnBook = async (req, res) => {
    try {
        const { borrowId } = req.body;

        // 1. Find the Borrow Record
        const borrowRecord = await Borrowing.findByPk(borrowId);
        if (!borrowRecord) return res.status(404).json({ message: "Record not found" });
        if (borrowRecord.status === 'returned') return res.status(400).json({ message: "Already returned" });

        // 2. Update Borrow Status
        borrowRecord.status = 'returned';
        borrowRecord.returnDate = new Date();
        await borrowRecord.save();

        // 3. Update Book Inventory
        const book = await Book.findByPk(borrowRecord.BookId);
        await book.increment('quantity');

        // If it was 0, it is now available again
        if (book.available === false) {
            await book.update({ available: true });
        }

        res.json({ message: "Book returned successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 1. Get Books (with Search)
exports.getAllBooks = async (req, res) => {
    try {
        const { search } = req.query;
        let queryOptions = {};

        if (search) {
            queryOptions.where = {
                title: { [Op.like]: `%${search}%` } // matches "Harry" in "Harry Potter"
            };
        }

        const books = await Book.findAll(queryOptions);
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Schedule/Borrow a Book
exports.borrowBook = async (req, res) => {
    try {
        const { bookId, dueDate } = req.body; // User sends Book ID and when they will return it
        const userId = req.userId; // From JWT middleware

        const book = await Book.findByPk(bookId);

        if (!book || !book.available || book.quantity < 1) {
            return res.status(400).json({ message: "Book not available" });
        }

        // Create Schedule Record
        await Borrowing.create({
            UserId: userId,
            BookId: bookId,
            dueDate: new Date(dueDate)
        });

        // Update Book Inventory
        await book.decrement('quantity');
        if (book.quantity === 0) await book.update({ available: false });

        res.json({ message: "Book Borrowed Successfully!" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// --- NEW: User checks their own history ---
exports.getMyBorrowedBooks = async (req, res) => {
    try {
        const userId = req.userId; // From Token
        const history = await Borrowing.findAll({
            where: { UserId: userId },
            include: [{ model: Book, attributes: ['title', 'author', 'isbn'] }]
        });
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- Admin Only ---

exports.createBook = async (req, res) => {
    try {
        const bookData = { ...req.body };

        // If an image was uploaded, save the filename
        if (req.file) {
            bookData.coverImage = req.file.filename;
        }

        const book = await Book.create(bookData);
        res.status(201).json({ message: "Book Added", book });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteBook = async (req, res) => {
    try {
        await Book.destroy({ where: { id: req.params.id } });
        res.json({ message: "Book Deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



// --- NEW: Admin monitors everything ---
exports.getAllBorrows = async (req, res) => {
    try {
        const borrows = await Borrowing.findAll({
            include: [
                { model: User, attributes: ['username', 'email'] },
                { model: Book, attributes: ['title'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(borrows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};