import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import votersSlice from './slices/voterSlice';
import boothsSlice from './slices/boothSlice';
import filtersSlice from './slices/filterSlice';
import uiSlice from './slices/uiSlice';
import appConfigSlice from './slices/appConfigSlice';
import syncSlice from './slices/syncSlice';
import constituenciesSlice from './slices/constituenciesSlice';
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
    voters: votersSlice,
    booths: boothsSlice,
    filters: filtersSlice,
    ui: uiSlice,
    appConfig: appConfigSlice,
    sync: syncSlice,
    constituencies: constituenciesSlice,
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
