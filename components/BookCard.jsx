import PropTypes from 'prop-types';
import { useState } from 'react';

const BookCard = ({ book, onBorrow, showBorrowButton = true }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover-lift"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Gradient Overlay on Hover */}
            <div
                className={`absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'
                    }`}
            />

            {/* Book Cover */}
            <div className="h-48 relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                {book.coverImage ? (
                    <img
                        src={`http://localhost:5000/uploads/${book.coverImage}`}
                        alt={book.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="h-full bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <svg
                                className="h-24 w-24 text-white opacity-30"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                            </svg>
                        </div>
                    </div>
                )}

                {/* Availability Badge */}
                <div className="absolute top-3 right-3">
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${book.available
                            ? 'bg-green-500 text-white'
                            : 'bg-red-500 text-white'
                            }`}
                    >
                        {book.available ? '● Available' : '● Out of Stock'}
                    </span>
                </div>
            </div>

            {/* Book Info */}
            <div className="p-5 relative z-10">
                <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2 min-h-[3.5rem]">
                    {book.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 flex items-center">
                    <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    {book.author}
                </p>

                {showBorrowButton && (
                    <button
                        disabled={!book.available}
                        onClick={() => onBorrow && onBorrow(book)}
                        className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${book.available
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-xl transform hover:-translate-y-1'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        {book.available ? '📚 Borrow Now' : '🔒 Unavailable'}
                    </button>
                )}
            </div>

            {/* Shine Effect on Hover */}
            <div
                className={`absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-all duration-1000 transform ${isHovered ? 'translate-x-full' : '-translate-x-full'
                    }`}
                style={{ transitionDelay: '0.1s' }}
            />
        </div>
    );
};

BookCard.propTypes = {
    book: PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        author: PropTypes.string.isRequired,
        available: PropTypes.bool.isRequired,
        coverImage: PropTypes.string,
    }).isRequired,
    onBorrow: PropTypes.func,
    showBorrowButton: PropTypes.bool,
};

export default BookCard;
