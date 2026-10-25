import { apiFetch } from './api';

export const devicesService = {
  async getAllDevices() {
    try {
      const data = await apiFetch('/api/v1/devices');
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error('[devicesService] Erreur récupération des boîtiers réels:', err.message);
      throw err;
    }
  },

  async getDeviceById(id) {
    return await apiFetch(`/api/v1/devices/${id}`);
  },

  async updateDeviceStatus(id, status, notes = '') {
    return await apiFetch(`/api/v1/devices/${id}`, {
      method: 'PATCH',
      body: { status, notes },
    });
  },
};
