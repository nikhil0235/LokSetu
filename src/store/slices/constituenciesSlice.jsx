import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { constituencyApi } from '../../services/api';

// Async Thunks
export const fetchConstituencies = createAsyncThunk(
  'constituencies/fetchConstituencies',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const { mockConstituencies } = await import('../../services/api/mockData');
      await new Promise(resolve => setTimeout(resolve, 500));
      return { constituencies: mockConstituencies };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchConstituencyDetails = createAsyncThunk(
  'constituencies/fetchConstituencyDetails',
  async (constituencyId, { rejectWithValue }) => {
    try {
      const response = await constituencyApi.getConstituencyDetails(constituencyId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial State
const initialState = {
  list: [],
  currentConstituency: null,
  loading: {
    fetch: false,
    fetchDetails: false,
  },
  errors: {
    fetch: null,
    fetchDetails: null,
  },
  cache: {},
  lastFetchTime: null,
};

// Constituencies Slice
const constituenciesSlice = createSlice({
  name: 'constituencies',
  initialState,
  reducers: {
    setCurrentConstituency: (state, action) => {
      state.currentConstituency = action.payload;
    },
    
    clearCurrentConstituency: (state) => {
      state.currentConstituency = null;
    },
    
    clearConstituencies: (state) => {
      state.list = [];
      state.currentConstituency = null;
    },
    
    clearConstituencyErrors: (state) => {
      state.errors = {
        fetch: null,
        fetchDetails: null,
      };
    },
  },
  
  extraReducers: (builder) => {
    // Fetch Constituencies
    builder
      .addCase(fetchConstituencies.pending, (state) => {
        state.loading.fetch = true;
        state.errors.fetch = null;
      })
      .addCase(fetchConstituencies.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.list = action.payload.constituencies || [];
        state.lastFetchTime = Date.now();
      })
      .addCase(fetchConstituencies.rejected, (state, action) => {
        state.loading.fetch = false;
        state.errors.fetch = action.payload;
      });
      
    // Fetch Constituency Details
    builder
      .addCase(fetchConstituencyDetails.pending, (state) => {
        state.loading.fetchDetails = true;
        state.errors.fetchDetails = null;
      })
      .addCase(fetchConstituencyDetails.fulfilled, (state, action) => {
        state.loading.fetchDetails = false;
        state.currentConstituency = action.payload;
        // Cache the constituency details
        state.cache[action.payload.constituency_id] = action.payload;
      })
      .addCase(fetchConstituencyDetails.rejected, (state, action) => {
        state.loading.fetchDetails = false;
        state.errors.fetchDetails = action.payload;
      });
  },
});

export const {
  setCurrentConstituency,
  clearCurrentConstituency,
  clearConstituencies,
  clearConstituencyErrors,
} = constituenciesSlice.actions;

export default constituenciesSlice.reducer;