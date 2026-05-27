import { configureStore } from '@reduxjs/toolkit';
import log from '../utils/logger.js';
import measurementsReducer from './slices/measurementsSlice';
import filtersReducer from './slices/filtersSlice';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    measurements: measurementsReducer,
    filters: filtersReducer,
    auth: authReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat((store) => (next) => (action) => {
      log.debug(`Redux Action: ${action.type}`, action.payload);
      return next(action);
    }),
});

export default store;

