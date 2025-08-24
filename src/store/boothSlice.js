import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { boothService } from '../services/api/booth.service';

// Async thunks
export const fetchBooths = createAsyncThunk(
  'booths/fetchBooths',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await boothService.getAllBooths(auth.token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const boothSlice = createSlice({
  name: 'booths',
  initialState: {
    booths: [],
    filteredBooths: [],
    isLoading: false,
    error: null,
    searchQuery: '',
    totalBooths: 0
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.filteredBooths = boothService.searchBooths(state.booths, action.payload);
    },
    filterByState: (state, action) => {
      state.filteredBooths = boothService.filterByState(state.booths, action.payload);
    },
    filterByDistrict: (state, action) => {
      state.filteredBooths = boothService.filterByDistrict(state.booths, action.payload);
    },
    filterByAC: (state, action) => {
      state.filteredBooths = boothService.filterByAC(state.booths, action.payload);
    },
    clearFilters: (state) => {
      state.filteredBooths = state.booths;
      state.searchQuery = '';
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooths.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBooths.fulfilled, (state, action) => {
        state.isLoading = false;
        state.booths = action.payload;
        state.filteredBooths = action.payload;
        state.totalBooths = action.payload.length;
      })
      .addCase(fetchBooths.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { 
  setSearchQuery, 
  filterByState, 
  filterByDistrict, 
  filterByAC, 
  clearFilters, 
  clearError 
} = boothSlice.actions;

export default boothSlice.reducer;