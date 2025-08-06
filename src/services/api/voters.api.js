import { apiClient } from './base';

export const voterApi = {
  getVoters: async (params) => {
    return apiClient.get('/voters', { params });
  },
  
  updateVoter: async (voterId, updates) => {
    return apiClient.put(`/voters/${voterId}`, updates);
  },
  
  bulkUpdateVoters: async (voterIds, updates) => {
    return apiClient.put('/voters/bulk', { voterIds, updates });
  },
};