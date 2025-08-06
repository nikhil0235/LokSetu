import { createSlice } from '@reduxjs/toolkit';

// Constants
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto',
  HIGH_CONTRAST: 'high-contrast',
  BLUE: 'blue',
  GREEN: 'green',
  PURPLE: 'purple',
};

export const LANGUAGES = {
  ENGLISH: 'en',
  HINDI: 'hi',
  BHOJPURI: 'bho',
  MAITHILI: 'mai',
  MAGAHI: 'mag',
};

// Initial State
const initialState = {
  // Theme Settings
  theme: {
    mode: THEMES.LIGHT,
    primaryColor: '#1976d2',
    accentColor: '#ff5722',
    fontSize: 'medium', // small, medium, large, xlarge
    fontFamily: 'Inter', // Inter, Roboto, Noto Sans, Custom
    customCSS: '',
  },
  
  // Language Settings
  language: {
    primary: LANGUAGES.ENGLISH,
    secondary: LANGUAGES.HINDI,
    showPhonetic: true,
    dateFormat: 'DD/MM/YYYY', // DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD
    timeFormat: '24h', // 12h, 24h
  },
  
  // Layout Settings
  layout: {
    sidebarCollapsed: false,
    viewMode: 'grid', // grid, list, card
    itemsPerPage: 50,
    compactMode: false,
    showPhotos: true,
    showPhoneticNames: true,
    showAgeDisplay: true,
    showEmptyFields: false,
    groupByBooth: false,
  },
  
  // Notification Settings
  notifications: {
    enabled: true,
    showToasts: true,
    soundEnabled: false,
    updateInterval: 30000, // 30 seconds
  },
  
  // Performance Settings
  performance: {
    virtualScrolling: true,
    cacheTimeout: 300000, // 5 minutes
    autoSave: true,
    autoSaveInterval: 60000, // 1 minute
    lazyLoadImages: true,
    animationsEnabled: true,
  },
  
  // User Preferences
  user: {
    name: '',
    role: 'user',
    avatar: '',
    defaultConstituency: null,
    defaultBooth: null,
    preferences: {
      showTutorial: true,
      enableShortcuts: true,
      enableAnalytics: true,
    },
  },
  
  // Feature Flags
  features: {
    bulkOperations: true,
    advancedFilters: true,
    exportData: true,
    importData: true,
    offlineMode: true,
    voterPhotos: true,
    phoneticSearch: true,
    analytics: true,
    notifications: true,
    darkMode: true,
  },
  
  // App Metadata
  metadata: {
    version: '1.0.0',
    lastUpdated: Date.now(),
    environment: process.env.NODE_ENV || 'development',
  },
};

// App Config Slice
const appConfigSlice = createSlice({
  name: 'appConfig',
  initialState,
  reducers: {
    // Theme Actions
    setTheme: (state, action) => {
      state.theme.mode = action.payload;
    },
    
    setPrimaryColor: (state, action) => {
      state.theme.primaryColor = action.payload;
    },
    
    setFontSize: (state, action) => {
      state.theme.fontSize = action.payload;
    },
    
    setFontFamily: (state, action) => {
      state.theme.fontFamily = action.payload;
    },
    
    // Language Actions
    setPrimaryLanguage: (state, action) => {
      state.language.primary = action.payload;
    },
    
    setSecondaryLanguage: (state, action) => {
      state.language.secondary = action.payload;
    },
    
    togglePhoneticDisplay: (state) => {
      state.language.showPhonetic = !state.language.showPhonetic;
    },
    
    setDateFormat: (state, action) => {
      state.language.dateFormat = action.payload;
    },
    
    // Layout Actions
    toggleSidebar: (state) => {
      state.layout.sidebarCollapsed = !state.layout.sidebarCollapsed;
    },
    
    setViewMode: (state, action) => {
      state.layout.viewMode = action.payload;
    },
    
    setItemsPerPage: (state, action) => {
      state.layout.itemsPerPage = action.payload;
    },
    
    toggleCompactMode: (state) => {
      state.layout.compactMode = !state.layout.compactMode;
    },
    
    togglePhotos: (state) => {
      state.layout.showPhotos = !state.layout.showPhotos;
    },
    
    togglePhoneticNames: (state) => {
      state.layout.showPhoneticNames = !state.layout.showPhoneticNames;
    },
    
    toggleAgeDisplay: (state) => {
      state.layout.showAgeDisplay = !state.layout.showAgeDisplay;
    },
    
    toggleEmptyFields: (state) => {
      state.layout.showEmptyFields = !state.layout.showEmptyFields;
    },
    
    toggleGroupByBooth: (state) => {
      state.layout.groupByBooth = !state.layout.groupByBooth;
    },
    
    // Notification Actions
    toggleNotifications: (state) => {
      state.notifications.enabled = !state.notifications.enabled;
    },
    
    toggleToasts: (state) => {
      state.notifications.showToasts = !state.notifications.showToasts;
    },
    
    toggleSound: (state) => {
      state.notifications.soundEnabled = !state.notifications.soundEnabled;
    },
    
    setUpdateInterval: (state, action) => {
      state.notifications.updateInterval = action.payload;
    },
    
    // Performance Actions
    toggleVirtualScrolling: (state) => {
      state.performance.virtualScrolling = !state.performance.virtualScrolling;
    },
    
    setCacheTimeout: (state, action) => {
      state.performance.cacheTimeout = action.payload;
    },
    
    toggleAutoSave: (state) => {
      state.performance.autoSave = !state.performance.autoSave;
    },
    
    setAutoSaveInterval: (state, action) => {
      state.performance.autoSaveInterval = action.payload;
    },
    
    // User Actions
    setUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    
    setDefaultConstituency: (state, action) => {
      state.user.defaultConstituency = action.payload;
    },
    
    setDefaultBooth: (state, action) => {
      state.user.defaultBooth = action.payload;
    },
    
    // Feature Flag Actions
    toggleFeature: (state, action) => {
      const feature = action.payload;
      state.features[feature] = !state.features[feature];
    },
    
    // Bulk Update
    updateConfig: (state, action) => {
      const { section, updates } = action.payload;
      if (state[section]) {
        state[section] = { ...state[section], ...updates };
      }
    },
    
    // Reset to Defaults
    resetToDefaults: (state) => {
      return { ...initialState, metadata: state.metadata };
    },
    
    // Update Metadata
    updateMetadata: (state, action) => {
      state.metadata = { ...state.metadata, ...action.payload };
      state.metadata.lastUpdated = Date.now();
    },
  },
});

export const {
  setTheme,
  setPrimaryColor,
  setFontSize,
  setFontFamily,
  setPrimaryLanguage,
  setSecondaryLanguage,
  togglePhoneticDisplay,
  setDateFormat,
  toggleSidebar,
  setViewMode,
  setItemsPerPage,
  toggleCompactMode,
  togglePhotos,
  togglePhoneticNames,
  toggleAgeDisplay,
  toggleEmptyFields,
  toggleGroupByBooth,
  toggleNotifications,
  toggleToasts,
  toggleSound,
  setUpdateInterval,
  toggleVirtualScrolling,
  setCacheTimeout,
  toggleAutoSave,
  setAutoSaveInterval,
  setUser,
  setDefaultConstituency,
  setDefaultBooth,
  toggleFeature,
  updateConfig,
  resetToDefaults,
  updateMetadata,
} = appConfigSlice.actions;

export default appConfigSlice.reducer;