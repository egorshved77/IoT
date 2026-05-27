import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  timeRange: 'all',
  sortOrder: 'DESC',
  selectedDevices: [],
  selectedSensors: [],
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setTimeRange: (state, action) => {
      state.timeRange = action.payload;
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },
    toggleDevice: (state, action) => {
      const device = action.payload;
      const index = state.selectedDevices.indexOf(device);
      if (index > -1) {
        state.selectedDevices.splice(index, 1);
      } else {
        state.selectedDevices.push(device);
      }
    },
    toggleSensor: (state, action) => {
      const sensor = action.payload;
      const index = state.selectedSensors.indexOf(sensor);
      if (index > -1) {
        state.selectedSensors.splice(index, 1);
      } else {
        state.selectedSensors.push(sensor);
      }
    },
    setSelectedDevices: (state, action) => {
      state.selectedDevices = action.payload;
    },
    setSelectedSensors: (state, action) => {
      state.selectedSensors = action.payload;
    },
    clearFilters: (state) => {
      state.selectedDevices = [];
      state.selectedSensors = [];
    },
  },
});

export const {
  setTimeRange,
  setSortOrder,
  toggleDevice,
  toggleSensor,
  setSelectedDevices,
  setSelectedSensors,
  clearFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;
