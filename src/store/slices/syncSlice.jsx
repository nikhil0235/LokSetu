import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { syncApi } from '../../services/api';

// Async Thunks
export const syncData = createAsyncThunk(
  'sync/syncData',
  async ({ type, data }, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await syncApi.syncData({ type, data });
      
      // Update last sync time
      dispatch(updateLastSyncTime({ type, timestamp: Date.now() }));
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const syncVoterData = createAsyncThunk(
  'sync/syncVoterData',
  async ({ voterIds, updates }, { rejectWithValue }) => {
    try {
      const response = await syncApi.syncVoters({ voterIds, updates });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const downloadOfflineData = createAsyncThunk(
  'sync/downloadOfflineData',
  async ({ constituencyId, boothId }, { rejectWithValue }) => {
    try {
      const response = await syncApi.downloadOfflineData({ constituencyId, boothId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const uploadPendingChanges = createAsyncThunk(
  'sync/uploadPendingChanges',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const pendingChanges = state.sync.pendingSync;
      
      const response = await syncApi.uploadChanges(pendingChanges);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial State
const initialState = {
  isOnline: navigator.onLine,
  lastSyncTime: {
    voters: null,
    booths: null,
    constituencies: null,
  },
  pendingSync: {
    voters: [],
    booths: [],
    constituencies: [],
  },
  syncQueue: [],
  loading: {
    sync: false,
    download: false,
    upload: false,
  },
  errors: {
    sync: null,
    download: null,
    upload: null,
  },
  offlineData: {
    available: false,
    size: 0,
    lastDownloaded: null,
    version: null,
  },
  syncStatus: 'idle', // idle, syncing, error, success
  conflictResolution: 'server', // server, local, manual
  syncSettings: {
    autoSync: true,
    syncInterval: 300000, // 5 minutes
    conflictStrategy: 'server_wins',
    maxRetries: 3,
  },
  networkInfo: {
    effectiveType: '4g',
    downlink: 10,
    rtt: 100,
  },
};

// Sync Slice
const syncSlice = createSlice({
  name: 'sync',
  initialState,
  reducers: {
    setOnlineStatus: (state, action) => {
      const wasOnline = state.isOnline;
      state.isOnline = action.payload;
      
      // If coming back online and have pending changes, mark for sync
      if (!wasOnline && action.payload && state.syncQueue.length > 0) {
        state.syncStatus = 'pending';
      }
    },
    
    addToPendingSync: (state, action) => {
      const { type, data } = action.payload;
      if (state.pendingSync[type]) {
        const existingIndex = state.pendingSync[type].findIndex(item => item.id === data.id);
        if (existingIndex !== -1) {
          // Update existing item
          state.pendingSync[type][existingIndex] = { ...state.pendingSync[type][existingIndex], ...data };
        } else {
          // Add new item
          state.pendingSync[type].push({
            ...data,
            timestamp: Date.now(),
            retryCount: 0,
          });
        }
      }
    },
    
    removeFromPendingSync: (state, action) => {
      const { type, id } = action.payload;
      if (state.pendingSync[type]) {
        state.pendingSync[type] = state.pendingSync[type].filter(item => item.id !== id);
      }
    },
    
    addToSyncQueue: (state, action) => {
      const queueItem = {
        id: Date.now() + Math.random(),
        timestamp: Date.now(),
        status: 'pending',
        retryCount: 0,
        ...action.payload,
      };
      state.syncQueue.push(queueItem);
    },
    
    removeFromSyncQueue: (state, action) => {
      const itemId = action.payload;
      state.syncQueue = state.syncQueue.filter(item => item.id !== itemId);
    },
    
    updateSyncQueueItem: (state, action) => {
      const { id, updates } = action.payload;
      const itemIndex = state.syncQueue.findIndex(item => item.id === id);
      if (itemIndex !== -1) {
        state.syncQueue[itemIndex] = { ...state.syncQueue[itemIndex], ...updates };
      }
    },
    
    clearSyncQueue: (state) => {
      state.syncQueue = [];
    },
    
    updateLastSyncTime: (state, action) => {
      const { type, timestamp } = action.payload;
      state.lastSyncTime[type] = timestamp;
    },
    
    setSyncStatus: (state, action) => {
      state.syncStatus = action.payload;
    },
    
    setConflictResolution: (state, action) => {
      state.conflictResolution = action.payload;
    },
    
    updateOfflineData: (state, action) => {
      state.offlineData = { ...state.offlineData, ...action.payload };
    },
    
    updateSyncSettings: (state, action) => {
      state.syncSettings = { ...state.syncSettings, ...action.payload };
    },
    
    updateNetworkInfo: (state, action) => {
      state.networkInfo = { ...state.networkInfo, ...action.payload };
    },
    
    clearSyncErrors: (state) => {
      state.errors = {
        sync: null,
        download: null,
        upload: null,
      };
    },
    
    incrementRetryCount: (state, action) => {
      const { type, id } = action.payload;
      if (state.pendingSync[type]) {
        const itemIndex = state.pendingSync[type].findIndex(item => item.id === id);
        if (itemIndex !== -1) {
          state.pendingSync[type][itemIndex].retryCount = 
            (state.pendingSync[type][itemIndex].retryCount || 0) + 1;
        }
      }
    },
    
    markSyncComplete: (state, action) => {
      const { type, ids } = action.payload;
      if (state.pendingSync[type]) {
        state.pendingSync[type] = state.pendingSync[type].filter(
          item => !ids.includes(item.id)
        );
      }
    },
  },
  
  extraReducers: (builder) => {
    // Sync Data
    builder
      .addCase(syncData.pending, (state) => {
        state.loading.sync = true;
        state.errors.sync = null;
        state.syncStatus = 'syncing';
      })
      .addCase(syncData.fulfilled, (state, action) => {
        state.loading.sync = false;
        state.syncStatus = 'success';
        
        // Clear pending sync for successful items
        const { type, syncedIds } = action.payload;
        if (syncedIds && state.pendingSync[type]) {
          state.pendingSync[type] = state.pendingSync[type].filter(
            item => !syncedIds.includes(item.id)
          );
        }
      })
      .addCase(syncData.rejected, (state, action) => {
        state.loading.sync = false;
        state.errors.sync = action.payload;
        state.syncStatus = 'error';
      });
      
    // Download Offline Data
    builder
      .addCase(downloadOfflineData.pending, (state) => {
        state.loading.download = true;
        state.errors.download = null;
      })
      .addCase(downloadOfflineData.fulfilled, (state, action) => {
        state.loading.download = false;
        state.offlineData = {
          available: true,
          size: action.payload.size,
          lastDownloaded: Date.now(),
          version: action.payload.version,
        };
      })
      .addCase(downloadOfflineData.rejected, (state, action) => {
        state.loading.download = false;
        state.errors.download = action.payload;
      });
      
    // Upload Pending Changes
    builder
      .addCase(uploadPendingChanges.pending, (state) => {
        state.loading.upload = true;
        state.errors.upload = null;
      })
      .addCase(uploadPendingChanges.fulfilled, (state, action) => {
        state.loading.upload = false;
        
        // Clear successfully uploaded items
        const { uploadedItems } = action.payload;
        Object.keys(uploadedItems).forEach(type => {
          if (state.pendingSync[type]) {
            state.pendingSync[type] = state.pendingSync[type].filter(
              item => !uploadedItems[type].includes(item.id)
            );
          }
        });
      })
      .addCase(uploadPendingChanges.rejected, (state, action) => {
        state.loading.upload = false;
        state.errors.upload = action.payload;
      });
  },
});

export const {
  setOnlineStatus,
  addToPendingSync,
  removeFromPendingSync,
  addToSyncQueue,
  removeFromSyncQueue,
  updateSyncQueueItem,
  clearSyncQueue,
  updateLastSyncTime,
  setSyncStatus,
  setConflictResolution,
  updateOfflineData,
  updateSyncSettings,
  updateNetworkInfo,
  clearSyncErrors,
  incrementRetryCount,
  markSyncComplete,
} = syncSlice.actions;

export default syncSlice.reducer;