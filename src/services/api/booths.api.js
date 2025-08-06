import { apiClient } from './base';

export const boothApi = {
  getBooths: async (constituencyId) => {
    return apiClient.get(`/booths/${constituencyId}`);
  },
  
  getBoothDetails: async (boothId) => {
    return apiClient.get(`/booths/details/${boothId}`);
  },
};