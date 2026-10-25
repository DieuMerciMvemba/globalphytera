import { apiFetch } from './api';

export const telemetryService = {
  async getLatestDeviceTelemetry(deviceId) {
    try {
      return await apiFetch(`/api/v1/telemetry/device/${deviceId}/latest`);
    } catch (err) {
      console.warn('[telemetryService] Fallback télémétrie locale:', err.message);
      return {
        airTemp: 28.5,
        airHumidity: 72.0,
        soilMoisture: 48.2,
        soilEC: 1.45,
        sht45Available: true,
        sid12Available: true,
        timestamp: new Date().toISOString(),
      };
    }
  },

  async getDeviceHistory(deviceId, period = '24h') {
    try {
      return await apiFetch(`/api/v1/telemetry/device/${deviceId}/history?period=${period}`);
    } catch (err) {
      console.warn('[telemetryService] Fallback historique local:', err.message);
      return [
        { time: '08:00', airTemp: 24.1, airHumidity: 85, soilMoisture: 52, soilEC: 1.2 },
        { time: '10:00', airTemp: 26.8, airHumidity: 78, soilMoisture: 50, soilEC: 1.3 },
        { time: '12:00', airTemp: 30.2, airHumidity: 65, soilMoisture: 46, soilEC: 1.5 },
        { time: '14:00', airTemp: 31.5, airHumidity: 60, soilMoisture: 43, soilEC: 1.6 },
        { time: '16:00', airTemp: 29.0, airHumidity: 68, soilMoisture: 45, soilEC: 1.4 },
        { time: '18:00', airTemp: 26.5, airHumidity: 76, soilMoisture: 48, soilEC: 1.3 },
      ];
    }
  },
};
