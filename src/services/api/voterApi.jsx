import apiClient from './base';

export const voterApi = {
  getVoters: async (params) => {
    const response = await apiClient.get('/voters', { params });
    return response;
  },
  
  getVoterById: async (voterId) => {
    const response = await apiClient.get(`/voters/${voterId}`);
    return response;
  },
  
  updateVoter: async (voterId, updates) => {
    const response = await apiClient.put(`/voters/${voterId}`, updates);
    return response;
  },
  
  bulkUpdateVoters: async (voterIds, updates) => {
    const response = await apiClient.put('/voters/bulk', { voterIds, updates });
    return response;
  },
  
  searchVoters: async (searchTerm, filters = {}) => {
    const response = await apiClient.post('/voters/search', {
      searchTerm,
      filters,
    });
    return response;
  },
  
  exportVoters: async (filters = {}) => {
    const response = await apiClient.post('/voters/export', filters, {
      responseType: 'blob',
    });
    return response;
  },
};