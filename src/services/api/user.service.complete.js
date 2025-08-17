import { apiClient } from './client';
import { ENDPOINTS } from './config';

export const userService = {
  // List all users in the system (Admin only)
  getUsers: async (token) => {
    return apiClient.get(ENDPOINTS.USERS.LIST, token);
  },

  // Create new user with role assignment (Admin only)
  createUser: async (userData, token) => {
    return apiClient.post(ENDPOINTS.USERS.CREATE, userData, token);
  },

  // Update existing user details (Admin only)
  updateUser: async (userId, userData, token) => {
    return apiClient.patch(ENDPOINTS.USERS.UPDATE(userId), userData, token);
  },

  // Delete user from system (Admin only)
  deleteUser: async (userId, token) => {
    return apiClient.delete(ENDPOINTS.USERS.DELETE(userId), {}, token);
  }
};