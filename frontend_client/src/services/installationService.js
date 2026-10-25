import { apiFetch } from './api';

export const installationService = {
  // Obtenir les demandes en attente de l'agriculteur (données réelles uniquement)
  async getPendingRequests() {
    const data = await apiFetch('/api/v1/installation-requests/pending');
    return Array.isArray(data) ? data : [];
  },

  // Accepter la proposition -> Crée le Champ et active le Boîtier
  async acceptRequest(requestId) {
    return apiFetch(`/api/v1/installation-requests/${requestId}/accept`, {
      method: 'POST',
    });
  },

  // Refuser la proposition
  async rejectRequest(requestId, reason = '') {
    return apiFetch(`/api/v1/installation-requests/${requestId}/reject`, {
      method: 'POST',
      body: { rejectionReason: reason },
    });
  },
};
