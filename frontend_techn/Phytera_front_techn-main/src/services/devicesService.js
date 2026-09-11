import { apiFetch } from './api';

export const devicesService = {
  async getAllDevices() {
    try {
      const data = await apiFetch('/api/v1/devices');
      if (Array.isArray(data) && data.length > 0) {
        localStorage.setItem('technician_devices_cache', JSON.stringify(data));
        return data;
      }
      const cached = localStorage.getItem('technician_devices_cache');
      return cached ? JSON.parse(cached) : (data || []);
    } catch (err) {
      console.warn('[devicesService] Backend indisponible, chargement des boîtiers locaux:', err.message);
      const cached = localStorage.getItem('technician_devices_cache');
      return cached ? JSON.parse(cached) : [
        {
          id: 'dev-demo-1',
          serialNumber: 'SN-PHY-2026-X8F2A',
          deviceKey: 'KEY_PHY_998811A',
          status: 'ACTIVE',
          firmwareVersion: '1.0.0',
          batteryLevel: 94,
          lastSeen: new Date().toISOString(),
          fieldName: 'Champ Piments Est',
          farmName: 'Domaine Agricole de Mbanza',
          sensors: { SHT45: 'OK', SID12: 'OK' },
        },
        {
          id: 'dev-demo-2',
          serialNumber: 'SN-PHY-2026-B3C91',
          deviceKey: 'KEY_PHY_442299B',
          status: 'PENDING_APPROVAL',
          firmwareVersion: '1.0.0',
          batteryLevel: 100,
          lastSeen: null,
          fieldName: 'Parcelle Maïs Nord',
          farmName: 'Exploitation Maraîchère Nsele',
          sensors: { SHT45: 'OK', SID12: 'DISCONNECTED' },
        },
      ];
    }
  },

  async getDeviceById(id) {
    try {
      return await apiFetch(`/api/v1/devices/${id}`);
    } catch (err) {
      const all = await this.getAllDevices();
      return all.find((d) => d.id === id) || null;
    }
  },

  async updateDeviceStatus(id, status, notes = '') {
    try {
      return await apiFetch(`/api/v1/devices/${id}`, {
        method: 'PATCH',
        body: { status, notes },
      });
    } catch (err) {
      console.warn('Erreur mise à jour statut boîtier:', err.message);
      return { id, status, updatedAt: new Date().toISOString() };
    }
  },
};
