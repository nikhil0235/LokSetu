export const API_CONFIG = {
  // BASE_URL: 'https://voterlistmanagment.onrender.com',
  BASE_URL : 'http://192.168.1.5:8000',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3
};

export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  PARTY_ADMIN: 'party_admin',
  ADMIN: 'admin',
  BOOTH_BOY: 'booth_boy',
  CANDIDATE: 'candidate',
  BLOCK_PRABHARI: 'block_prabhari',
  PANCHAYAT_PRABHARI: 'panchayat_prabhari',
  VIDHANSABHA_PRABHARI: 'vidhansabha_prabhari'
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
  },
  
  // Booth assignment endpoints
  BOOTH_ASSIGNMENTS: {
    LIST: '/booth-assignments/',
    CREATE: '/booth-assignments/',
    UPDATE: (assignmentId) => `/booth-assignments/${assignmentId}`,
    DELETE: (assignmentId) => `/booth-assignments/${assignmentId}`
  }
};