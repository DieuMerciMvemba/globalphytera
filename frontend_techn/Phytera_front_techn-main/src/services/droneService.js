import { apiFetch } from './api';

export const droneService = {
  async getAllMissions() {
    try {
      const data = await apiFetch('/api/v1/drone-missions');
      if (Array.isArray(data)) return data;
      return [];
    } catch (err) {
      console.warn('[droneService] Fallback missions locales:', err.message);
      return [
        {
          id: 'mission-1',
          name: 'Survol Multispectral Parcelle Piments',
          farmName: 'Domaine Agricole de Mbanza',
          status: 'COMPLETED',
          flightDate: new Date().toISOString(),
          resolution: '2.5 cm/px',
          ndviAverage: 0.74,
        },
      ];
    }
  },

  async createMission(data) {
    try {
      return await apiFetch('/api/v1/drone-missions', {
        method: 'POST',
        body: data,
      });
    } catch (err) {
      return { id: 'mission-' + Date.now(), ...data, status: 'SCHEDULED' };
    }
  },
};
