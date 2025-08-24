import { apiClient } from './client';
import { ENDPOINTS } from './config';

export const voterService = {
  getList: async (token, filters = {}) => {
    return apiClient.get(ENDPOINTS.VOTERS.LIST, token, filters);
  },

  getByEpicId: async (epicId, token) => {
    return apiClient.get(ENDPOINTS.VOTERS.GET_BY_EPIC(epicId), token);
  },

  updateVoter: async (epicId, voterData, token) => {
    return apiClient.patch(ENDPOINTS.VOTERS.UPDATE(epicId), voterData, token);
  }
};