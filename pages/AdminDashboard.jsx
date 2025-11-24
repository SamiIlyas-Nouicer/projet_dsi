import { useState, useEffect } from 'react';
import api from '../api/axios';
import StatCard from '../components/StatCard';
import { BookOpen, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';

const AdminDashboard = () => {
    const [books, setBooks] = useState([]);
    const [borrows, setBorrows] = useState([]);
    const [newBook, setNewBook] = useState({ title: '', author: '', isbn: '', quantity: 1 });
    const [coverImage, setCoverImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // --- INITIAL LOAD ---
    useEffect(() => {
        refreshData();
    }, []);

    const refreshData = () => {
        fetchBooks();
        fetchBorrows();
    };

    const fetchBooks = async () => {
        const res = await api.get('/books');
        setBooks(res.data);
    };

    const fetchBorrows = async () => {
        const res = await api.get('/admin/borrows');
        setBorrows(res.data);
    };

    // --- ACTIONS ---

    const addBook = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('title', newBook.title);
            formData.append('author', newBook.author);
            formData.append('isbn', newBook.isbn);
            formData.append('quantity', newBook.quantity);

            if (coverImage) {
                formData.append('coverImage', coverImage);
            }

            await api.post('/admin/books', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setNewBook({ title: '', author: '', isbn: '', quantity: 1 });
            setCoverImage(null);
            setImagePreview(null);
            refreshData();
        } catch (err) {
            alert("Error adding book");
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const deleteBook = async (id) => {
        if (confirm("Delete this book?")) {
            await api.delete(`/admin/books/${id}`);
            refreshData();
        }
    };

    // NEW: Handle Return
    const handleReturn = async (borrowId) => {
        if (!confirm("Confirm return of this book?")) return;
        try {
            await api.post('/admin/return', { borrowId });
            refreshData(); // Refresh tables to show updated status
        } catch (err) {
            alert("Return failed");
        }
    };

    // Calculate stats
    const totalBooks = books.reduce((sum, book) => sum + book.quantity, 0);
    const borrowedBooks = borrows.filter(b => b.status === 'borrowed').length;
    const availableBooks = books.filter(b => b.available).length;

    return (
        <div className="min-h-screen p-6" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-8 animate-fadeIn">
                    <h1 className="text-4xl font-bold mb-2">
                        <span className="text-gradient">🛡️ Admin Dashboard</span>
                    </h1>
                    <p className="text-gray-600">Manage your library inventory and monitor borrowing activity</p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        icon={BookOpen}
                        title="Total Books"
                        value={totalBooks}
                        gradient="gradient-primary"
                        delay={0}
                    />
                    <StatCard
                        icon={CheckCircle}
                        title="Available"
                        value={availableBooks}
                        gradient="gradient-success"
                        delay={100}
                    />
                    <StatCard
                        icon={TrendingUp}
                        title="Borrowed"
                        value={borrowedBooks}
                        gradient="gradient-accent"
                        delay={200}
                    />
                    <StatCard
                        icon={AlertCircle}
                        title="Active Users"
                        value={new Set(borrows.filter(b => b.status === 'borrowed').map(b => b.userId)).size}
                        gradient="gradient-ocean"
                        delay={300}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* --- LEFT: ADD BOOK --- */}
                    <div className="card-premium p-6 h-fit animate-slideInLeft">
                        <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                            <span className="text-2xl mr-2">📕</span>
                            Add New Inventory
                        </h3>
                        <form onSubmit={addBook} className="flex flex-col gap-4">
                            <input
                                className="input-premium"
                                placeholder="Book Title"
                                value={newBook.title}
                                onChange={e => setNewBook({ ...newBook, title: e.target.value })}
                                required
                            />
                            <input
                                className="input-premium"
                                placeholder="Author"
                                value={newBook.author}
                                onChange={e => setNewBook({ ...newBook, author: e.target.value })}
                                required
                            />
                            <input
                                className="input-premium"
                                placeholder="ISBN (e.g., 978-3-16-148410-0)"
                                value={newBook.isbn}
                                onChange={e => setNewBook({ ...newBook, isbn: e.target.value })}
                                required
                            />
                            <input
                                className="input-premium"
                                type="number"
                                min="1"
                                placeholder="Quantity"
                                value={newBook.quantity}
                                onChange={e => setNewBook({ ...newBook, quantity: e.target.value })}
                                required
                            />
                            <div className="space-y-3">
                                <label className="block text-sm font-semibold text-gray-700">
                                    📷 Book Cover Image
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all duration-300"
                                    required
                                />
                                {imagePreview && (
                                    <div className="mt-3">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-32 h-40 object-cover rounded-lg shadow-md"
                                        />
                                    </div>
                                )}
                            </div>
                            <button className="btn-gradient">
                                ➕ Add Book
                            </button>
                        </form>
                    </div>

                    {/* --- RIGHT: BORROW MONITOR (UPDATED) --- */}
                    <div className="card-premium p-6 overflow-hidden flex flex-col h-[500px] animate-slideInRight">
                        <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                            <span className="text-2xl mr-2">🧐</span>
                            Live Borrow Monitor
                        </h3>
                        <div className="overflow-y-auto flex-1">
                            <table className="w-full text-sm text-left border-collapse">
                                <thead className="bg-gradient-to-r from-blue-50 to-purple-50 text-gray-700 sticky top-0">
                                    <tr>
                                        <th className="p-3 font-bold">User</th>
                                        <th className="p-3 font-bold">Book</th>
                                        <th className="p-3 font-bold">Status</th>
                                        <th className="p-3 text-center font-bold">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {borrows.map(b => (
                                        <tr key={b.id} className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300">
                                            <td className="p-3 font-medium text-gray-800">{b.User?.username}</td>
                                            <td className="p-3 text-gray-600 italic">{b.Book?.title}</td>
                                            <td className="p-3">
                                                <span className={`badge ${b.status === 'borrowed' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                                                    }`}>
                                                    {b.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="p-3 text-center">
                                                {b.status === 'borrowed' && (
                                                    <button
                                                        onClick={() => handleReturn(b.id)}
                                                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-xs transition-all duration-300 transform hover:-translate-y-0.5 shadow-md"
                                                    >
                                                        ✓ Check In
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* --- BOTTOM: INVENTORY LIST --- */}
                <div className="mt-8 card-premium p-6 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
                    <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                        <span className="text-2xl mr-2">📚</span>
                        Total Inventory
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b-2 border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                                    <th className="p-4 font-bold text-gray-700">Cover</th>
                                    <th className="p-4 font-bold text-gray-700">Title</th>
                                    <th className="p-4 font-bold text-gray-700">Author</th>
                                    <th className="p-4 font-bold text-gray-700">ISBN</th>
                                    <th className="p-4 font-bold text-gray-700">Qty</th>
                                    <th className="p-4 font-bold text-gray-700">Availability</th>
                                    <th className="p-4 font-bold text-gray-700">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {books.map(book => (
                                    <tr key={book.id} className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300">
                                        <td className="p-4">
                                            {book.coverImage ? (
                                                <img
                                                    src={`http://localhost:5000/uploads/${book.coverImage}`}
                                                    alt={book.title}
                                                    className="w-12 h-16 object-cover rounded shadow-md"
                                                />
                                            ) : (
                                                <div className="w-12 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded flex items-center justify-center text-gray-500 text-xs">
                                                    📷
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 font-medium text-gray-800">{book.title}</td>
                                        <td className="p-4 text-gray-600">{book.author}</td>
                                        <td className="p-4 text-gray-500 font-mono text-sm">{book.isbn}</td>
                                        <td className="p-4 font-bold text-blue-600">{book.quantity}</td>
                                        <td className="p-4">
                                            <span className={`badge ${book.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {book.available ? "✓ In Stock" : "✗ Out of Stock"}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => deleteBook(book.id)}
                                                className="text-red-500 hover:text-red-700 font-bold text-sm bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg transition-all duration-300"
                                            >
                                                🗑️ Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;