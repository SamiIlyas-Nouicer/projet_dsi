import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { BookOpen, Mail, Lock, User, Sparkles } from 'lucide-react';

const Login = () => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isRegistering) {
                // --- REGISTER FLOW ---
                await api.post('/auth/register', {
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                });
                toast.success("🎉 Registration successful! Please login.");
                setIsRegistering(false);
                setFormData({ username: '', email: '', password: '' });
            } else {
                // --- LOGIN FLOW ---
                const res = await api.post('/auth/login', {
                    email: formData.email,
                    password: formData.password
                });

                // Save token via Context (toast is in AuthContext)
                login(res.data.token);

                // Redirect based on Role
                if (res.data.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 animate-gradient"></div>

            {/* Floating Orbs */}
            <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
            <div className="absolute bottom-20 right-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>

            {/* Main Card */}
            <div className="glass-strong rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative z-10 animate-scaleIn">

                {/* Header */}
                <div className="gradient-primary p-8 text-white text-center relative overflow-hidden">
                    {/* Sparkle Effect */}
                    <div className="absolute inset-0 opacity-10">
                        <Sparkles className="absolute top-4 left-8 h-6 w-6 animate-pulse" />
                        <Sparkles className="absolute bottom-6 right-12 h-4 w-4 animate-pulse" style={{ animationDelay: '0.5s' }} />
                        <Sparkles className="absolute top-1/2 right-6 h-5 w-5 animate-pulse" style={{ animationDelay: '1s' }} />
                    </div>

                    <div className="flex justify-center mb-4 relative animate-float">
                        <div className="bg-white bg-opacity-20 p-4 rounded-2xl backdrop-blur-sm">
                            <BookOpen className="h-16 w-16" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold mb-2">LibraryApp</h2>
                    <p className="text-white text-opacity-90 text-sm">
                        {isRegistering ? "Create your account" : "Welcome back!"}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-5 bg-white bg-opacity-95 backdrop-blur-sm">

                    {/* Username (only for registration) */}
                    {isRegistering && (
                        <div className="animate-fadeIn">
                            <label className="block text-gray-700 font-semibold mb-2 text-sm">
                                Username
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Choose a username"
                                    onChange={handleChange}
                                    value={formData.username}
                                    required
                                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
                                />
                            </div>
                        </div>
                    )}

                    {/* Email */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2 text-sm">
                            Email Address
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            </div>
                            <input
                                type="email"
                                name="email"
                                placeholder="your.email@example.com"
                                onChange={handleChange}
                                value={formData.email}
                                required
                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2 text-sm">
                            Password
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            </div>
                            <input
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                onChange={handleChange}
                                value={formData.password}
                                required
                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full gradient-primary text-white py-3 rounded-xl font-bold hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1 active:translate-y-0"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Processing...
                            </span>
                        ) : (
                            <span className="flex items-center justify-center">
                                {isRegistering ? "🚀 Create Account" : "🔓 Login"}
                            </span>
                        )}
                    </button>
                </form>

                {/* Toggle Link */}
                <div className="px-8 pb-8 bg-white bg-opacity-95 backdrop-blur-sm text-center">
                    <div className="pt-4 border-t border-gray-200">
                        <p className="text-gray-600 text-sm">
                            {isRegistering ? "Already have an account?" : "New to LibraryApp?"}
                            <button
                                type="button"
                                className="ml-2 text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
                                onClick={() => {
                                    setIsRegistering(!isRegistering);
                                    setFormData({ username: '', email: '', password: '' });
                                }}
                            >
                                {isRegistering ? "Login here" : "Create account"}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;