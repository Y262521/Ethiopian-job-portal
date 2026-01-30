import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    timeout: 10000, // Increased timeout for production
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('authToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// API Functions
export const fetchJobCategories = async () => {
    try {
        const response = await api.get('/categories');
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

export const fetchFeaturedCompanies = async () => {
    try {
        const response = await api.get('/companies/featured');
        return response.data;
    } catch (error) {
        console.error('Error fetching companies:', error);
        throw error;
    }
};

export const fetchJobs = async (params = {}) => {
    try {
        const response = await api.get('/jobs', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching jobs:', error);
        throw error;
    }
};

export const fetchJobById = async (id) => {
    try {
        const response = await api.get(`/jobs/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching job:', error);
        throw error;
    }
};

export const searchJobs = async (query, filters = {}) => {
    try {
        const params = { q: query, ...filters };
        const response = await api.get('/jobs/search', { params });
        return response.data;
    } catch (error) {
        console.error('Error searching jobs:', error);
        throw error;
    }
};

export const loginUser = async (credentials) => {
    try {
        const response = await api.post('/auth/login', credentials);
        if (response.data.token) {
            localStorage.setItem('authToken', response.data.token);
        }
        return response.data;
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
};

export const registerUser = async (userData) => {
    try {
        console.log('Sending registration data:', userData);
        const response = await api.post('/auth/register', userData);
        console.log('Registration response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error registering:', error);
        console.error('Error response:', error.response?.data);
        throw error;
    }
};

export const logoutUser = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/';
};

export default api;