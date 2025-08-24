import { apiClient } from './client';
import { ENDPOINTS } from './config';

export const boothService = {
  // API methods
  getBooths: async (token, filters = {}) => {
    return apiClient.get(ENDPOINTS.GENERAL.BOOTHS, token, filters);
  },

  getAllBooths: async (token, filters = {}) => {
    return apiClient.get(ENDPOINTS.GENERAL.BOOTHS, token, filters);
  },

  getBoothBoys: async (token) => {
    return apiClient.get(ENDPOINTS.USERS.LIST, token, { role: 'booth_boy' });
  },

  assignBooths: async (token, boothBoyId, boothIds) => {
    return apiClient.patch(ENDPOINTS.USERS.UPDATE(boothBoyId), {
      assigned_booths: Array.isArray(boothIds) ? boothIds.join(',') : boothIds
    }, token);
  },

  getBoothAssignments: async (token, filters = {}) => {
    return apiClient.get(ENDPOINTS.BOOTH_ASSIGNMENTS.LIST, token, filters);
  },

  createBoothAssignment: async (token, assignmentData) => {
    return apiClient.post(ENDPOINTS.BOOTH_ASSIGNMENTS.CREATE, assignmentData, token);
  },

  updateBoothAssignment: async (token, assignmentId, assignmentData) => {
    return apiClient.patch(ENDPOINTS.BOOTH_ASSIGNMENTS.UPDATE(assignmentId), assignmentData, token);
  },

  deleteBoothAssignment: async (token, assignmentId) => {
    return apiClient.delete(ENDPOINTS.BOOTH_ASSIGNMENTS.DELETE(assignmentId), {}, token);
  },

  // Utility methods for filtering/searching
  searchBooths: (booths, query) => {
    if (!query || !query.trim()) return booths;
    
    const searchTerm = query.toLowerCase().trim();
    return booths.filter(booth => 
      booth.name?.toLowerCase().includes(searchTerm) ||
      booth.booth_id?.toLowerCase().includes(searchTerm) ||
      booth.area?.toLowerCase().includes(searchTerm) ||
      booth.constituency?.toLowerCase().includes(searchTerm)
    );
  },

  filterByState: (booths, stateId) => {
    if (!stateId) return booths;
    return booths.filter(booth => booth.state_id === stateId);
  },

  filterByDistrict: (booths, districtId) => {
    if (!districtId) return booths;
    return booths.filter(booth => booth.district_id === districtId);
  },

  filterByAC: (booths, acId) => {
    if (!acId) return booths;
    return booths.filter(booth => booth.assembly_constituency_id === acId);
  }
};