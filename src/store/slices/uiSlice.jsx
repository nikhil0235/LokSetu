import { createSlice } from '@reduxjs/toolkit';

// Initial State
const initialState = {
  // Modal Management
  modals: {
    voterDetail: { isOpen: false, data: null },
    bulkUpdate: { isOpen: false, data: null },
    filterPanel: { isOpen: false, data: null },
    settings: { isOpen: false, data: null },
    export: { isOpen: false, data: null },
    import: { isOpen: false, data: null },
    confirmation: { isOpen: false, data: null },
    photoViewer: { isOpen: false, data: null },
    feedback: { isOpen: false, data: null },
  },
  
  // Panel Management
  panels: {
    sidebar: { isOpen: true, width: 280, content: 'navigation' },
    rightPanel: { isOpen: false, width: 400, content: null },
    bottomPanel: { isOpen: false, height: 300, content: null },
  },
  
  // Loading States
  loading: {
    global: false,
    overlay: false,
    components: {},
  },
  
  // Notifications
  notifications: {
    list: [],
    maxCount: 5,
    defaultDuration: 5000,
  },
  
  // Toast Messages
  toasts: {
    list: [],
    maxCount: 3,
    defaultDuration: 3000,
  },
  
  // Progress Indicators
  progress: {
    active: false,
    value: 0,
    max: 100,
    message: '',
    indeterminate: false,
  },
  
  // Form States
  forms: {
    voterEdit: {
      isDirty: false,
      errors: {},
      isSubmitting: false,
    },
    bulkUpdate: {
      isDirty: false,
      errors: {},
      isSubmitting: false,
    },
    filters: {
      isDirty: false,
      errors: {},
      isSubmitting: false,
    },
  },
  
  // View State
  view: {
    currentPage: 'voters',
    pageTitle: 'Voter Management',
    breadcrumbs: [],
    isFullscreen: false,
  },
  
  // Selection State
  selection: {
    mode: false, // true when in selection mode
    lastSelectedIndex: -1,
    selectAllState: false, // false, true, 'indeterminate'
  },
  
  // Responsive
  responsive: {
    screenSize: 'desktop', // mobile, tablet, desktop, large
    isMobile: false,
    isTablet: false,
    sidebarCollapsed: false,
  },
  
  // Performance Monitoring
  performance: {
    renderTime: 0,
    dataLoadTime: 0,
    lastUpdate: Date.now(),
  },
  
  // Shortcuts
  shortcuts: {
    enabled: true,
    activeShortcuts: {},
  },
};

