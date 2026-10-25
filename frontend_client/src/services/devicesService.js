import { apiFetch } from './api';

export const devicesService = {
    async getAllDevices() {
        try {
            const data = await apiFetch('/api/v1/devices');
            return Array.isArray(data) ? data : [];
        } catch (err) {
            console.error('[devicesService] Erreur récupération boîtiers:', err.message);
            throw err;
        }
    },

    async getDeviceById(id) {
        return await apiFetch(`/api/v1/devices/${id}`);
    },

    async registerDevice(data) {
        // dto: { serialNumber, fieldId, deviceType, firmwareVersion }
        return await apiFetch('/api/v1/devices/register', {
            method: 'POST',
            body: data,
        });
    },

    async rotateDeviceKey(id) {
        return await apiFetch(`/api/v1/devices/${id}/rotate-key`, {
            method: 'POST',
        });
    },

    async configureWifi(id, data) {
        // dto: { ssid, password, ipAddress, signalQuality }
        return await apiFetch(`/api/v1/devices/${id}/wifi`, {
            method: 'PUT',
            body: data,
        });
    },

    async removeDevice(id) {
        return await apiFetch(`/api/v1/devices/${id}`, {
            method: 'DELETE',
        });
    },
};
