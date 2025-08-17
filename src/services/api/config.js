export const API_CONFIG = {
  BASE_URL: 'https://voterlistmanagment.onrender.com',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3
};

export const ENDPOINTS = {
  // Health check
  ROOT: '/',
  
  // Authentication endpoints
  AUTH: {
    LOGIN: '/auth/login',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password'
  },
  
  // User management endpoints (Admin only)
  USERS: {
    LIST: '/users/',
    CREATE: '/users/',
    UPDATE: (userId) => `/users/${userId}`,
    DELETE: (userId) => `/users/${userId}`
  },
  
  // Voter management endpoints
  VOTERS: {
    LIST: '/voters/',
    GET_BY_EPIC: (epicId) => `/voters/${epicId}`,
    UPDATE: (epicId) => `/voters/${epicId}`
  },
  
  // General information endpoints (Admin only)
  GENERAL: {
    STATES: '/general/states',
    DISTRICTS: '/general/districts',
    ASSEMBLY: '/general/assembly',
    BOOTHS: '/general/booths'
  }
};