import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../../services/api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createUser } from '../userSlice';
import { storage } from '../../utils/storage';

const DASHBOARD_STORAGE_KEY = '@dashboard_data';

// Load dashboard data with caching logic
export const loadDashboardData = createAsyncThunk(
  'dashboard/loadData',
  async (forceRefresh = false, { getState, rejectWithValue }) => {
    try {
      // First try to load from cache if not forcing refresh
      if (!forceRefresh) {
        const cachedData = await AsyncStorage.getItem(DASHBOARD_STORAGE_KEY);
        if (cachedData) {
          console.log('Loading dashboard data from cache');
          return JSON.parse(cachedData);
        }
      }

      console.log('Loading dashboard data from network');
      const { auth } = getState();
      let { token, user } = auth;
      
      // If token is not in state, try to get it from storage
      if (!token) {
        token = await storage.getToken();
      }
      
      const stateId = user?.state_id || 'S04';
      const districtId = user?.district_id || 'S0429';
      const assemblyId = user?.assembly_id || '195';

      // For admin users, call admin-specific endpoints
      let usersResponse, votersResponse, boothsResponse, constituenciesResponse;
      
      if (user?.role === 'super_admin' || user?.role === 'admin') {
        console.log('Loading admin-specific data...');
        const [adminUsers, adminVoters, adminBooths, adminConstituencies] = await Promise.all([
          apiClient.get('/users/', token),
          apiClient.get('/voters/', token),
          apiClient.get('/users/assigned-booths', token),
          apiClient.get('/users/assigned-constituencies', token)
        ]);
        
        usersResponse = adminUsers;
        votersResponse = adminVoters;
        boothsResponse = adminBooths;
        constituenciesResponse = adminConstituencies;
      } else {
        console.log('Loading general data...');
        const [generalUsers, generalVoters, generalBooths, generalConstituencies] = await Promise.all([
          apiClient.get('/users', token),
          apiClient.get('/voters', token),
          apiClient.get('/general/booths', token, {
            state_id: stateId,
            district_id: districtId,
            assembly_id: assemblyId
          }),
          apiClient.get('/general/assembly', token, {
            state_id: stateId,
          })
        ]);
        
        usersResponse = generalUsers;
        votersResponse = generalVoters;
        boothsResponse = generalBooths;
        constituenciesResponse = generalConstituencies;
      }

      const dashboardData = {
        users: usersResponse || [],
        voters: votersResponse || [],
        booths: boothsResponse || [],
        constituencies: constituenciesResponse || [],
        lastUpdated: new Date().toISOString()
      };

      // Save to AsyncStorage
      await AsyncStorage.setItem(DASHBOARD_STORAGE_KEY, JSON.stringify(dashboardData));
      return dashboardData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const loadCachedDashboardData = createAsyncThunk(
  'dashboard/loadCached',
  async (_, { rejectWithValue }) => {
    try {
      const cachedData = await AsyncStorage.getItem(DASHBOARD_STORAGE_KEY);
      return cachedData ? JSON.parse(cachedData) : null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    users: [],
    voters: [],
    booths: [],
    constituencies: [],
    admins: [],
    boothBoys: [],
    loading: false,
    error: null,
    lastUpdated: null,
    stats: {
      totalAdmins: 0,
      totalBoothBoys: 0,
      totalBooths: 0,
      totalVoters: 0,
      totalConstituencies: 0
    }
  },
  reducers: {
    clearDashboardData: (state) => {
      state.users = [];
      state.voters = [];
      state.booths = [];
      state.constituencies = [];
      state.admins = [];
      state.boothBoys = [];
      state.stats = {
        totalAdmins: 0,
        totalBoothBoys: 0,
        totalBooths: 0,
        totalVoters: 0,
        totalConstituencies: 0
      };
      state.lastUpdated = null;
      AsyncStorage.removeItem(DASHBOARD_STORAGE_KEY);
    },
    addNewUser: (state, action) => {
      const newUser = action.payload;
      state.users.push(newUser);
      
      // Update stats immediately
      const admins = state.users.filter(u => 
        u.Role === 'Admin' || u.Role === 'admin' || u.Role === 'super_admin'
      );
      const boothBoys = state.users.filter(u => 
        u.Role === 'booth_boy' || u.Role === 'boothboy'
      );
      
      state.admins = admins;
      state.boothBoys = boothBoys;
      state.stats = {
        totalAdmins: admins.length,
        totalBoothBoys: boothBoys.length,
        totalBooths: state.booths.length,
        totalVoters: state.voters.length,
        totalConstituencies: state.constituencies.length
      };
      
      // Update AsyncStorage
      const dashboardData = {
        users: state.users,
        voters: state.voters,
        booths: state.booths,
        constituencies: state.constituencies,
        lastUpdated: new Date().toISOString()
      };
      AsyncStorage.setItem(DASHBOARD_STORAGE_KEY, JSON.stringify(dashboardData));
    },
    updateStats: (state) => {
      const admins = state.users.filter(u => 
        u.Role === 'Admin' || u.Role === 'admin' || u.Role === 'super_admin'
      );
      const boothBoys = state.users.filter(u => 
        u.Role === 'booth_boy' || u.Role === 'boothboy'
      );

      console.log('UpdateStats - Constituencies array:', state.constituencies);
      console.log('UpdateStats - Constituencies length:', state.constituencies?.length);

      state.admins = admins;
      state.boothBoys = boothBoys;
      state.stats = {
        totalAdmins: admins.length,
        totalBoothBoys: boothBoys.length,
        totalBooths: state.booths.length,
        totalVoters: state.voters.length,
        totalConstituencies: state.constituencies.length
      };
      
      console.log('UpdateStats - Final stats:', state.stats);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users || [];
        state.voters = action.payload.voters || [];
        state.booths = action.payload.booths || [];
        state.constituencies = action.payload.constituencies || [];
        state.lastUpdated = action.payload.lastUpdated;
        console.log('Dashboard data loaded:');
        console.log('Raw constituencies data:', action.payload.constituencies);
        console.log('Booths count:', state.booths?.length);
        console.log('Constituencies count:', state.constituencies?.length);
        dashboardSlice.caseReducers.updateStats(state);
      })
      .addCase(loadDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loadCachedDashboardData.fulfilled, (state, action) => {
        if (action.payload) {
          state.users = action.payload.users || [];
          state.voters = action.payload.voters || [];
          state.booths = action.payload.booths || [];
          state.constituencies = action.payload.constituencies || [];
          state.lastUpdated = action.payload.lastUpdated;
          dashboardSlice.caseReducers.updateStats(state);
        }
      })
      .addCase(createUser.fulfilled, (state, action) => {
        // Add new user to dashboard state
        const newUser = action.payload.user || action.payload;
        if (newUser) {
          state.users.push(newUser);
          dashboardSlice.caseReducers.updateStats(state);
        }
      });
  }
});

export const { clearDashboardData, updateStats, addNewUser } = dashboardSlice.actions;
export default dashboardSlice.reducer;