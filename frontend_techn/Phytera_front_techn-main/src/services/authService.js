import { apiFetch } from './api';

export const authService = {
  async login(email, password) {
    try {
      const data = await apiFetch('/api/v1/auth/login', {
        method: 'POST',
        body: { email, password },
      });
      if (data && data.access_token) {
        localStorage.setItem('token', data.access_token);
        if (data.user) {
          localStorage.setItem('technician_user', JSON.stringify(data.user));
        }
        return data;
      }
      throw new Error('Token non reçu');
    } catch (err) {
      console.warn('[authService] Échec login backend, mode démo si identifiants de test:', err.message);
      if (email.includes('techn') || email.includes('admin') || password === 'demo') {
        const mockUser = {
          id: 'techn-demo-id',
          email,
          nom: 'Alexandre Technicien',
          role: 'TECHNICIEN',
        };
        const mockToken = 'mock_jwt_technician_token';
        localStorage.setItem('token', mockToken);
        localStorage.setItem('technician_user', JSON.stringify(mockUser));
        return { access_token: mockToken, user: mockUser };
      }
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
