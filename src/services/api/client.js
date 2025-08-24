import { API_CONFIG } from './config';
import { ApiError } from './errors';

class ApiClient {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  getAuthHeaders(token) {
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: token.startsWith('Bearer ') ? token : `Bearer ${token}` })
    };
  }

  async handleResponse(response, url) {
    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ API ERROR:', {
        status: response.status,
        url,
        error: errorText
      });
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText || 'Request failed' };
      }
      
      const message = errorData.message || errorData.detail || `HTTP ${response.status}`;
      throw new ApiError(message, response.status, errorData);
    }
    
    const responseData = await response.json();
    console.log('✅ API SUCCESS:', {
      status: response.status,
      url,
      data: responseData
    });
    
    return responseData;
  }

  get(endpoint, token, params = null) {
    const headers = this.getAuthHeaders(token);
    const url = params ? 
      `${this.baseURL}${endpoint}?${new URLSearchParams(params).toString()}` : 
      `${this.baseURL}${endpoint}`;
      
    console.log('🚀 GET REQUEST:', { url, headers, params });
    
    return fetch(url, { method: 'GET', headers })
      .then(response => this.handleResponse(response, url));
  }


  post(endpoint, data, token) {
    const url = `${this.baseURL}${endpoint}`;
    let headers, body;

    // Handle form data for specific endpoints that require it
    if (endpoint === '/auth/login' || (endpoint === '/users/' && data.username)) {
      headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        ...(token && { Authorization: token.startsWith('Bearer ') ? token : `Bearer ${token}` })
      };
      
      const formData = new URLSearchParams();
      Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== null) {
          if (Array.isArray(data[key])) {
            formData.append(key, data[key].join(','));
          } else {
            formData.append(key, data[key]);
          }
        }
      });
      
      body = formData.toString();
    } else {
      headers = this.getAuthHeaders(token);
      body = JSON.stringify(data);
    }
    
    console.log('🚀 POST REQUEST:', { url, headers, data });
    
    return fetch(url, { method: 'POST', headers, body })
      .then(response => {
        if (endpoint === '/auth/login' && data.selectedRole) {
          return this.handleResponse(response, url).then(result => ({
            ...result,
            selectedRole: data.selectedRole
          }));
        }
        return this.handleResponse(response, url);
      })
      .catch(error => {
        console.log('Network Error:', error);
        throw new Error('Network connection failed');
      });
  }

  patch(endpoint, data, token) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = this.getAuthHeaders(token);
    const body = JSON.stringify(data);
    
    console.log('🚀 PATCH REQUEST:', { url, headers, data });
    
    return fetch(url, { method: 'PATCH', headers, body })
      .then(response => this.handleResponse(response, url));
  }

  delete(endpoint, data, token) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = this.getAuthHeaders(token);
    const body = data ? JSON.stringify(data) : undefined;
    
    console.log('🚀 DELETE REQUEST:', { url, headers, data });
    
    return fetch(url, { method: 'DELETE', headers, body })
      .then(response => this.handleResponse(response, url));
  }
}

export const apiClient = new ApiClient();