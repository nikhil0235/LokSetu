import axios from 'axios';
import { store } from '../../store';
import { addNotification } from '../../store/slices/uiSlice';
import { logoutUser } from '../../store/slices/authSlice';

// Create axios instance
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh token
        await store.dispatch(refreshToken()).unwrap();
        // Retry original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        store.dispatch(logoutUser());
        return Promise.reject(refreshError);
      }
    }
    
    // Show error notification
    const message = error.response?.data?.message || error.message;
    store.dispatch(addNotification({
      type: 'error',
      title: 'API Error',
      message,
      duration: 5000,
    }));
    
    return Promise.reject(error);
  }
);

export default apiClient;