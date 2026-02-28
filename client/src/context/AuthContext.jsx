import React, { createContext, useContext, useState } from 'react';
import api, { login as apiLogin, logout as apiLogout } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const stored = localStorage.getItem('user');
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    });
    const loading = false;

    const loginUser = (data) => {
        setUser(data);
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
        }
    };

    const login = async (email, password) => {
        const data = await apiLogin(email, password);
        loginUser(data);
        return data;
    };


    const register = async (formData) => {
        const { data } = await api.post('/auth/register', formData);
        loginUser(data);
        return data;
    };

    const logout = () => {
        apiLogout();
        setUser(null);
    };

    const updateProfile = async (profileData) => {
        const { data } = await api.put('/auth/profile', profileData);
        loginUser(data);
        return data;
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            register,
            updateProfile,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
