// src/pages/UserHome.jsx
import { useState, useEffect } from 'react';
import api from '../api/axios';
import BookCard from '../components/BookCard';
import { Search, Calendar, X } from 'lucide-react';

const UserHome = () => {
    const [books, setBooks] = useState([]);
    const [myBorrows, setMyBorrows] = useState([]);
    const [search, setSearch] = useState('');
    const [borrowingBook, setBorrowingBook] = useState(null);
    const [dueDate, setDueDate] = useState('');
    const [loading, setLoading] = useState(true);

    // Fetch data on mount and when search changes
    useEffect(() => {
        fetchBooks();
        fetchMyHistory();
    }, [search]);

    const fetchBooks = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/books?search=${search}`);
            setBooks(res.data);
        } catch (err) {
            console.error("Failed to load books");
        } finally {
            setLoading(false);
        }
    };

    const fetchMyHistory = async () => {
        try {
            const res = await api.get('/books/my-history');
            setMyBorrows(res.data);
        } catch (err) {
            console.error("Failed to load history");
        }
    };

    const confirmBorrow = async (e) => {
        e.preventDefault();
        try {
            await api.post('/books/borrow', { bookId: borrowingBook.id, dueDate });
            setBorrowingBook(null);
            setDueDate(''); // Reset date
            fetchBooks();     // Update catalog availability
            fetchMyHistory(); // Update "My Books" list
        } catch (err) {
            alert(err.response?.data?.message || "Borrow failed");
        }
    };

    return (
        <div className="min-h-screen p-6" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
            <div className="max-w-7xl mx-auto">

                {/* --- SECTION 1: MY BORROWED BOOKS --- */}
                <div className="card-premium p-6 mb-8 animate-fadeIn">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                        <span className="text-gradient">📖 My Borrowed Books</span>
                    </h2>
                    {myBorrows.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="text-6xl mb-4">📚</div>
                            <p className="text-gray-500">You haven't borrowed any books yet.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b-2 border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                                        <th className="p-4 font-bold text-gray-700">Book Title</th>
                                        <th className="p-4 font-bold text-gray-700">Status</th>
                                        <th className="p-4 font-bold text-gray-700">Due Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {myBorrows.map((record, index) => {
                                        // Logic to check if book is late
                                        const isOverdue = new Date() > new Date(record.dueDate) && record.status === 'borrowed';

                                        return (
                                            <tr
                                                key={record.id}
                                                className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300"
                                                style={{
                                                    animation: 'fadeIn 0.6s ease-out forwards',
                                                    animationDelay: `${index * 0.1}s`,
                                                    opacity: 0
                                                }}
                                            >
                                                <td className="p-4 font-medium text-gray-800">{record.Book?.title}</td>
                                                <td className="p-4">
                                                    {/* Status Badge with Overdue Logic */}
                                                    <span className={`badge ${record.status === 'returned' ? 'bg-green-100 text-green-800' :
                                                            isOverdue ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {record.status === 'returned' ? "✓ RETURNED" : isOverdue ? "⚠ OVERDUE" : "📖 BORROWED"}
                                                    </span>
                                                </td>
                                                <td className={`p-4 ${isOverdue ? 'text-red-600 font-bold' : 'text-gray-500'}`}>
                                                    {new Date(record.dueDate).toLocaleDateString()}
                                                    {isOverdue && <span className="ml-2 text-xs text-red-500">(Late!)</span>}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* --- SECTION 2: CATALOG HEADER --- */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 animate-slideInRight">
                    <h2 className="text-4xl font-bold">
                        <span className="text-gradient">📚 Library Catalog</span>
                    </h2>

                    {/* Search Bar */}
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search books by title or author..."
                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 shadow-md"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* --- SECTION 3: BOOK GRID --- */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="skeleton h-96 rounded-2xl"></div>
                        ))}
                    </div>
                ) : books.length === 0 ? (
                    <div className="text-center py-16 card-premium">
                        <div className="text-8xl mb-4">🔍</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">No books found</h3>
                        <p className="text-gray-600">Try adjusting your search query</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {books.map((book, index) => (
                            <div
                                key={book.id}
                                style={{
                                    animation: 'fadeIn 0.6s ease-out forwards',
                                    animationDelay: `${index * 0.05}s`,
                                    opacity: 0
                                }}
                            >
                                <BookCard
                                    book={book}
                                    onBorrow={setBorrowingBook}
                                    showBorrowButton={true}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* --- BORROW MODAL --- */}
                {borrowingBook && (
                    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fadeIn">
                        <div className="glass-strong rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-scaleIn">
                            {/* Modal Header */}
                            <div className="gradient-primary p-6 text-white relative">
                                <button
                                    onClick={() => setBorrowingBook(null)}
                                    className="absolute top-4 right-4 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all duration-300"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                                <h3 className="text-2xl font-bold mb-2">Borrow Book</h3>
                                <p className="text-white text-opacity-90 text-sm">"{borrowingBook.title}"</p>
                            </div>

                            {/* Modal Body */}
                            <form onSubmit={confirmBorrow} className="p-6 bg-white bg-opacity-95">
                                <label className="block text-gray-700 font-semibold mb-3 flex items-center">
                                    <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                                    Return Date:
                                </label>
                                <input
                                    type="date"
                                    required
                                    min={new Date().toISOString().split('T')[0]} // Prevent past dates
                                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 mb-6"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                />
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setBorrowingBook(null)}
                                        className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-all duration-300"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 gradient-primary text-white py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                                    >
                                        ✓ Confirm
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserHome;