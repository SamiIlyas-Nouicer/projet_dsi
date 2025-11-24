import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, LogOut, User, Shield } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);

    // Scroll effect for glassmorphism
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Don't show navbar on login page
    if (location.pathname === '/login' || !user) {
        return null;
    }

    const isAdmin = user?.role === 'admin';

    return (
        <nav
            className={`sticky top-0 z-50 transition-all duration-300 animate-slideInLeft ${scrolled
                    ? 'glass-strong shadow-2xl'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Logo & Title */}
                    <Link to="/" className="flex items-center space-x-3 hover:opacity-90 transition-all duration-300 hover-scale">
                        <div className="bg-white bg-opacity-20 p-2 rounded-xl backdrop-blur-sm">
                            <BookOpen className="h-8 w-8 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-white text-xl font-bold tracking-tight">LibraryApp</span>
                            <span className="text-white text-opacity-80 text-xs">Digital Book Management</span>
                        </div>
                    </Link>

                    {/* Right Side: User Info & Actions */}
                    <div className="flex items-center space-x-3">

                        {/* User Badge */}
                        <div className="hidden sm:flex items-center space-x-2 bg-white bg-opacity-10 backdrop-blur-sm px-4 py-2 rounded-full border border-white border-opacity-20">
                            {isAdmin ? (
                                <div className="bg-yellow-400 bg-opacity-30 p-1.5 rounded-full">
                                    <Shield className="h-4 w-4 text-yellow-200" />
                                </div>
                            ) : (
                                <div className="bg-blue-400 bg-opacity-30 p-1.5 rounded-full">
                                    <User className="h-4 w-4 text-white" />
                                </div>
                            )}
                            <div className="flex flex-col">
                                <span className="text-white text-sm font-semibold">
                                    {user?.username || 'User'}
                                </span>
                                <span className="text-white text-opacity-70 text-xs">
                                    {isAdmin ? 'Administrator' : 'Member'}
                                </span>
                            </div>
                        </div>

                        {/* Admin Dashboard Link (only for admins) */}
                        {isAdmin && location.pathname !== '/admin' && (
                            <Link
                                to="/admin"
                                className="hidden md:flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                            >
                                <Shield className="h-4 w-4" />
                                <span>Dashboard</span>
                            </Link>
                        )}

                        {/* Home Link (when on admin page) */}
                        {location.pathname === '/admin' && (
                            <Link
                                to="/"
                                className="hidden md:flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                            >
                                <BookOpen className="h-4 w-4" />
                                <span>Catalog</span>
                            </Link>
                        )}

                        {/* Logout Button */}
                        <button
                            onClick={logout}
                            className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                        >
                            <LogOut className="h-4 w-4" />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile User Info (visible only on small screens) */}
            <div className="sm:hidden bg-white bg-opacity-10 backdrop-blur-sm px-4 py-2 flex items-center justify-between border-t border-white border-opacity-10">
                <div className="flex items-center space-x-2">
                    {isAdmin ? (
                        <Shield className="h-4 w-4 text-yellow-300" />
                    ) : (
                        <User className="h-4 w-4 text-white" />
                    )}
                    <span className="text-white text-sm font-semibold">
                        {user?.username} • {isAdmin ? 'Admin' : 'Member'}
                    </span>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;