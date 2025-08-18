import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../services/api/client';
import { ENDPOINTS } from '../services/api/config';
import { storage } from '../utils/storage';
import { loadDashboardData } from './slices/dashboardSlice';
import { cacheManager } from '../utils/cacheManager';

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue, dispatch }) => {
    try {
      console.log("credentials", credentials);
      console.log("ENDPOINTS.AUTH.LOGIN", ENDPOINTS.AUTH.LOGIN);
      const response = await apiClient.post(ENDPOINTS.AUTH.LOGIN, credentials);
      console.log("response", response);
      
      // Load dashboard data only once after successful login
      if (response.access_token) {
        await dispatch(loadDashboardData());
      }
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (data, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await apiClient.post(ENDPOINTS.AUTH.RESET_PASSWORD, data, auth.token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const forgetPassword = createAsyncThunk(
  'auth/forgetPassword',
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(ENDPOINTS.AUTH.FORGET_PASSWORD, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isLoading: false,
    error: null
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      storage.clearAuth();
      cacheManager.clearAllCache();
    },
    setAuthData: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        
        console.log('=== ADMIN LOGIN RESPONSE ===');
        console.log('Full response:', JSON.stringify(action.payload, null, 2));
        console.log('User role:', action.payload.role);
        console.log('User ID:', action.payload.user_id);
        console.log('Username:', action.payload.username);
        console.log('Fullname:', action.payload.fullname);
        console.log('Email:', action.payload.email);
        console.log('Phone:', action.payload.phone);
        console.log('Created by:', action.payload.created_by);
        console.log('============================');
        
        const { access_token, token_type, selectedRole, created_users, ...userData } = action.payload;
        const bearerToken = access_token; // Don't add Bearer prefix, base.jsx will add it
        
        // Clear cache for new user login
        if (userData.user_id) {
          cacheManager.clearUserCache(userData.user_id);
        }
        
        // Separate users by role based on user role
        let admins = [];
        let boothBoys = [];
        
        if (userData.role === 'Super Admin' && created_users) {
          admins = created_users.filter(user => user.role === 'Admin');
          boothBoys = created_users.filter(user => user.role === 'booth_boy' || user.role === 'boothboy');
        }
        
        const finalUserData = {
          ...userData,
          role: selectedRole || userData.role,
          created_users: created_users || [],
          all_admins: admins,
          all_booth_boys: boothBoys
        };
        
        console.log('Final user data stored:', JSON.stringify(finalUserData, null, 2));
        
        state.user = finalUserData;
        state.token = bearerToken;
        
        storage.setToken(bearerToken);
        storage.setUserData(finalUserData);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(forgetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgetPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(forgetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { logout, setAuthData, clearError } = authSlice.actions;
export default authSlice.reducer;