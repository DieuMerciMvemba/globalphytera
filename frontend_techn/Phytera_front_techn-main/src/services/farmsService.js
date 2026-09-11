import { apiFetch } from './api';

export const farmsService = {
  async getAllFarms() {
    try {
      const data = await apiFetch('/api/v1/farms');
      if (Array.isArray(data) && data.length > 0) {
        localStorage.setItem('technician_farms_cache', JSON.stringify(data));
        return data;
      }
      const cached = localStorage.getItem('technician_farms_cache');
      return cached ? JSON.parse(cached) : (data || []);
    } catch (err) {
      console.warn('[farmsService] API non joignable, utilisation du cache local:', err.message);
      const cached = localStorage.getItem('technician_farms_cache');
      return cached ? JSON.parse(cached) : [
        {
          id: 'farm-demo-1',
          name: 'Domaine Agricole de Mbanza',
          ownerName: 'Jean Kankonde (Agriculteur)',
          ownerId: 'farmer-user-1',
          location: 'Kasangulu, Bas-Congo',
          size: 15.5,
          fieldsCount: 4,
          devicesCount: 3,
        },
        {
          id: 'farm-demo-2',
          name: 'Exploitation Maraîchère Nsele',
          ownerName: 'Marie Tshilomba (Agriculteur)',
          ownerId: 'farmer-user-2',
          location: 'Nsele, Kinshasa',
          size: 8.2,
          fieldsCount: 2,
          devicesCount: 2,
        },
      ];
    }
  },

  async getFarmById(id) {
    try {
      return await apiFetch(`/api/v1/farms/${id}`);
    } catch (err) {
      const farms = await this.getAllFarms();
      return farms.find((f) => f.id === id) || null;
    }
  },
};
