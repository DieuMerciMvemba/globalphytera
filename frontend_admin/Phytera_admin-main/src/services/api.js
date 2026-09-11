import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor for Auth Token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const reportService = {
    getAll: () => api.get('/reports'),
    getById: (id) => api.get(`/reports/${id}`),
    assignTechnician: (reportId, technicianId) => api.post(`/reports/${reportId}/assign`, { technicianId }),
};

export const technicianService = {
    getAll: () => api.get('/technicians'),
    updateStatus: (id, status) => api.patch(`/technicians/${id}/status`, { status }),
};

export const iotService = {
    getAll: () => api.get('/sensors'),
};

export default api;
