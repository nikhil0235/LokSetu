// Complete API service exports
export { authService } from './auth.service.complete';
export { userService } from './user.service.complete';
export { voterService } from './voter.service.complete';
export { generalService } from './general.service';
export { apiClient } from './client';
export { API_CONFIG, ENDPOINTS } from './config';

// Centralized API service
export const apiService = {
  auth: authService,
  users: userService,
  voters: voterService,
  general: generalService
};