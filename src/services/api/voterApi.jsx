import apiClient from './base';

export const voterApi = {
  getVoters: async (params) => {
    try {
      const response = await apiClient.get('/voters', { params });
      return response;
    } catch (error) {
      throw new Error('Failed to fetch voters: ' + error.message);
    }
  },
  
  getVoterById: async (voterId) => {
    try {
      if (!voterId) throw new Error('Voter ID is required');
      const response = await apiClient.get(`/voters/${voterId}`);
      return response;
    } catch (error) {
      throw new Error('Failed to fetch voter: ' + error.message);
    }
  },
  
  updateVoter: async (voterId, updates) => {
    try {
      if (!voterId) throw new Error('Voter ID is required');
      if (!updates) throw new Error('Update data is required');
      const response = await apiClient.put(`/voters/${voterId}`, updates);
      return response;
    } catch (error) {
      throw new Error('Failed to update voter: ' + error.message);
    }
  },
  
  bulkUpdateVoters: async (voterIds, updates) => {
    try {
      if (!voterIds || !Array.isArray(voterIds)) throw new Error('Voter IDs array is required');
      if (!updates) throw new Error('Update data is required');
      const response = await apiClient.put('/voters/bulk', { voterIds, updates });
      return response;
    } catch (error) {
      throw new Error('Failed to bulk update voters: ' + error.message);
    }
  },
  
  searchVoters: async (searchTerm, filters = {}) => {
    try {
      const response = await apiClient.post('/voters/search', {
        searchTerm,
        filters,
      });
      return response;
    } catch (error) {
      throw new Error('Failed to search voters: ' + error.message);
    }
  },
  
  exportVoters: async (filters = {}) => {
    try {
      const response = await apiClient.post('/voters/export', filters, {
        responseType: 'blob',
      });
      return response;
    } catch (error) {
      throw new Error('Failed to export voters: ' + error.message);
    }
  },
};