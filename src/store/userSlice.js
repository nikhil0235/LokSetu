import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../services/api/client';
import { ENDPOINTS } from '../services/api/config';

// Async thunks
export const createUsers = createAsyncThunk(
  'users/createUsers',
  async (usersData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await apiClient.post(ENDPOINTS.USERS.CREATE_BULK, usersData, auth.token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const userPayload = {
        username: userData.username,
        password: userData.password,
        role: userData.role,
        full_name: userData.full_name,
        email: userData.email,
        phone: userData.phone,
        assigned_booths: userData.assigned_booths || ''
      };
      const response = await apiClient.post(ENDPOINTS.USERS.CREATE, userPayload, auth.token);
      console.log("User created successfully:", response);
      return response;
    } catch (error) {
      console.error("Error creating user:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async (userData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await apiClient.patch(ENDPOINTS.USERS.UPDATE, userData, auth.token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await apiClient.delete(ENDPOINTS.USERS.DELETE, userData, auth.token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
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
      .addCase(createUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        const users = action.payload.users || action.payload;
        state.users = [...state.users, ...users];
      })
      .addCase(createUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.isLoading = false;
        // Handle response - could be user object or success message
        if (action.payload.user) {
          state.users.push(action.payload.user);
        } else {
          // If response doesn't have user object, add the created user data
          state.users.push(action.payload);
        }
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        const { access_token, token_type, ...userData } = action.payload;
        const index = state.users.findIndex(user => user.user_id === userData.user_id);
        if (index !== -1) {
          state.users[index] = userData;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = state.users.filter(user => user.user_id !== action.payload.user_id);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;