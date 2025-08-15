import { apiClient } from './base';

export const boothApi = {
  getBooths: async (constituencyId) => {
    try {
      if (!constituencyId) throw new Error('Constituency ID is required');
      return await apiClient.get(`/booths/${constituencyId}`);
    } catch (error) {
      throw new Error('Failed to fetch booths: ' + error.message);
    }
  },
  
  getBoothDetails: async (boothId) => {
    try {
      if (!boothId) throw new Error('Booth ID is required');
      return await apiClient.get(`/booths/details/${boothId}`);
    } catch (error) {
      throw new Error('Failed to fetch booth details: ' + error.message);
    }
  },
};