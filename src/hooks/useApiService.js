import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { authService } from '../services/api/auth.service.complete';
import { userService } from '../services/api/user.service.complete';
import { voterService } from '../services/api/voter.service.complete';
import { generalService } from '../services/api/general.service';

const apiService = {
  auth: authService,
  users: userService,
  voters: voterService,
  general: generalService
};

export const useApiService = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = useSelector(state => state.auth.token);

  const executeRequest = useCallback(async (apiCall) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiCall();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Auth methods
  const login = useCallback((credentials) => 
    executeRequest(() => apiService.auth.login(credentials)), [executeRequest]);

  const forgotPassword = useCallback((email) => 
    executeRequest(() => apiService.auth.forgotPassword(email)), [executeRequest]);

  const resetPassword = useCallback((token, newPassword) => 
    executeRequest(() => apiService.auth.resetPassword(token, newPassword)), [executeRequest]);

  // User methods (Admin only)
  const getUsers = useCallback(() => 
    executeRequest(() => apiService.users.getUsers(token)), [executeRequest, token]);

  const createUser = useCallback((userData) => 
    executeRequest(() => apiService.users.createUser(userData, token)), [executeRequest, token]);

  const updateUser = useCallback((userId, userData) => 
    executeRequest(() => apiService.users.updateUser(userId, userData, token)), [executeRequest, token]);

  const deleteUser = useCallback((userId) => 
    executeRequest(() => apiService.users.deleteUser(userId, token)), [executeRequest, token]);

  // Voter methods
  const getVoters = useCallback((filters) => 
    executeRequest(() => apiService.voters.getVoters(token, filters)), [executeRequest, token]);

  const getVoterByEpic = useCallback((epicId) => 
    executeRequest(() => apiService.voters.getVoterByEpic(epicId, token)), [executeRequest, token]);

  const updateVoter = useCallback((epicId, voterData) => 
    executeRequest(() => apiService.voters.updateVoter(epicId, voterData, token)), [executeRequest, token]);

  // General methods (Admin only)
  const getStates = useCallback(() => 
    executeRequest(() => apiService.general.getStates(token)), [executeRequest, token]);

  const getDistricts = useCallback((stateId) => 
    executeRequest(() => apiService.general.getDistricts(stateId, token)), [executeRequest, token]);

  const getAssemblyConstituencies = useCallback((stateId) => 
    executeRequest(() => apiService.general.getAssemblyConstituencies(stateId, token)), [executeRequest, token]);

  const getPollingBooths = useCallback((assemblyId) => 
    executeRequest(() => apiService.general.getPollingBooths(assemblyId, token)), [executeRequest, token]);

  return {
    loading,
    error,
    // Auth
    login,
    forgotPassword,
    resetPassword,
    // Users (Admin)
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    // Voters
    getVoters,
    getVoterByEpic,
    updateVoter,
    // General (Admin)
    getStates,
    getDistricts,
    getAssemblyConstituencies,
    getPollingBooths
  };
};