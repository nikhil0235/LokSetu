import { apiClient } from './client';
import { ENDPOINTS } from './config';

export const authService = {
  login: async (credentials) => {
    return apiClient.post(ENDPOINTS.AUTH.LOGIN, credentials);
  },

  forgotPassword: async (username) => {
    return apiClient.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, { username });
  },

  resetPassword: async (token, newPassword) => {
    return apiClient.post(ENDPOINTS.AUTH.RESET_PASSWORD, { 
      token, 
      new_password: newPassword 
    });
  }
};