import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../../services/api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ADMIN_DASHBOARD_STORAGE_KEY = '@admin_dashboard_data';

export const loadAdminDashboardData = createAsyncThunk(
  'adminDashboard/loadData',
  async (forceRefresh = false, { getState, rejectWithValue }) => {
    try {
      console.log('=== ADMIN DASHBOARD SLICE CALLED ===');
      console.log('Force refresh:', forceRefresh);
      
      const { auth } = getState();
      const { token, user } = auth;
      
      console.log('User Role:', user?.role);
      console.log('🔑 Token from auth state:', token);
      console.log('🔑 Token type:', typeof token);
      console.log('🔑 Token length:', token?.length);
      console.log('🔑 Token null/undefined:', token == null);
      
      if (!forceRefresh) {
        const cachedData = await AsyncStorage.getItem(ADMIN_DASHBOARD_STORAGE_KEY);
        if (cachedData) {
          console.log('Returning cached data');
          return JSON.parse(cachedData);
        }
      }
      
      if (!token) {
        console.log('❌ NO TOKEN FOUND - checking AsyncStorage...');
        const storedToken = await AsyncStorage.getItem('@auth_token');
        console.log('🔑 Stored token:', storedToken);
        throw new Error('No authentication token found');
      }
      
      const [createdUsersResponse, assignedBoothsResponse, assignedConstituenciesResponse, votersResponse] = await Promise.all([
        apiClient.get('/users/', token),
        apiClient.get('/users/assigned-booths', token),
        apiClient.get('/users/assigned-constituencies', token),
        apiClient.get('/voters/', token)
      ]);

      console.log('=== API RESPONSES ===');
      console.log('Created Users Response:', JSON.stringify(createdUsersResponse, null, 2));
      console.log('Assigned Booths Response:', JSON.stringify(assignedBoothsResponse, null, 2));
      console.log('Assigned Constituencies Response:', JSON.stringify(assignedConstituenciesResponse, null, 2));
      console.log('Voters Response Count:', votersResponse?.length || 0);
      console.log('====================');

      // Process users data
      const users = createdUsersResponse || [];
      const admins = users.filter(u => u.Role === 'admin' || u.Role === 'Admin');
      const boothBoys = users.filter(u => u.Role === 'booth_boy' || u.Role === 'boothboy');

      const dashboardData = {
        createdUsers: users,
        admins: admins,
        boothBoys: boothBoys,
        assignedBooths: assignedBoothsResponse || [],
        assignedConstituencies: assignedConstituenciesResponse || [],
        voters: votersResponse || [],
        adminInfo: {
          fullname: user.fullname,
          username: user.username,
          phone: user.phone,
          email: user.email,
          created_by: user.created_by
        },
        lastUpdated: new Date().toISOString()
      };

      await AsyncStorage.setItem(ADMIN_DASHBOARD_STORAGE_KEY, JSON.stringify(dashboardData));
      return dashboardData;
    } catch (error) {
      console.log('Admin Dashboard API - Error:', error.message);
      return rejectWithValue(error.message);
    }
  }
);

const adminDashboardSlice = createSlice({
  name: 'adminDashboard',
  initialState: {
    createdUsers: [],
    admins: [],
    boothBoys: [],
    assignedBooths: [],
    assignedConstituencies: [],
    voters: [],
    adminInfo: {
      fullname: '',
      username: '',
      phone: '',
      email: '',
      created_by: ''
    },
    loading: false,
    error: null,
    lastUpdated: null,
    stats: {
      totalCreatedUsers: 0,
      totalAdmins: 0,
      totalBoothBoys: 0,
      totalAssignedBooths: 0,
      totalAssignedConstituencies: 0,
      totalVoters: 0
    }
  },
  reducers: {
    clearAdminDashboardData: (state) => {
      state.createdUsers = [];
      state.admins = [];
      state.boothBoys = [];
      state.assignedBooths = [];
      state.assignedConstituencies = [];
      state.voters = [];
      state.adminInfo = { fullname: '', username: '', phone: '', email: '', created_by: '' };
      state.stats = { totalCreatedUsers: 0, totalAdmins: 0, totalBoothBoys: 0, totalAssignedBooths: 0, totalAssignedConstituencies: 0, totalVoters: 0 };
      state.lastUpdated = null;
      AsyncStorage.removeItem(ADMIN_DASHBOARD_STORAGE_KEY);
    },
    updateAdminStats: (state) => {
      state.stats = {
        totalCreatedUsers: state.createdUsers.length,
        totalAdmins: state.admins.length,
        totalBoothBoys: state.boothBoys.length,
        totalAssignedBooths: state.assignedBooths.length,
        totalAssignedConstituencies: state.assignedConstituencies.length,
        totalVoters: state.voters.length
      };
      console.log('📊 Updated Admin Stats:', state.stats);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadAdminDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadAdminDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.createdUsers = action.payload.createdUsers;
        state.admins = action.payload.admins;
        state.boothBoys = action.payload.boothBoys;
        state.assignedBooths = action.payload.assignedBooths;
        state.assignedConstituencies = action.payload.assignedConstituencies;
        state.voters = action.payload.voters;
        state.adminInfo = action.payload.adminInfo;
        state.lastUpdated = action.payload.lastUpdated;
        adminDashboardSlice.caseReducers.updateAdminStats(state);
      })
      .addCase(loadAdminDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearAdminDashboardData, updateAdminStats } = adminDashboardSlice.actions;
export default adminDashboardSlice.reducer;