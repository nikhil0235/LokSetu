import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import userSlice from './userSlice';
import voterSlice from './voterSlice';
import boothSlice from './boothSlice';
import votersSlice from './slices/voterSlice';
import boothsSlice from './slices/boothSlice';
import filtersSlice from './slices/filterSlice';
import uiSlice from './slices/uiSlice';
import appConfigSlice from './slices/appConfigSlice';
import syncSlice from './slices/syncSlice';
import constituenciesSlice from './slices/constituenciesSlice';
import dashboardSlice from './slices/dashboardSlice';
import adminDashboardSlice from './slices/adminDashboardSlice';
import {
  loggerMiddleware,
  errorMiddleware,
  apiMiddleware,
  persistMiddleware,
  analyticsMiddleware,
} from './middleware';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    users: userSlice,
    voter: voterSlice,
    voters: votersSlice,
    booths: boothsSlice,
    boothList: boothSlice,
    filters: filtersSlice,
    ui: uiSlice,
    appConfig: appConfigSlice,
    sync: syncSlice,
    constituencies: constituenciesSlice,
    dashboard: dashboardSlice,
    adminDashboard: adminDashboardSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(
      loggerMiddleware,
      errorMiddleware,
      apiMiddleware,
      persistMiddleware,
      analyticsMiddleware
    ),
  devTools: process.env.NODE_ENV !== 'production',
});
