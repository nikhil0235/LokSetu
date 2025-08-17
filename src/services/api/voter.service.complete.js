import { apiClient } from './client';
import { ENDPOINTS } from './config';

export const voterService = {
  // List voters (filtered by user's role/scope) - All authenticated users
  getVoters: async (token, filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = queryParams ? `${ENDPOINTS.VOTERS.LIST}?${queryParams}` : ENDPOINTS.VOTERS.LIST;
    return apiClient.get(endpoint, token);
  },

  // Get specific voter by EPIC ID - All authenticated users
  getVoterByEpic: async (epicId, token) => {
    return apiClient.get(ENDPOINTS.VOTERS.GET_BY_EPIC(epicId), token);
  },

  // Update voter information - All authenticated users
  updateVoter: async (epicId, voterData, token) => {
    return apiClient.patch(ENDPOINTS.VOTERS.UPDATE(epicId), voterData, token);
  }
};