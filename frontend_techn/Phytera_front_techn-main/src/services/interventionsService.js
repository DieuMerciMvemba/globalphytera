import { apiFetch } from './api';

export const interventionsService = {
  async getAllInterventions() {
    try {
      const data = await apiFetch('/api/v1/maintenance');
      if (Array.isArray(data)) return data;
      return [];
    } catch (err) {
      console.warn('[interventionsService] Erreur API maintenance:', err.message);
      const saved = localStorage.getItem('technician_interventions');
      return saved ? JSON.parse(saved) : [
        {
          id: 'int-1',
          title: 'Installation initiale & calibration SHT45/SID12',
          farmName: 'Domaine Agricole de Mbanza',
          technicianName: 'Alexandre',
          status: 'COMPLETED',
          date: new Date().toISOString(),
          notes: 'Boîtier fixé à 1.5m de hauteur, capteurs enterrés à 15cm.',
        },
      ];
    }
  },

  async createIntervention(data) {
    try {
      return await apiFetch('/api/v1/maintenance', {
        method: 'POST',
        body: data,
      });
    } catch (err) {
      const saved = localStorage.getItem('technician_interventions');
      const list = saved ? JSON.parse(saved) : [];
      const newInt = {
        id: 'int-' + Date.now(),
        ...data,
        status: 'COMPLETED',
        date: new Date().toISOString(),
      };
      list.unshift(newInt);
      localStorage.setItem('technician_interventions', JSON.stringify(list));
      return newInt;
    }
  },
};
