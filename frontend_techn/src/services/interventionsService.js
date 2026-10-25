import { apiFetch } from './api';

export const interventionsService = {
  async getAllInterventions() {
    try {
      const data = await apiFetch('/api/v1/maintenance');
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error('[interventionsService] Erreur API maintenance:', err.message);
      return [];
    }
  },

  async createIntervention(data) {
    return await apiFetch('/api/v1/maintenance', {
      method: 'POST',
      body: data,
    });
  },
};
