// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode"; // Fix import syntax
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // On refresh, check if token exists in localStorage
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Check if token is expired
                if (decoded.exp * 1000 < Date.now()) {
                    logout();
                } else {
                    setUser(decoded);
                }
            } catch (e) {
                logout();
            }
        }
        setLoading(false);
    }, []);

    const login = (token) => {
        localStorage.setItem('token', token);
        const decoded = jwtDecode(token);
        setUser(decoded);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        window.location.href = '/login'; // Force redirect
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};