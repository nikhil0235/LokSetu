import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../services/api/admin.api';

export const useAdminData = () => {
  const [data, setData] = useState({
    constituencies: null,
    booths: null,
    users: null,
    voters: null
  });
  
  const [loading, setLoading] = useState({
    constituencies: false,
    booths: false,
    users: false,
    voters: false,
    all: false
  });
  
  const [errors, setErrors] = useState({
    constituencies: null,
    booths: null,
    users: null,
    voters: null
  });

  // Fetch constituencies
  const fetchConstituencies = useCallback(async () => {
    setLoading(prev => ({ ...prev, constituencies: true }));
    setErrors(prev => ({ ...prev, constituencies: null }));
    
    try {
      const result = await adminApi.getAssignedConstituencies();
      setData(prev => ({ ...prev, constituencies: result }));
    } catch (error) {
      setErrors(prev => ({ ...prev, constituencies: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, constituencies: false }));
    }
  }, []);

  // Fetch booths
  const fetchBooths = useCallback(async () => {
    setLoading(prev => ({ ...prev, booths: true }));
    setErrors(prev => ({ ...prev, booths: null }));
    
    try {
      const result = await adminApi.getAssignedBooths();
      setData(prev => ({ ...prev, booths: result }));
    } catch (error) {
      setErrors(prev => ({ ...prev, booths: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, booths: false }));
    }
  }, []);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    setLoading(prev => ({ ...prev, users: true }));
    setErrors(prev => ({ ...prev, users: null }));
    
    try {
      const result = await adminApi.getUsers();
      setData(prev => ({ ...prev, users: result }));
    } catch (error) {
      setErrors(prev => ({ ...prev, users: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, users: false }));
    }
  }, []);

  // Fetch voters
  const fetchVoters = useCallback(async (filters = {}) => {
    setLoading(prev => ({ ...prev, voters: true }));
    setErrors(prev => ({ ...prev, voters: null }));
    
    try {
      const result = await adminApi.getVoters(filters);
      setData(prev => ({ ...prev, voters: result }));
    } catch (error) {
      setErrors(prev => ({ ...prev, voters: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, voters: false }));
    }
  }, []);

  // Fetch all data
  const fetchAllData = useCallback(async (voterFilters = {}) => {
    setLoading(prev => ({ ...prev, all: true }));
    
    try {
      const result = await adminApi.fetchAllAdminData(voterFilters);
      
      setData({
        constituencies: result.constituencies,
        booths: result.booths,
        users: result.users,
        voters: result.voters
      });
      
      setErrors({
        constituencies: result.errors.constituencies?.message || null,
        booths: result.errors.booths?.message || null,
        users: result.errors.users?.message || null,
        voters: result.errors.voters?.message || null
      });
      
    } catch (error) {
      console.error('🔥 Error fetching all admin data:', error);
    } finally {
      setLoading(prev => ({ ...prev, all: false }));
    }
  }, []);

  return {
    data,
    loading,
    errors,
    fetchConstituencies,
    fetchBooths,
    fetchUsers,
    fetchVoters,
    fetchAllData,
    refetch: fetchAllData
  };
};