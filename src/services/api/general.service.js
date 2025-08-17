import { apiClient } from './client';
import { ENDPOINTS } from './config';

export const generalService = {
  // Get list of Indian states from ECI API (Admin only)
  getStates: async (token) => {
    return apiClient.get(ENDPOINTS.GENERAL.STATES, token);
  },

  // Get districts for a specific state (Admin only)
  getDistricts: async (stateId, token) => {
    const endpoint = `${ENDPOINTS.GENERAL.DISTRICTS}?state_id=${stateId}`;
    return apiClient.get(endpoint, token);
  },

  // Get assembly constituencies for a state (Admin only)
  getAssemblyConstituencies: async (stateId, token) => {
    const endpoint = `${ENDPOINTS.GENERAL.ASSEMBLY}?state_id=${stateId}`;
    return apiClient.get(endpoint, token);
  },

  // Get polling booths for specific assembly (Admin only)
  getPollingBooths: async (assemblyId, token) => {
    const endpoint = `${ENDPOINTS.GENERAL.BOOTHS}?assembly_id=${assemblyId}`;
    return apiClient.get(endpoint, token);
  }
};