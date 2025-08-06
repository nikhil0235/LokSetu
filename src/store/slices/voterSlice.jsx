import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { voterApi } from '../../services/api';

// Async Thunks
export const fetchVoters = createAsyncThunk(
  'voters/fetchVoters',
  async ({ constituencyId, boothId, filters = {}, page = 1, limit = 50 }, { rejectWithValue }) => {
    try {

    //  const response = await voterApi.getVoters({
    //     constituencyId,
    //     boothId,
    //     filters,
    //     page,
    //     limit,
    //   });
    //   return response.data;
      // Mock API call - replace with real API when backend is ready
      const { mockVoters } = await import('../../services/api/mockData');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        voters: mockVoters,
        pagination: {
          currentPage: page,
          totalPages: 1,
          totalItems: mockVoters.length,
          itemsPerPage: limit,
          hasNextPage: false,
          hasPrevPage: false,
        }
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateVoter = createAsyncThunk(
  'voters/updateVoter',
  async ({ voterId, updates }, { rejectWithValue }) => {
    try {
      const response = await voterApi.updateVoter(voterId, updates);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const bulkUpdateVoters = createAsyncThunk(
  'voters/bulkUpdateVoters',
  async ({ voterIds, updates }, { rejectWithValue }) => {
    try {
      const response = await voterApi.bulkUpdateVoters(voterIds, updates);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial State
const initialState = {
  list: [],
  selectedVoters: [],
  currentVoter: null,
  loading: {
    fetch: false,
    update: false,
    bulkUpdate: false,
  },
  errors: {
    fetch: null,
    update: null,
    bulkUpdate: null,
  },
  pagination: {
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    itemsPerPage: 50,
    hasNextPage: false,
    hasPrevPage: false,
  },
  stats: {
    totalVoters: 0,
    maleVoters: 0,
    femaleVoters: 0,
    thirdGenderVoters: 0,
    avgAge: 0,
    votersWithPhotos: 0,
    votersWithMobile: 0,
    completeDataCount: 0,
  },
  cache: {},
  lastFetchTime: null,
  isDirty: false,
};

// Voters Slice
const votersSlice = createSlice({
  name: 'voters',
  initialState,
  reducers: {
    // Selection Management
    selectVoter: (state, action) => {
      const voterId = action.payload;
      if (!state.selectedVoters.includes(voterId)) {
        state.selectedVoters.push(voterId);
      }
    },
    
    deselectVoter: (state, action) => {
      const voterId = action.payload;
      state.selectedVoters = state.selectedVoters.filter(id => id !== voterId);
    },
    
    toggleVoterSelection: (state, action) => {
      const voterId = action.payload;
      const index = state.selectedVoters.indexOf(voterId);
      if (index === -1) {
        state.selectedVoters.push(voterId);
      } else {
        state.selectedVoters.splice(index, 1);
      }
    },
    
    selectAllVoters: (state) => {
      state.selectedVoters = state.list.map(voter => voter.epic_id);
    },
    
    clearSelection: (state) => {
      state.selectedVoters = [];
    },
    
    // Current Voter Management
    setCurrentVoter: (state, action) => {
      state.currentVoter = action.payload;
    },
    
    clearCurrentVoter: (state) => {
      state.currentVoter = null;
    },
    
    // Local Updates (for offline support)
    updateVoterLocal: (state, action) => {
      const { voterId, updates } = action.payload;
      const voterIndex = state.list.findIndex(voter => voter.epic_id === voterId);
      if (voterIndex !== -1) {
        state.list[voterIndex] = { ...state.list[voterIndex], ...updates };
        state.isDirty = true;
      }
    },
    
    // Pagination
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    
    // Utility Actions
    clearVoters: (state) => {
      state.list = [];
      state.selectedVoters = [];
      state.currentVoter = null;
    },
    
    clearErrors: (state) => {
      state.errors = {
        fetch: null,
        update: null,
        bulkUpdate: null,
      };
    },
    
    updateStats: (state) => {
      const voters = state.list;
      const stats = {
        totalVoters: voters.length,
        maleVoters: voters.filter(v => v.gender === 'male').length,
        femaleVoters: voters.filter(v => v.gender === 'female').length,
        thirdGenderVoters: voters.filter(v => v.gender === 'third_gender').length,
        votersWithPhotos: voters.filter(v => v.photo_url).length,
        votersWithMobile: voters.filter(v => v.mobile).length,
        completeDataCount: voters.filter(v => 
          v.name && v.age && v.gender && v.mobile
        ).length,
      };
      
      // Calculate average age
      const votersWithAge = voters.filter(v => v.age);
      stats.avgAge = votersWithAge.length > 0 
        ? Math.round(votersWithAge.reduce((sum, v) => sum + v.age, 0) / votersWithAge.length)
        : 0;
      
      state.stats = stats;
    },
  },
  
  extraReducers: (builder) => {
    // Fetch Voters
    builder
      .addCase(fetchVoters.pending, (state) => {
        state.loading.fetch = true;
        state.errors.fetch = null;
      })
      .addCase(fetchVoters.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.list = action.payload.voters || [];
        state.pagination = {
          ...state.pagination,
          ...action.payload.pagination,
        };
        state.lastFetchTime = Date.now();
        state.isDirty = false;
        votersSlice.caseReducers.updateStats(state);
      })
      .addCase(fetchVoters.rejected, (state, action) => {
        state.loading.fetch = false;
        state.errors.fetch = action.payload;
      });
      
    // Update Voter
    builder
      .addCase(updateVoter.pending, (state) => {
        state.loading.update = true;
        state.errors.update = null;
      })
      .addCase(updateVoter.fulfilled, (state, action) => {
        state.loading.update = false;
        const updatedVoter = action.payload;
        const index = state.list.findIndex(v => v.epic_id === updatedVoter.epic_id);
        if (index !== -1) {
          state.list[index] = updatedVoter;
        }
        if (state.currentVoter && state.currentVoter.epic_id === updatedVoter.epic_id) {
          state.currentVoter = updatedVoter;
        }
        votersSlice.caseReducers.updateStats(state);
      })
      .addCase(updateVoter.rejected, (state, action) => {
        state.loading.update = false;
        state.errors.update = action.payload;
      });
      
    // Bulk Update Voters
    builder
      .addCase(bulkUpdateVoters.pending, (state) => {
        state.loading.bulkUpdate = true;
        state.errors.bulkUpdate = null;
      })
      .addCase(bulkUpdateVoters.fulfilled, (state, action) => {
        state.loading.bulkUpdate = false;
        const updatedVoters = action.payload.voters || [];
        
        updatedVoters.forEach(updatedVoter => {
          const index = state.list.findIndex(v => v.epic_id === updatedVoter.epic_id);
          if (index !== -1) {
            state.list[index] = updatedVoter;
          }
        });
        
        state.selectedVoters = [];
        votersSlice.caseReducers.updateStats(state);
      })
      .addCase(bulkUpdateVoters.rejected, (state, action) => {
        state.loading.bulkUpdate = false;
        state.errors.bulkUpdate = action.payload;
      });
  },
});

export const {
  selectVoter,
  deselectVoter,
  toggleVoterSelection,
  selectAllVoters,
  clearSelection,
  setCurrentVoter,
  clearCurrentVoter,
  updateVoterLocal,
  setPagination,
  clearVoters,
  clearErrors,
  updateStats,
} = votersSlice.actions;

export default votersSlice.reducer;