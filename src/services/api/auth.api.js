import { apiClient } from './base';

export const authApi = {
  login: async (credentials) => {
    return apiClient.post('/auth/login', credentials);
  },
  
  logout: async () => {
    return apiClient.post('/auth/logout');
  },
  
  refreshToken: async () => {
    return apiClient.post('/auth/refresh');
  },
};