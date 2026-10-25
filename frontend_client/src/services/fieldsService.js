import { apiFetch } from './api';

export const fieldsService = {
    async getFields(farmId) {
        try {
            const query = farmId ? `?farmId=${encodeURIComponent(farmId)}` : '';
            const data = await apiFetch(`/api/v1/fields${query}`);
            return Array.isArray(data) ? data : [];
        } catch (err) {
            console.error('[fieldsService] Erreur récupération parcelles:', err.message);
            throw err;
        }
    },

    async getFieldById(id) {
        return await apiFetch(`/api/v1/fields/${id}`);
    },

    async createField(data) {
        // dto: { name, description, farmId, locationPolygon, surfaceArea, cultureType, variety, timezone, configLocal }
        return await apiFetch('/api/v1/fields', {
            method: 'POST',
            body: data,
        });
    },

    async updateField(id, data) {
        return await apiFetch(`/api/v1/fields/${id}`, {
            method: 'PUT',
            body: data,
        });
    },

    async deleteField(id) {
        return await apiFetch(`/api/v1/fields/${id}`, {
            method: 'DELETE',
        });
    },

    // Field Agronomic Rules
    async getFieldRules(fieldId) {
        try {
            return await apiFetch(`/api/v1/fields/${fieldId}/rules`);
        } catch (err) {
            return [];
        }
    },

    async createFieldRule(fieldId, ruleData) {
        return await apiFetch(`/api/v1/fields/${fieldId}/rules`, {
            method: 'POST',
            body: ruleData,
        });
    },

    async deleteFieldRule(fieldId, ruleId) {
        return await apiFetch(`/api/v1/fields/${fieldId}/rules/${ruleId}`, {
            method: 'DELETE',
        });
    },
};