// UI Slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Modal Management
    openModal: (state, action) => {
      const { modalName, data = null } = action.payload;
      if (state.modals[modalName]) {
        state.modals[modalName] = { isOpen: true, data };
      }
    },
    
    closeModal: (state, action) => {
      const modalName = action.payload;
      if (state.modals[modalName]) {
        state.modals[modalName] = { isOpen: false, data: null };
      }
    },
    
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach(modalName => {
        state.modals[modalName] = { isOpen: false, data: null };
      });
    },
    
    updateModal: (state, action) => {
      const { modalName, data } = action.payload;
      if (state.modals[modalName] && state.modals[modalName].isOpen) {
        state.modals[modalName].data = { ...state.modals[modalName].data, ...data };
      }
    },
    
    // Panel Management
    togglePanel: (state, action) => {
      const panelName = action.payload;
      if (state.panels[panelName]) {
        state.panels[panelName].isOpen = !state.panels[panelName].isOpen;
      }
    },
    
    openPanel: (state, action) => {
      const { panelName, content = null } = action.payload;
      if (state.panels[panelName]) {
        state.panels[panelName].isOpen = true;
        if (content) {
          state.panels[panelName].content = content;
        }
      }
    },
    
    closePanel: (state, action) => {
      const panelName = action.payload;
      if (state.panels[panelName]) {
        state.panels[panelName].isOpen = false;
      }
    },
    
    setPanelContent: (state, action) => {
      const { panelName, content } = action.payload;
      if (state.panels[panelName]) {
        state.panels[panelName].content = content;
      }
    },
    
    setPanelHeight: (state, action) => {
      const { panelName, height } = action.payload;
      if (state.panels[panelName]) {
        state.panels[panelName].height = height;
      }
    },
    
    // Loading States
    setGlobalLoading: (state, action) => {
      state.loading.global = action.payload;
    },
    
    setOverlayLoading: (state, action) => {
      state.loading.overlay = action.payload;
    },
    
    setComponentLoading: (state, action) => {
      const { component, loading } = action.payload;
      state.loading.components[component] = loading;
    },
    
    // Notifications
    addNotification: (state, action) => {
      const notification = {
        id: Date.now() + Math.random(),
        timestamp: Date.now(),
        duration: state.notifications.defaultDuration,
        ...action.payload,
      };
      
      state.notifications.list.unshift(notification);
      
      // Keep only max allowed notifications
      if (state.notifications.list.length > state.notifications.maxCount) {
        state.notifications.list = state.notifications.list.slice(0, state.notifications.maxCount);
      }
    },
    
    removeNotification: (state, action) => {
      const notificationId = action.payload;
      state.notifications.list = state.notifications.list.filter(
        notification => notification.id !== notificationId
      );
    },
    
    clearNotifications: (state) => {
      state.notifications.list = [];
    },
    
    // Toast Messages
    addToast: (state, action) => {
      const toast = {
        id: Date.now() + Math.random(),
        timestamp: Date.now(),
        duration: state.toasts.defaultDuration,
        ...action.payload,
      };
      
      state.toasts.list.push(toast);
      
      // Keep only max allowed toasts
      if (state.toasts.list.length > state.toasts.maxCount) {
        state.toasts.list = state.toasts.list.slice(-state.toasts.maxCount);
      }
    },
    
    removeToast: (state, action) => {
      const toastId = action.payload;
      state.toasts.list = state.toasts.list.filter(toast => toast.id !== toastId);
    },
    
    clearToasts: (state) => {
      state.toasts.list = [];
    },
    
    // Progress
    startProgress: (state, action) => {
      state.progress = {
        active: true,
        value: 0,
        max: 100,
        message: action.payload?.message || '',
        indeterminate: action.payload?.indeterminate || false,
      };
    },
    
    updateProgress: (state, action) => {
      if (state.progress.active) {
        state.progress.value = action.payload.value || state.progress.value;
        state.progress.message = action.payload.message || state.progress.message;
      }
    },
    
    stopProgress: (state) => {
      state.progress.active = false;
      state.progress.value = 0;
      state.progress.message = '';
    },
    
    // Form States
    setFormDirty: (state, action) => {
      const { formName, isDirty } = action.payload;
      if (state.forms[formName]) {
        state.forms[formName].isDirty = isDirty;
      }
    },
    
    setFormErrors: (state, action) => {
      const { formName, errors } = action.payload;
      if (state.forms[formName]) {
        state.forms[formName].errors = errors;
      }
    },
    
    setFormSubmitting: (state, action) => {
      const { formName, isSubmitting } = action.payload;
      if (state.forms[formName]) {
        state.forms[formName].isSubmitting = isSubmitting;
      }
    },
    
    resetForm: (state, action) => {
      const formName = action.payload;
      if (state.forms[formName]) {
        state.forms[formName] = {
          isDirty: false,
          errors: {},
          isSubmitting: false,
        };
      }
    },
    
    // View State
    setCurrentPage: (state, action) => {
      const { page, title } = action.payload;
      state.view.currentPage = page;
      state.view.pageTitle = title || page;
    },
    
    setBreadcrumbs: (state, action) => {
      state.view.breadcrumbs = action.payload;
    },
    
    addBreadcrumb: (state, action) => {
      state.view.breadcrumbs.push(action.payload);
    },
    
    toggleFullscreen: (state) => {
      state.view.isFullscreen = !state.view.isFullscreen;
    },
    
    // Selection State
    setSelectionMode: (state, action) => {
      state.selection.mode = action.payload;
      if (!action.payload) {
        state.selection.lastSelectedIndex = -1;
        state.selection.selectAllState = false;
      }
    },
    
    setLastSelectedIndex: (state, action) => {
      state.selection.lastSelectedIndex = action.payload;
    },
    
    toggleSelectAll: (state) => {
      if (state.selection.selectAllState === false) {
        state.selection.selectAllState = true;
      } else {
        state.selection.selectAllState = false;
      }
    },
    
    // Responsive
    setScreenSize: (state, action) => {
      const screenSize = action.payload;
      state.responsive.screenSize = screenSize;
      state.responsive.isMobile = screenSize === 'mobile';
      state.responsive.isTablet = screenSize === 'tablet';
      
      // Auto-collapse sidebar on mobile
      if (screenSize === 'mobile') {
        state.responsive.sidebarCollapsed = true;
      }
    },
    
    // Performance
    updatePerformance: (state, action) => {
      state.performance = { ...state.performance, ...action.payload };
      state.performance.lastUpdate = Date.now();
    },
    
    // Shortcuts
    toggleShortcuts: (state) => {
      state.shortcuts.enabled = !state.shortcuts.enabled;
      if (!state.shortcuts.enabled) {
        state.shortcuts.activeShortcuts = {};
      }
    },
    
    setActiveShortcuts: (state, action) => {
      state.shortcuts.activeShortcuts = action.payload;
    },
    
    // Reset UI State
    resetUI: (state) => {
      return { ...initialState, responsive: state.responsive };
    },
  },
});

export const {
  openModal,
  closeModal,
  closeAllModals,
  updateModal,
  togglePanel,
  openPanel,
  closePanel,
  setPanelContent,
  setPanelHeight,
  setGlobalLoading,
  setOverlayLoading,
  setComponentLoading,
  addNotification,
  removeNotification,
  clearNotifications,
  addToast,
  removeToast,
  clearToasts,
  startProgress,
  updateProgress,
  stopProgress,
  setFormDirty,
  setFormErrors,
  setFormSubmitting,
  resetForm,
  setCurrentPage,
  setBreadcrumbs,
  addBreadcrumb,
  toggleFullscreen,
  setSelectionMode,
  setLastSelectedIndex,
  toggleSelectAll,
  setScreenSize,
  updatePerformance,
  toggleShortcuts,
  setActiveShortcuts,
  resetUI,
} = uiSlice.actions;

export default uiSlice.reducer;