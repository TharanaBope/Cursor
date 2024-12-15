import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

const api = axios.create({
    baseURL: API_URL,
});

// Request interceptor for adding auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
};

export const configAPI = {
    create: (config) => api.post('/config', config),
    getAll: () => api.get('/config'),
    getById: (id) => api.get(`/config/${id}`),
};

export const systemAPI = {
    start: (configId) => api.post('/system/start', { configId }),
    stop: () => api.post('/system/stop'),
    getState: () => api.get('/system/state'),
};

export default api;