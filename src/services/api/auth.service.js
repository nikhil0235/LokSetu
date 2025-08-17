import { apiClient } from './client';
import { ENDPOINTS } from './config';

export const authService = {
  login: (credentials) => apiClient.post(ENDPOINTS.AUTH.LOGIN, credentials),
  resetPassword: (data, token) => apiClient.post(ENDPOINTS.AUTH.RESET_PASSWORD, data, token),
  forgetPassword: (data) => apiClient.post(ENDPOINTS.AUTH.FORGET_PASSWORD, data),
  verifyToken: (token) => apiClient.post(ENDPOINTS.AUTH.VERIFY, {}, token)
};