import { apiClient } from './client';
import { ENDPOINTS } from './config';

export const userService = {
  createBulk: (usersData, token) => apiClient.post(ENDPOINTS.USERS.CREATE_BULK, usersData, token),
  create: (userData, token) => apiClient.post(ENDPOINTS.USERS.CREATE, userData, token),
  update: (userData, token) => apiClient.patch(ENDPOINTS.USERS.UPDATE, userData, token),
  delete: (userData, token) => apiClient.delete(ENDPOINTS.USERS.DELETE, userData, token)
};