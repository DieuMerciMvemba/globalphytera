// Base API Client for PHYTERA Frontend
const getBaseUrl = () => {
    return localStorage.getItem('phytera_custom_api_url') || import.meta.env.VITE_API_URL || 'http://localhost:3000';
};

export async function apiFetch(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const config = {
        ...options,
        headers,
    };

    if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
        config.body = JSON.stringify(config.body);
    }

    const baseUrl = getBaseUrl();
    const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

    // Timeout (15000ms) for reliable database queries
    const controller = new AbortController();
    const timeoutMs = options.timeout || 15000;
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    config.signal = controller.signal;

    try {
        const response = await fetch(url, config);
        clearTimeout(timeoutId);

        if (!response.ok) {
            let errorMessage = `Erreur HTTP ${response.status}`;
            try {
                const errorData = await response.json();
                const msg = errorData.message || errorData.error;
                errorMessage = Array.isArray(msg) ? msg.join(', ') : (msg || errorMessage);
            } catch (e) {
                // Response wasn't JSON
            }
            throw new Error(errorMessage);
        }

        // Handle 204 No Content
        if (response.status === 204) {
            return null;
        }

        return await response.json();
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            console.warn(`[API Timeout] ${url} took more than ${timeoutMs}ms.`);
            throw new Error('Connexion au serveur expirée (Serveur non joignable)');
        }
        console.warn(`[API Call Warning] ${url}:`, error.message);
        if (error instanceof TypeError) {
            throw new Error('Impossible de joindre le serveur. Vérifiez votre connexion.');
        }
        throw error;
    }
}

export const getApiBaseUrl = getBaseUrl;
export const setCustomApiUrl = (url) => {
    if (url) {
        localStorage.setItem('phytera_custom_api_url', url.trim());
    } else {
        localStorage.removeItem('phytera_custom_api_url');
    }
};
export const API_BASE_URL = getBaseUrl();
