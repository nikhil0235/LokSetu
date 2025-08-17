import { apiClient } from './client';
import { API_CONFIG } from './config';

export const boothService = {
  // Fetch all booths
  getAllBooths: async (token) => {
    try {
      const data = await apiClient.get('/general/booths', token);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching booths:', error);
      throw new Error('Failed to fetch booth data');
    }
  },

  // Search booths by query
  searchBooths: (booths, query) => {
    if (!query.trim()) return booths;
    
    return booths.filter(booth =>
      booth.partName.toLowerCase().includes(query.toLowerCase()) ||
      booth.partNumber.toString().includes(query) ||
      booth.partId.toString().includes(query) ||
      booth.acNumber.toString().includes(query)
    );
  },

  // Filter booths by state
  filterByState: (booths, stateCd) => {
    return booths.filter(booth => booth.stateCd === stateCd);
  },

  // Filter booths by district
  filterByDistrict: (booths, districtCd) => {
    return booths.filter(booth => booth.districtCd === districtCd);
  },

  // Filter booths by AC number
  filterByAC: (booths, acNumber) => {
    return booths.filter(booth => booth.acNumber === acNumber);
  }
};