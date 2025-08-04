// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://api.loksetu.gov.in',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

// Authentication
export const AUTH_CONSTANTS = {
  OTP_LENGTH: 6,
  OTP_EXPIRY_TIME: 300, // 5 minutes in seconds
  MAX_LOGIN_ATTEMPTS: 3,
  SESSION_TIMEOUT: 3600, // 1 hour in seconds
};

// Screen Names
export const SCREENS = {
  MAIN_LOGIN: 'main',
  PASSWORD_LOGIN: 'password',
  OTP_LOGIN: 'otp',
  DASHBOARD: 'dashboard',
  VOTER_LIST: 'voterList',
  BOOTH_MANAGEMENT: 'boothManagement',
  ADMIN_PANEL: 'adminPanel',
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  BOOTH_OFFICER: 'booth_officer',
  VOTER: 'voter',
};

// Colors (matching theme)
export const COLORS = {
  PRIMARY: '#FF6B35',
  SECONDARY: '#5856D6',
  SUCCESS: '#34C759',
  WARNING: '#FF9500',
  ERROR: '#FF3B30',
  BACKGROUND: '#F5F5F5',
  WHITE: '#FFFFFF',
  TEXT_PRIMARY: '#1C1C1E',
  TEXT_SECONDARY: '#8E8E93',
};

// Storage Keys
export const STORAGE_KEYS = {
  USER_TOKEN: 'userToken',
  USER_DATA: 'userData',
  REMEMBER_ME: 'rememberMe',
  LAST_LOGIN: 'lastLogin',
};

// Validation
export const VALIDATION = {
  PHONE_NUMBER_LENGTH: 10,
  MIN_PASSWORD_LENGTH: 6,
  MAX_PASSWORD_LENGTH: 20,
  USERNAME_MIN_LENGTH: 3,
};

// App Info
export const APP_INFO = {
  NAME: 'LokSetu',
  VERSION: '1.0.0',
  SUPPORT_EMAIL: 'support@loksetu.gov.in',
  SUPPORT_PHONE: '+91-1234567890',
};