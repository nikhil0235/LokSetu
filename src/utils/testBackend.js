import { apiClient } from '../services/api/client';

export const testBackendConnection = async () => {
  try {
    // Test basic connectivity
    const response = await fetch('https://voterlistmanagment.onrender.com/health', {
      method: 'GET',
      timeout: 10000
    });
    
    if (response.ok) {
      console.log('✅ Backend is reachable');
      return true;
    } else {
      console.log('⚠️ Backend responded with status:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Backend connection failed:', error.message);
    return false;
  }
};

export const testLogin = async (credentials) => {
  try {
    const response = await apiClient.post('/login', credentials);
    console.log('✅ Login test successful:', response);
    return response;
  } catch (error) {
    console.log('❌ Login test failed:', error.message);
    throw error;
  }
};