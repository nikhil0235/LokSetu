import { apiClient } from './client';
import { ENDPOINTS } from './config';

export const authService = {
  // User authentication - returns JWT token with user details
  login: async (credentials) => {
    return apiClient.post(ENDPOINTS.AUTH.LOGIN, credentials);
  },

  // Send password reset email to user
  forgotPassword: async (email) => {
    return apiClient.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
  },

  // Reset password using token from email
  resetPassword: async (token, newPassword) => {
    return apiClient.post(ENDPOINTS.AUTH.RESET_PASSWORD, { 
      token, 
      new_password: newPassword 
    });
  },

  // Health check - confirms backend is running
  healthCheck: async () => {
    return apiClient.get(ENDPOINTS.ROOT);
  }
};