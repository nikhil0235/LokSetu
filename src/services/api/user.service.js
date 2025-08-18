import { apiClient } from './base';
import { API_CONFIG } from './config';

export const userService = {
  updateUser: async (userId, userData) => {
    console.log(`Making PATCH request to /users/${userId}`);
    console.log('Request data:', userData);
    
    const response = await fetch(`${API_CONFIG.BASE_URL}/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJuaWtoMDEiLCJleHAiOjE3NTU1Nzg0ODB9.hqmhHxHvUqc9GeLwnukgu_NSy_Jv-7FDcnsBY7gQDZA'
      },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    console.log('API call successful for user:', userId);
    return response.json();
  },
};