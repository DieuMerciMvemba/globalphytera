import { apiFetch } from './api';

export const droneService = {
  async getAllMissions() {
    try {
      const data = await apiFetch('/api/v1/drone/missions');
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error('[droneService] Erreur récupération missions drone:', err.message);
      return [];
    }
  },

  async createMission(data) {
    return await apiFetch('/api/v1/drone/missions', {
      method: 'POST',
      body: data,
    });
  },
};
