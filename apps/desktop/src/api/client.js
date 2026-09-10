/**
 * Centralized API Client with JWT Dual-Token Authentication & Automatic Refresh
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

class ApiClient {
  constructor() {
    this.baseUrl = BASE_URL;
    this.isRefreshing = false;
    this.refreshSubscribers = [];
  }

  getHeaders(customHeaders = {}) {
    const token = localStorage.getItem('nexus_access_token') || localStorage.getItem('nexus_token');
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...customHeaders,
    };
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = this.getHeaders(options.headers);

    const config = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);

      // Handle 401 Unauthorized - Token Refresh Flow
      if (response.status === 401 && !options._retry) {
        options._retry = true;
        const refreshed = await this.refreshToken();
        if (refreshed) {
          return this.request(endpoint, options);
        }
      }

      if (response.status === 204) {
        return { success: true };
      }

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const error = new Error(data?.message || `HTTP ${response.status}: Request failed`);
        error.status = response.status;
        error.code = data?.code || 'API_ERROR';
        error.data = data;
        throw error;
      }

      return data;
    } catch (err) {
      throw err;
    }
  }

  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('nexus_refresh_token');
      if (!refreshToken) return false;

      const res = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (res.ok) {
        const result = await res.json();
        if (result.data?.accessToken) {
          localStorage.setItem('nexus_access_token', result.data.accessToken);
          localStorage.setItem('nexus_token', result.data.accessToken);
          if (result.data.refreshToken) {
            localStorage.setItem('nexus_refresh_token', result.data.refreshToken);
          }
          return true;
        }
      }
    } catch (e) {
      console.warn('Token refresh failed:', e);
    }
    return false;
  }

  get(endpoint, options) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, body, options) {
    return this.request(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) });
  }

  put(endpoint, body, options) {
    return this.request(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) });
  }

  patch(endpoint, body, options) {
    return this.request(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) });
  }

  delete(endpoint, options) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
export { BASE_URL };
