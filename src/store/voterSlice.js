import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../services/api/client';
import { ENDPOINTS } from '../services/api/config';

// Async thunks
export const getVoters = createAsyncThunk(
  'voters/getVoters',
  async (params, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
      const response = await apiClient.get(`${ENDPOINTS.VOTERS.LIST}${queryString}`, auth.token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateVoter = createAsyncThunk(
  'voters/updateVoter',
  async (voterData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await apiClient.patch(ENDPOINTS.VOTERS.UPDATE, voterData, auth.token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const voterSlice = createSlice({
  name: 'voters',
  initialState: {
    voters: [],
    isLoading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getVoters.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getVoters.fulfilled, (state, action) => {
        state.isLoading = false;
        state.voters = action.payload.voters;
      })
      .addCase(getVoters.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateVoter.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateVoter.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.voters.findIndex(voter => voter.id === action.payload.voter.id);
        if (index !== -1) {
          state.voters[index] = action.payload.voter;
        }
      })
      .addCase(updateVoter.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError } = voterSlice.actions;
export default voterSlice.reducer;