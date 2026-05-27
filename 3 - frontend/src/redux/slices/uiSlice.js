import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isDarkMode: localStorage.getItem('isDarkMode') !== null ? JSON.parse(localStorage.getItem('isDarkMode')) : true,
  connected: false,
  toasts: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setDarkMode: (state, action) => {
      state.isDarkMode = action.payload;
    },
    setConnected: (state, action) => {
      state.connected = action.payload;
    },
    addToast: (state, action) => {
      const toast = {
        id: Date.now(),
        ...action.payload,
      };
      state.toasts.push(toast);
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter(t => t.id !== action.payload);
    },
  },
});

export const { setDarkMode, setConnected, addToast, removeToast } = uiSlice.actions;
export default uiSlice.reducer;
