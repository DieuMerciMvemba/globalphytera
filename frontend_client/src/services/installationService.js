import { apiFetch } from './api';

export const installationService = {
  // Obtenir les demandes en attente de l'agriculteur
  async getPendingRequests() {
    try {
      return await apiFetch('/api/v1/installation-requests/pending');
    } catch (err) {
      console.warn('Backend offline, return fallback pending installations:', err.message);
      const saved = localStorage.getItem('farmer_pending_installations');
      if (saved) return JSON.parse(saved);

      // Démo d'une demande par défaut si premier chargement
      return [
        {
          id: 'req-demo-1',
          fieldName: 'Champ Piments Est',
          cultureType: 'Piment',
          variety: 'Habanero',
          surfaceArea: 1200,
          serialNumber: 'SN-PHY-2026-X8F2A',
          deviceType: 'ESP32_PHYTERA',
          firmwareVersion: '1.0.0',
          status: 'PENDING',
          createdAt: new Date().toISOString(),
          technician: { nom: 'Alexandre (Technicien PhyTera)' },
          farm: { name: 'Exploitation Principale' },
        },
      ];
    }
  },

  // Accepter la proposition -> Crée le Champ et active le Boîtier !
  async acceptRequest(requestId) {
    try {
      return await apiFetch(`/api/v1/installation-requests/${requestId}/accept`, {
        method: 'POST',
      });
    } catch (err) {
      console.warn('Offline accept fallback:', err.message);
      return { status: 'ACCEPTED', requestId };
    }
  },

  // Refuser la proposition
  async rejectRequest(requestId, reason = '') {
    try {
      return await apiFetch(`/api/v1/installation-requests/${requestId}/reject`, {
        method: 'POST',
        body: { rejectionReason: reason },
      });
    } catch (err) {
      console.warn('Offline reject fallback:', err.message);
      return { status: 'REJECTED', requestId };
    }
  },
};
