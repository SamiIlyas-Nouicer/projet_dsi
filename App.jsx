import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Navbar from './components/Navbar';
import LoadingSpinner from './components/LoadingSpinner';
import Login from './pages/Login';
import UserHome from './pages/UserHome';
import AdminDashboard from './pages/AdminDashboard';

// Protected Route Logic
const ProtectedRoute = ({ children, role }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <LoadingSpinner fullScreen={true} size="lg" color="primary" />;
    }

    if (!user) return <Navigate to="/login" />;
    if (role && user.role !== role) return <Navigate to="/" />;
    return children;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                {/* Navbar globale */}
                <Navbar />

                {/* Contenu principal */}
                <div className="min-h-screen">
                    <Routes>
                        {/* Route publique */}
                        <Route path="/login" element={<Login />} />

                        {/* Route Admin (protégée) */}
                        <Route
                            path="/admin"
                            element={
                                <ProtectedRoute role="admin">
                                    <AdminDashboard />
                                </ProtectedRoute>
                            }
                        />

                        {/* Route User (protégée) */}
                        <Route
                            path="/"
                            element={
                                <ProtectedRoute>
                                    <UserHome />
                                </ProtectedRoute>
                            }
                        />

                        {/* Route 404 - Redirection */}
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </div>

                {/* Toast Container - Notifications globales */}
                <ToastContainer
                    position="bottom-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={true}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="colored"
                    limit={3}
                    style={{ zIndex: 9999 }}
                />
            </Router>
        </AuthProvider>
    );
}

export default App;