import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';

// Basic selectors
export const selectVotersState = (state) => state.voters;
export const selectAllVoters = (state) => state.voters.list;
export const selectSelectedVoters = (state) => state.voters.selectedVoters;
export const selectCurrentVoter = (state) => state.voters.currentVoter;
export const selectVoterStats = (state) => state.voters.stats;
export const selectVoterLoading = (state) => state.voters.loading;
export const selectVoterErrors = (state) => state.voters.errors;
export const selectVoterPagination = (state) => state.voters.pagination;

// Memoized selectors
export const selectVotersById = createSelector(
  [selectAllVoters],
  (voters) => {
    return voters.reduce((acc, voter) => {
      acc[voter.epic_id] = voter;
      return acc;
    }, {});
  }
);

export const selectVotersByBooth = createSelector(
  [selectAllVoters],
  (voters) => {
    return voters.reduce((acc, voter) => {
      if (!acc[voter.booth_id]) {
        acc[voter.booth_id] = [];
      }
      acc[voter.booth_id].push(voter);
      return acc;
    }, {});
  }
);

export const selectVotersByConstituency = createSelector(
  [selectAllVoters],
  (voters) => {
    return voters.reduce((acc, voter) => {
      if (!acc[voter.constituency_id]) {
        acc[voter.constituency_id] = [];
      }
      acc[voter.constituency_id].push(voter);
      return acc;
    }, {});
  }
);

export const selectVotersByGender = createSelector(
  [selectAllVoters],
  (voters) => {
    return voters.reduce((acc, voter) => {
      const gender = voter.gender || 'unknown';
      if (!acc[gender]) {
        acc[gender] = [];
      }
      acc[gender].push(voter);
      return acc;
    }, {});
  }
);

export const selectVotersByAgeGroup = createSelector(
  [selectAllVoters],
  (voters) => {
    const ageGroups = {
      '18-25': [],
      '26-35': [],
      '36-50': [],
      '51-65': [],
      '65+': [],
      'unknown': [],
    };
    
    voters.forEach(voter => {
      const age = voter.age;
      if (!age) {
        ageGroups.unknown.push(voter);
      } else if (age <= 25) {
        ageGroups['18-25'].push(voter);
      } else if (age <= 35) {
        ageGroups['26-35'].push(voter);
      } else if (age <= 50) {
        ageGroups['36-50'].push(voter);
      } else if (age <= 65) {
        ageGroups['51-65'].push(voter);
      } else {
        ageGroups['65+'].push(voter);
      }
    });
    
    return ageGroups;
  }
);

export const selectSelectedVotersData = createSelector(
  [selectVotersById, selectSelectedVoters],
  (votersById, selectedIds) => {
    return selectedIds.map(id => votersById[id]).filter(Boolean);
  }
);

export const selectVotersWithIncompleteData = createSelector(
  [selectAllVoters],
  (voters) => {
    return voters.filter(voter => {
      return !voter.mobile || !voter.photo_url || !voter.name || !voter.age;
    });
  }
);