import { apiFetch } from './api';

export const telemetryService = {
    async getFieldTelemetry(fieldId, limit = 100) {
        try {
            const data = await apiFetch(`/api/v1/telemetry/field/${fieldId}?limit=${limit}`);
            return Array.isArray(data) ? data : [];
        } catch (err) {
            console.error('[telemetryService] Erreur récupération télémétrie parcelle:', err.message);
            return [];
        }
    },

    async getLatestFieldTelemetry(fieldId) {
        try {
            return await apiFetch(`/api/v1/telemetry/field/${fieldId}/latest`);
        } catch (err) {
            console.error('[telemetryService] Erreur dernière mesure parcelle:', err.message);
            return null;
        }
    },

    async getDeviceTelemetry(deviceId, limit = 100) {
        try {
            const data = await apiFetch(`/api/v1/telemetry/device/${deviceId}?limit=${limit}`);
            return Array.isArray(data) ? data : [];
        } catch (err) {
            console.error('[telemetryService] Erreur télémétrie boîtier:', err.message);
            return [];
        }
    },

    async getLatestDeviceTelemetry(deviceId) {
        try {
            return await apiFetch(`/api/v1/telemetry/device/${deviceId}/latest`);
        } catch (err) {
            console.error('[telemetryService] Erreur dernière mesure boîtier:', err.message);
            return null;
        }
    },

    async acquireDeviceTelemetry(deviceId) {
        return await apiFetch(`/api/v1/telemetry/device/${deviceId}/acquire`, {
            method: 'POST',
        });
    },

    // ESP32 Batch post utility (uses x-device-key header)
    async postDeviceBatch(deviceKey, batchData) {
        return await apiFetch('/api/v1/telemetry/batch', {
            method: 'POST',
            headers: {
                'x-device-key': deviceKey,
            },
            body: batchData,
        });
    },
};
