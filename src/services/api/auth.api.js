import { apiClient } from './client';

export const authApi = {
  login: async (credentials) => {
    return apiClient.post('/auth/login', credentials);
  },
  
  logout: async () => {
    return { data: null }; // Mock for now
  },
  
  refreshToken: async () => {
    return { data: null }; // Mock for now
  },

  forgotPassword: async (username) => {
    const formData = new FormData();
    formData.append('username', username);
    return apiClient.post('/auth/forgot-password', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  resetPassword: async (token, newPassword) => {
    const formData = new FormData();
    formData.append('token', token);
    formData.append('new_password', newPassword);
    return apiClient.post('/auth/reset-password', formData);
  },
};