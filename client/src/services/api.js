import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to add the auth token to headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};


export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

export const sendResetOTP = async (email) => {
    return await api.post('/auth/forgot-password-otp', { email });
};

export const resetPassword = async (email, otpCode, newPassword) => {
    return await api.post('/auth/reset-password', { email, otpCode, newPassword });
};

export default api;
