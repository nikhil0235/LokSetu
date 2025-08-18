import { apiClient } from './client';
import { handleApiError } from '../../utils/apiHelpers';
import { store } from '../../store';

export const adminApi = {
  // Get assigned constituencies
  getAssignedConstituencies: async () => {
    try {
      const state = store.getState();
      const token = state.auth.token;
      console.log('🔑 Raw token from store:', token);
      console.log('🔑 Token type:', typeof token);
      console.log('🔑 Token length:', token?.length);
      console.log('🔑 Token starts with Bearer:', token?.startsWith('Bearer'));
      console.log('👤 Current user:', state.auth.user?.role);
      console.log('🏛️ Fetching assigned constituencies...');
      
      // Manual fetch to debug headers
      const url = `http://192.168.1.5:8000/users/assigned-constituencies`;
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      console.log('📡 Manual fetch URL:', url);
      console.log('📡 Manual fetch headers:', headers);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: headers
      });
      
      console.log('📡 Response status:', response.status);
      const result = await response.json();
      console.log('✅ Manual fetch result:', result);
      return result;
    } catch (error) {
      console.error('❌ Error fetching constituencies:', error);
      throw error;
    }
  },

  // Get assigned booths
  getAssignedBooths: async () => {
    try {
      const state = store.getState();
      const token = state.auth.token;
      console.log('🏢 Fetching assigned booths...');
      const response = await apiClient.get('/users/assigned-booths', token);
      console.log('✅ Booths response:', response);
      return response;
    } catch (error) {
      console.error('❌ Error fetching booths:', error);
      console.error('Error details:', handleApiError(error));
      throw error;
    }
  },

  // Get all users (admin only)
  getUsers: async () => {
    try {
      const state = store.getState();
      const token = state.auth.token;
      console.log('👥 Fetching all users...');
      const response = await apiClient.get('/users/', token);
      console.log('✅ Users response:', response);
      return response;
    } catch (error) {
      console.error('❌ Error fetching users:', error);
      console.error('Error details:', handleApiError(error));
      throw error;
    }
  },

  // Get voters with optional filters
  getVoters: async (filters = {}) => {
    try {
      const state = store.getState();
      const token = state.auth.token;
      console.log('🗳️ Fetching voters with filters:', filters);
      
      let url = '/voters/';
      if (filters.booth_ids || filters.constituency_id) {
        const params = {};
        if (filters.booth_ids) params.booth_ids = filters.booth_ids;
        if (filters.constituency_id) params.constituency_id = filters.constituency_id;
        
        console.log('📡 API URL with params:', url, params);
        const response = await apiClient.get(url, token, params);
        console.log('✅ Voters response:', response);
        return response;
      } else {
        console.log('📡 API URL:', url);
        const response = await apiClient.get(url, token);
        console.log('✅ Voters response:', response);
        return response;
      }
    } catch (error) {
      console.error('❌ Error fetching voters:', error);
      console.error('Error details:', handleApiError(error));
      throw error;
    }
  },

  // Fetch all admin data at once
  fetchAllAdminData: async (voterFilters = {}) => {
    try {
      console.log('🔄 Fetching all admin data...');
      
      const [constituencies, booths, users, voters] = await Promise.allSettled([
        adminApi.getAssignedConstituencies(),
        adminApi.getAssignedBooths(),
        adminApi.getUsers(),
        adminApi.getVoters(voterFilters)
      ]);

      const result = {
        constituencies: constituencies.status === 'fulfilled' ? constituencies.value : null,
        booths: booths.status === 'fulfilled' ? booths.value : null,
        users: users.status === 'fulfilled' ? users.value : null,
        voters: voters.status === 'fulfilled' ? voters.value : null,
        errors: {
          constituencies: constituencies.status === 'rejected' ? constituencies.reason : null,
          booths: booths.status === 'rejected' ? booths.reason : null,
          users: users.status === 'rejected' ? users.reason : null,
          voters: voters.status === 'rejected' ? voters.reason : null
        }
      };

      console.log('📊 All admin data fetched:', result);
      return result;
    } catch (error) {
      console.error('❌ Error in fetchAllAdminData:', error);
      throw error;
    }
  }
};