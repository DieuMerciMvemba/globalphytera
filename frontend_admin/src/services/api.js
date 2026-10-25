import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

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

export const authService = {
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data?.accessToken) {
      localStorage.setItem('token', res.data.accessToken);
      localStorage.setItem('user', JSON.stringify(res.data.user));
    }
    return res.data;
  },
  getProfile: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export const reportService = {
  // Récupère les tickets réels depuis le backend NestJS
  getAll: async () => {
    const res = await api.get('/maintenance/tickets');
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/maintenance/tickets/${id}`);
    return res.data;
  },
  assignTechnician: async (ticketId, technicianId) => {
    const res = await api.patch(`/maintenance/tickets/${ticketId}`, { technicianId });
    return res.data;
  },
  updateStatus: async (ticketId, status, resolutionNote) => {
    const res = await api.patch(`/maintenance/tickets/${ticketId}`, { status, resolutionNote });
    return res.data;
  },
};

export const technicianService = {
  getAll: async () => {
    const res = await api.get('/users?role=TECHNICIEN');
    return res.data;
  },
  getFarmers: async () => {
    const res = await api.get('/users?role=AGRICULTEUR');
    return res.data;
  },
};

export const iotService = {
  getAll: async () => {
    const res = await api.get('/devices');
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/devices/${id}`);
    return res.data;
  },
};

export const alertService = {
  getAll: async () => {
    const res = await api.get('/alerts');
    return res.data;
  },
  resolve: async (id, resolutionNote) => {
    const res = await api.post(`/alerts/${id}/resolve`, { resolutionNote });
    return res.data;
  },
};

export default api;
