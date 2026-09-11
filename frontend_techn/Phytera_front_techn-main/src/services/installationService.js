import { apiFetch } from './api';

export const installationService = {
  // Obtenir les demandes créées par le technicien
  async getMyRequests() {
    try {
      return await apiFetch('/api/v1/installation-requests/my-requests');
    } catch (err) {
      console.warn('Backend indisponible, utilisation du cache local:', err.message);
      const saved = localStorage.getItem('technician_requests');
      return saved ? JSON.parse(saved) : [];
    }
  },

  // Proposer une nouvelle installation (Champ + Boîtier avec Serial auto-généré)
  async createRequest(data) {
    try {
      const res = await apiFetch('/api/v1/installation-requests', {
        method: 'POST',
        body: data,
      });
      return res;
    } catch (err) {
      console.warn('Fallback offline creation:', err.message);
      // Fallback local pour développement offline
      const year = new Date().getFullYear();
      const randomHex = Math.random().toString(16).substring(2, 8).toUpperCase();
      const autoSerial = data.serialNumber || `SN-PHY-${year}-${randomHex}`;

      const newRequest = {
        id: 'req-' + Date.now(),
        fieldName: data.fieldName,
        cultureType: data.cultureType,
        variety: data.variety || '',
        surfaceArea: data.surfaceArea || 1000,
        serialNumber: autoSerial,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        farm: { name: 'Exploitation Client' },
      };

      const saved = localStorage.getItem('technician_requests');
      const requests = saved ? JSON.parse(saved) : [];
      requests.unshift(newRequest);
      localStorage.setItem('technician_requests', JSON.stringify(requests));
      return newRequest;
    }
  },
};
