import { apiFetch } from './api';

export const maintenanceService = {
    async createTicket(data) {
        // dto: { deviceId, title, issueDescription, interventionDate }
        return await apiFetch('/api/v1/maintenance/tickets', {
            method: 'POST',
            body: data,
        });
    },

    async updateTicket(id, data) {
        // dto: { status, resolutionNote, interventionDate }
        return await apiFetch(`/api/v1/maintenance/tickets/${id}`, {
            method: 'PATCH',
            body: data,
        });
    },

    async getMyInterventions() {
        const data = await apiFetch('/api/v1/maintenance/my-interventions');
        return Array.isArray(data) ? data : [];
    },

    async getDeviceTickets(deviceId) {
        const data = await apiFetch(`/api/v1/maintenance/device/${deviceId}`);
        return Array.isArray(data) ? data : [];
    },
};
