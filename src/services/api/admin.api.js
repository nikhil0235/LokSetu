import { apiClient } from './base';

export const adminApi = {
  getStats: async () => {
    return apiClient.get('/admin/stats');
  },
  
  getUsers: async () => {
    return apiClient.get('/admin/users');
  },
};