// Consolidated API Services
// Usage: import { authService, userService, apiClient } from '../services/api';

export { apiClient } from './client';
export { API_CONFIG, ENDPOINTS, USER_ROLES } from './config';
export { authService } from './auth.service';
export { userService } from './user.service';
export { voterService } from './voter.service';
export { boothService } from './booth.service';
export { generalService } from './general.service';
export { ApiError, ERROR_TYPES, handleApiError } from './errors';