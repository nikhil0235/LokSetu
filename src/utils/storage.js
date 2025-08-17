import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  AUTH_TOKEN: '@auth_token',
  USER_DATA: '@user_data',
  SAVED_CREDENTIALS: '@saved_credentials',
  LOGIN_ATTEMPTS: '@login_attempts',
  LAST_LOGIN: '@last_login',
  DASHBOARD_DATA: '@dashboard_data'
};

// Simple encryption for demo - use proper encryption in production
const simpleEncrypt = (text) => {
  return Buffer.from(text).toString('base64');
};

const simpleDecrypt = (encrypted) => {
  return Buffer.from(encrypted, 'base64').toString();
};

export const storage = {
  async setToken(token) {
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  },

  async getToken() {
    return AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  async setUserData(userData) {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
  },

  async getUserData() {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    return data ? JSON.parse(data) : null;
  },

  async saveCredentials(username, password) {
    const credentials = {
      username,
      password: simpleEncrypt(password),
      savedAt: new Date().toISOString()
    };
    await AsyncStorage.setItem(STORAGE_KEYS.SAVED_CREDENTIALS, JSON.stringify(credentials));
  },

  async getSavedCredentials() {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SAVED_CREDENTIALS);
    if (data) {
      const credentials = JSON.parse(data);
      return {
        username: credentials.username,
        password: simpleDecrypt(credentials.password),
        savedAt: credentials.savedAt
      };
    }
    return null;
  },

  async clearSavedCredentials() {
    await AsyncStorage.removeItem(STORAGE_KEYS.SAVED_CREDENTIALS);
  },

  async recordLoginAttempt(success = false) {
    const attempts = await this.getLoginAttempts();
    const newAttempt = {
      timestamp: new Date().toISOString(),
      success
    };
    
    const updatedAttempts = [...attempts, newAttempt].slice(-10); // Keep last 10 attempts
    await AsyncStorage.setItem(STORAGE_KEYS.LOGIN_ATTEMPTS, JSON.stringify(updatedAttempts));
  },

  async getLoginAttempts() {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.LOGIN_ATTEMPTS);
    return data ? JSON.parse(data) : [];
  },

  async setLastLogin() {
    await AsyncStorage.setItem(STORAGE_KEYS.LAST_LOGIN, new Date().toISOString());
  },

  async getLastLogin() {
    return AsyncStorage.getItem(STORAGE_KEYS.LAST_LOGIN);
  },

  async clearAuth() {
    await AsyncStorage.multiRemove([STORAGE_KEYS.AUTH_TOKEN, STORAGE_KEYS.USER_DATA]);
  },

  async setDashboardData(data) {
    await AsyncStorage.setItem(STORAGE_KEYS.DASHBOARD_DATA, JSON.stringify(data));
  },

  async getDashboardData() {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.DASHBOARD_DATA);
    return data ? JSON.parse(data) : null;
  },

  async clearDashboardData() {
    await AsyncStorage.removeItem(STORAGE_KEYS.DASHBOARD_DATA);
  },

  async clearAll() {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
  }
};