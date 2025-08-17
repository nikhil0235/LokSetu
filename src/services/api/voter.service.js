import { apiClient } from './client';
import { ENDPOINTS } from './config';

export const voterService = {
  getList: (params, token) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return apiClient.get(`${ENDPOINTS.VOTERS.LIST}${queryString}`, token);
  },
  update: (voterData, token) => apiClient.patch(ENDPOINTS.VOTERS.UPDATE, voterData, token)
};