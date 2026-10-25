import { apiFetch } from './api';

export const fieldsService = {
  async getFields(farmId) {
    try {
      const query = farmId ? `?farmId=${encodeURIComponent(farmId)}` : '';
      const data = await apiFetch(`/api/v1/fields${query}`);
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error('[fieldsService] Erreur récupération parcelles:', err.message);
      return [];
    }
  },

  async getFieldById(id) {
    return await apiFetch(`/api/v1/fields/${id}`);
  },
};
