import { apiClient } from './client';
import { ENDPOINTS } from './config';

export const userService = {
  getUsers: async (token, filters = {}) => {
    return apiClient.get(ENDPOINTS.USERS.LIST, token, filters);
  },

  createUser: async (userData, token) => {
    return apiClient.post(ENDPOINTS.USERS.CREATE, userData, token);
  },

  updateUser: async (userId, userData, token) => {
    return apiClient.patch(ENDPOINTS.USERS.UPDATE(userId), userData, token);
  },

  deleteUser: async (userId, token) => {
    return apiClient.delete(ENDPOINTS.USERS.DELETE(userId), {}, token);
  },

  getAssignedConstituencies: async (token) => {
    return apiClient.get('/users/assigned-constituencies', token);
  },

  getAssignedBooths: async (token) => {
    return apiClient.get('/users/assigned-booths', token);
  }
};