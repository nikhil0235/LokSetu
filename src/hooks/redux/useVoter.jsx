import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './base';
import {
  selectFilteredVoters,
  selectSelectedVoters,
  selectVoterLoading,
  selectVoterErrors,
  selectVoterStats,
  selectVoterPagination
} from '../../store/selectors';
import {
  fetchVoters,
  updateVoter,
  bulkUpdateVoters,
  selectVoter,
  deselectVoter,
  clearSelection,
  selectAllVoters,
  toggleVoterSelection,
  setCurrentVoter,
  clearCurrentVoter
} from '../../store/slices/votersSlice';

export const useVoters = () => {
  const dispatch = useAppDispatch();
  
  // Selectors
  const voters = useAppSelector(selectFilteredVoters);
  const selectedVoters = useAppSelector(selectSelectedVoters);
  const loading = useAppSelector(selectVoterLoading);
  const errors = useAppSelector(selectVoterErrors);
  const stats = useAppSelector(selectVoterStats);
  const pagination = useAppSelector(selectVoterPagination);
  
  // Action creators
  const actions = {
    fetchVoters: useCallback((params) => dispatch(fetchVoters(params)), [dispatch]),
    updateVoter: useCallback((params) => dispatch(updateVoter(params)), [dispatch]),
    bulkUpdateVoters: useCallback((params) => dispatch(bulkUpdateVoters(params)), [dispatch]),
    selectVoter: useCallback((voterId) => dispatch(selectVoter(voterId)), [dispatch]),
    deselectVoter: useCallback((voterId) => dispatch(deselectVoter(voterId)), [dispatch]),
    toggleSelection: useCallback((voterId) => dispatch(toggleVoterSelection(voterId)), [dispatch]),
    selectAll: useCallback(() => dispatch(selectAllVoters()), [dispatch]),
    clearSelection: useCallback(() => dispatch(clearSelection()), [dispatch]),
    setCurrentVoter: useCallback((voter) => dispatch(setCurrentVoter(voter)), [dispatch]),
    clearCurrentVoter: useCallback(() => dispatch(clearCurrentVoter()), [dispatch]),
  };
  
  // Computed values
  const computed = {
    hasSelection: selectedVoters.length > 0,
    selectionCount: selectedVoters.length,
    isAllSelected: voters.length > 0 && selectedVoters.length === voters.length,
    isEmpty: voters.length === 0,
    isLoading: loading.fetch || loading.update || loading.bulkUpdate,
    hasErrors: !!(errors.fetch || errors.update || errors.bulkUpdate),
    completionRate: stats.totalVoters > 0 ? 
      Math.round((stats.completeDataCount / stats.totalVoters) * 100) : 0,
  };
  
  return {
    voters,
    selectedVoters,
    loading,
    errors,
    stats,
    pagination,
    actions,
    computed,
  };
};