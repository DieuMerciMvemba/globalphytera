import { apiFetch } from './api';

export const authService = {
  async login(email, password) {
    try {
      const data = await apiFetch('/api/v1/auth/login', {
        method: 'POST',
        body: { email, password },
      });
      const token = data?.accessToken || data?.access_token;
      if (token) {
        localStorage.setItem('token', token);
        if (data.user) {
          localStorage.setItem('technician_user', JSON.stringify(data.user));
        }
        return { ...data, access_token: token, accessToken: token };
      }
      throw new Error('Token non reçu');
    } catch (err) {
      console.error('[authService] Échec login backend:', err.message);
      throw err;
    }
  },

  async getCurrentUser() {
    try {
      const user = await apiFetch('/api/v1/auth/me');
      localStorage.setItem('technician_user', JSON.stringify(user));
      return user;
    } catch (err) {
      const saved = localStorage.getItem('technician_user');
      return saved ? JSON.parse(saved) : null;
    }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('technician_user');
  },

  getUser() {
    const saved = localStorage.getItem('technician_user');
    return saved ? JSON.parse(saved) : null;
  },

  getToken() {
    return localStorage.getItem('token');
  },
};
