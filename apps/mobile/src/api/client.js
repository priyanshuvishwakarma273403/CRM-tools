import * as SecureStore from 'expo-secure-store';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:8080/api/v1';

class ApiClient {
  constructor() {
    this.baseUrl = BASE_URL;
  }

  async getHeaders(customHeaders = {}) {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...customHeaders,
    };

    try {
      const token = await SecureStore.getItemAsync('accessToken');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    } catch (e) {
      console.warn('SecureStore error when reading accessToken:', e.message);
    }

    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = await this.getHeaders(options.headers);

    const config = {
      ...options,
      headers,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || 15000);
    config.signal = controller.signal;

    try {
      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      // Handle 401 Unauthorized - Token Refresh Flow
      if (response.status === 401 && !options._retry) {
        const refreshed = await this.refreshToken();
        if (refreshed) {
          options._retry = true;
          return this.request(endpoint, options);
        }
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
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        const timeoutErr = new Error('Request timed out. Please check your network connection.');
        timeoutErr.code = 'TIMEOUT';
        throw timeoutErr;
      }
      throw err;
    }
  }

  async refreshToken() {
    try {
      const refreshToken = await SecureStore.getItemAsync('refreshToken');
      if (!refreshToken) return false;

      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.data?.accessToken) {
          await SecureStore.setItemAsync('accessToken', result.data.accessToken);
          if (result.data.refreshToken) {
            await SecureStore.setItemAsync('refreshToken', result.data.refreshToken);
          }
          return true;
        }
      }
    } catch (e) {
      console.warn('Failed to refresh token:', e);
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
