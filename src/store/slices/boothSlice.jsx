import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { boothApi } from '../../services/api';

// Async Thunks
export const fetchBooths = createAsyncThunk(
  'booths/fetchBooths',
  async ({ constituencyId, filters = {} }, { rejectWithValue }) => {
    try {
      const { mockBooths } = await import('../../services/api/mockData');
      await new Promise(resolve => setTimeout(resolve, 500));
      return { booths: mockBooths.filter(b => b.constituency_id === constituencyId) };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchBoothDetails = createAsyncThunk(
  'booths/fetchBoothDetails',
  async (boothId, { rejectWithValue }) => {
    try {
      const response = await boothApi.getBoothDetails(boothId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial State
const initialState = {
  list: [],
  currentBooth: null,
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

// Booths Slice
const boothsSlice = createSlice({
  name: 'booths',
  initialState,
  reducers: {
    setCurrentBooth: (state, action) => {
      state.currentBooth = action.payload;
    },
    
    clearCurrentBooth: (state) => {
      state.currentBooth = null;
    },
    
    clearBooths: (state) => {
      state.list = [];
      state.currentBooth = null;
    },
    
    clearBoothErrors: (state) => {
      state.errors = {
        fetch: null,
        fetchDetails: null,
      };
    },
  },
  
  extraReducers: (builder) => {
    // Fetch Booths
    builder
      .addCase(fetchBooths.pending, (state) => {
        state.loading.fetch = true;
        state.errors.fetch = null;
      })
      .addCase(fetchBooths.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.list = action.payload.booths || [];
        state.lastFetchTime = Date.now();
      })
      .addCase(fetchBooths.rejected, (state, action) => {
        state.loading.fetch = false;
        state.errors.fetch = action.payload;
      });
      
    // Fetch Booth Details
    builder
      .addCase(fetchBoothDetails.pending, (state) => {
        state.loading.fetchDetails = true;
        state.errors.fetchDetails = null;
      })
      .addCase(fetchBoothDetails.fulfilled, (state, action) => {
        state.loading.fetchDetails = false;
        state.currentBooth = action.payload;
        // Cache the booth details
        state.cache[action.payload.booth_id] = action.payload;
      })
      .addCase(fetchBoothDetails.rejected, (state, action) => {
        state.loading.fetchDetails = false;
        state.errors.fetchDetails = action.payload;
      });
  },
});

export const {
  setCurrentBooth,
  clearCurrentBooth,
  clearBooths,
  clearBoothErrors,
} = boothsSlice.actions;

export default boothsSlice.reducer;