import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../../services/api';
import { USER_ROLES } from '../../services/api/config';

// Async Thunks
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ username, password }, { rejectWithValue }) => {
    if (!username || !password) {
      return rejectWithValue('Username and password are required');
    }

    // Role-based authorization check
    const allowedUsers = {
      'super_admin': { role: USER_ROLES.SUPER_ADMIN, permissions: ['all'] },
      'admin1': { role: USER_ROLES.ADMIN, permissions: ['booth_management', 'data_collection'] },
      'admin2': { role: USER_ROLES.ADMIN, permissions: ['booth_management', 'data_collection'] },
      'admin3': { role: USER_ROLES.ADMIN, permissions: ['booth_management', 'data_collection'] },
      'booth1': { role: USER_ROLES.BOOTH_BOY, permissions: ['voter_data_entry', 'booth_management'] }
    };
    
    if (!allowedUsers[username]) {
      return rejectWithValue('Unauthorized user');
    }

    try {
      const response = await authApi.login({ username, password });
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue, getState }) => {
    const { auth } = getState();
    if (!auth.isAuthenticated) {
      return rejectWithValue('User not authenticated');
    }
    try {
      await authApi.logout();
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue, getState }) => {
    const { auth } = getState();
    if (!auth.refreshToken) {
      return rejectWithValue('No refresh token available');
    }
    try {
      const response = await authApi.refreshToken();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const verifyToken = createAsyncThunk(
  'auth/verifyToken',
  async (_, { rejectWithValue, getState }) => {
    const { auth } = getState();
    if (!auth.token) {
      return rejectWithValue('No token to verify');
    }
    try {
      const response = await authApi.verifyToken();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial State
const initialState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: {
    login: false,
    logout: false,
    refresh: false,
    verify: false,
  },
  errors: {
    login: null,
    logout: null,
    refresh: null,
    verify: null,
  },
  sessionExpiry: null,
  lastActivity: Date.now(),
  permissions: [],
  role: null,
  sessionId: null,
  loginHistory: [],
  preferences: {
    rememberMe: false,
    sessionTimeout: 3600000, // 1 hour
  },
};

// Auth Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthErrors: (state) => {
      state.errors = {
        login: null,
        logout: null,
        refresh: null,
        verify: null,
      };
    },
    
    updateLastActivity: (state) => {
      state.lastActivity = Date.now();
    },
    
    setSessionExpiry: (state, action) => {
      state.sessionExpiry = action.payload;
    },
    
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.permissions = [];
      state.role = null;
      state.sessionExpiry = null;
      state.sessionId = null;
    },
    
    updateUserProfile: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    
    setAuthPreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    
    addLoginHistory: (state, action) => {
      state.loginHistory.unshift({
        timestamp: Date.now(),
        ...action.payload,
      });
      
      // Keep only last 10 login attempts
      if (state.loginHistory.length > 10) {
        state.loginHistory.splice(10);
      }
    },
  },
  
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state, action) => {
        // Role-based authorization check
        const allowedUsers = ['super_admin', 'admin1', 'admin2', 'admin3', 'booth1'];
        if (
          action.meta &&
          action.meta.arg &&
          allowedUsers.includes(action.meta.arg.username)
        ) {
          state.loading.login = true;
          state.errors.login = null;
        } else {
          state.loading.login = false;
          state.errors.login = 'Unauthorized user';
        }
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading.login = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.permissions = action.payload.permissions || [];
        state.role = action.payload.user.role;
        state.sessionExpiry = action.payload.expiresAt;
        state.sessionId = action.payload.sessionId;
        state.lastActivity = Date.now();
        
        // Add to login history
        authSlice.caseReducers.addLoginHistory(state, {
          payload: {
            success: true,
            userAgent: navigator.userAgent,
            ipAddress: action.payload.ipAddress,
          }
        });
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading.login = false;
        // Role-based authorization check for rejected login
        const attemptedUsername = action.meta?.arg?.username;
        const allowedUsers = ['super_admin', 'admin1', 'admin2', 'admin3', 'booth1'];
        if (!attemptedUsername || !allowedUsers.includes(attemptedUsername)) {
          state.errors.login = 'Unauthorized user';
        } else {
          state.errors.login = action.payload;
        }
        state.isAuthenticated = false;
        
        // Add failed login to history
        authSlice.caseReducers.addLoginHistory(state, {
          payload: {
            success: false,
            error: state.errors.login,
            userAgent: navigator.userAgent,
          }
        });
      });
      
    // Logout
    builder
      .addCase(logoutUser.pending, (state) => {
        if (state.isAuthenticated) {
          state.loading.logout = true;
          state.errors.logout = null;
        } else {
          state.loading.logout = false;
          state.errors.logout = 'User not authenticated';
        }
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading.logout = false;
        if (state.isAuthenticated) {
          state.user = null;
          state.token = null;
          state.refreshToken = null;
          state.isAuthenticated = false;
          state.permissions = [];
          state.role = null;
          state.sessionExpiry = null;
          state.sessionId = null;
        } else {
          state.errors.logout = 'User not authenticated';
        }
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading.logout = false;
        state.errors.logout = action.payload;
        // Force logout even if API call fails
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
      
    // Refresh Token
    builder
      .addCase(refreshToken.pending, (state) => {
        // Authorization check before proceeding
        if (state.isAuthenticated && state.refreshToken) {
          state.loading.refresh = true;
          state.errors.refresh = null;
        } else {
          state.loading.refresh = false;
          state.errors.refresh = 'Missing authorization for token refresh';
        }
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.loading.refresh = false;
        state.token = action.payload.token;
        state.sessionExpiry = action.payload.expiresAt;
        state.lastActivity = Date.now();
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.loading.refresh = false;
        // Explicit authorization check for rejected refresh
        if (!state.isAuthenticated || !state.refreshToken) {
          state.errors.refresh = 'Missing authorization for token refresh';
        } else {
          state.errors.refresh = action.payload;
        }
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
      });
      
    // Verify Token
    builder
      .addCase(verifyToken.pending, (state) => {
        // Authorization check before proceeding
        if (state.token) {
          state.loading.verify = true;
          state.errors.verify = null;
        } else {
          state.loading.verify = false;
          state.errors.verify = 'Missing authorization for token verification';
        }
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.loading.verify = false;
        state.isAuthenticated = true;
        state.lastActivity = Date.now();
        if (action.payload.user) {
          state.user = action.payload.user;
        }
      })
      .addCase(verifyToken.rejected, (state, action) => {
        state.loading.verify = false;
        // Explicit authorization check for rejected token verification
        if (!state.token) {
          state.errors.verify = 'Missing authorization for token verification';
        } else {
          state.errors.verify = action.payload;
        }
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
      });
  },
});

export const {
  clearAuthErrors,
  updateLastActivity,
  setSessionExpiry,
  clearAuth,
  updateUserProfile,
  setAuthPreferences,
  addLoginHistory,
} = authSlice.actions;

export default authSlice.reducer;