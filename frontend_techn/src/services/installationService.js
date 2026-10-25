import { apiFetch } from './api';

export const installationService = {
  // Obtenir les demandes créées par le technicien
  async getMyRequests() {
    try {
      const data = await apiFetch('/api/v1/installation-requests/my-requests');
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error('[installationService] Erreur récupération demandes:', err.message);
      return [];
    }
  },

  // Proposer une nouvelle installation (Champ + Boîtier avec Serial auto-généré)
  async createRequest(data) {
    return await apiFetch('/api/v1/installation-requests', {
      method: 'POST',
      body: data,
    });
  },
};
