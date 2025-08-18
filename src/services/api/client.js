import { API_CONFIG } from './config';

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

  async request(endpoint, options = {}, token = null) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      timeout: this.timeout,
      headers: options.headers || this.getAuthHeaders(token),
      ...options
    };

    console.log('API Request:', url, config);
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('API Error Response:', response.status, errorText);
      
      let error;
      try {
        error = JSON.parse(errorText);
      } catch {
        error = { message: errorText || 'Request failed' };
      }
      
      throw new Error(error.message || error.detail || `HTTP ${response.status}`);
    }
    
    return response.json();
  }
  
get(endpoint, token, params = null) {
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: token.startsWith('Bearer ') ? token : `Bearer ${token}` })
  };

  if (params) {
    const query = new URLSearchParams(params).toString();
    const urlWithParams = `${this.baseURL}${endpoint}?${query}`;
    
    console.log('API Request:', urlWithParams, { method: 'GET', headers });
    
    return fetch(urlWithParams, {
      method: 'GET',
      headers
    }).then(response => {
      if (!response.ok) {
        return response.text().then(errorText => {
          console.error('API Error Response:', response.status, errorText);
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        });
      }
      return response.json();
    });
  }

  // Default GET without params
  console.log('API GET Request:', endpoint, 'Headers:', headers);
  return fetch(`${this.baseURL}${endpoint}`, {
    method: 'GET',
    headers
  }).then(response => {
    if (!response.ok) {
      return response.text().then(errorText => {
        console.error('API Error Response:', response.status, errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      });
    }
    return response.json();
  });
}


  post(endpoint, data, token) {
    // Special handling for login endpoint
    if (endpoint === '/auth/login') {
      const formData = new URLSearchParams();
      formData.append('username', data.username);
      formData.append('password', data.password);
      
      const url = `${this.baseURL}${endpoint}`;
      console.log('API Login Request:', url);
      console.log('Form Data:', formData.toString());
      console.log('Username:', data.username, 'Password:', data.password);
      return fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData.toString()
      }).catch(error => {
        console.log('Network Error:', error);
        throw new Error('Network connection failed');
      }).then(response => {
        console.log('Response received:', response.status);
        if (!response.ok) {
          return response.text().then(errorText => {
            console.log('API Error Response:', response.status, errorText);
            let error;
            try {
              error = JSON.parse(errorText);
            } catch {
              error = { message: errorText || 'Request failed' };
            }
            throw new Error(error.message || error.detail || `HTTP ${response.status}`);
          });
        }
        return response.json().then(result => {
          // Add selectedRole to the response if provided
          if (data.selectedRole) {
            result.selectedRole = data.selectedRole;
          }
          return result;
        });
      });
    }
  
    // Special handling for user creation endpoint
    if (endpoint === '/users/' && data.username) {
      const formData = new URLSearchParams();
      formData.append('username', data.username);
      formData.append('password', data.password);
      formData.append('role', data.role);
      formData.append('full_name', data.full_name || '');
      formData.append('email', data.email || '');
      formData.append('phone', data.phone || '');
      
      // Handle assigned_booths as comma-separated string
      if (data.assigned_booths && Array.isArray(data.assigned_booths)) {
        formData.append('assigned_booths', data.assigned_booths.join(','));
      } else {
        formData.append('assigned_booths', data.assigned_booths || '');
      }
      
      const url = `${this.baseURL}${endpoint}`;
      console.log('🔥 USER CREATION REQUEST:');
      console.log('URL:', url);
      console.log('Form Data:', formData.toString());
      console.log('Token:', token);
      
      return fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          ...(token && { Authorization: token.startsWith('Bearer ') ? token : `Bearer ${token}` })
        },
        body: formData.toString()
      }).then(response => {
        console.log('🔥 USER CREATION RESPONSE:');
        console.log('Status:', response.status);
        console.log('Status Text:', response.statusText);
        console.log('Headers:', response.headers);
        
        return response.text().then(responseText => {
          console.log('🔥 RESPONSE BODY:', responseText);
          if (!response.ok) {
            let error;
            try {
              error = JSON.parse(responseText);
            } catch {
              error = { message: responseText || 'Request failed' };
            }
            throw new Error(error.message || error.detail || `HTTP ${response.status}`);
          }
          
          let result;
          try {
            result = JSON.parse(responseText);
          } catch {
            result = { message: responseText };
          }
          
          // Check for duplicate user message
          if (result.detail === 'Username already exists') {
            throw new Error('Username already exists');
          }
          
          return result;
        });
      });
    }
    
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    }, token);
  }

  patch(endpoint, data, token) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data)
    }, token);
  }

  delete(endpoint, data, token) {
    return this.request(endpoint, {
      method: 'DELETE',
      body: JSON.stringify(data)
    }, token);
  }
}

export const apiClient = new ApiClient();