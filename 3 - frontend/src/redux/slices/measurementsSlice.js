import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  limit: 50,
};

const measurementsSlice = createSlice({
  name: 'measurements',
  initialState,
  reducers: {
    setMeasurements: (state, action) => {
      state.items = action.payload;
    },
    addMeasurement: (state, action) => {
      state.items = [action.payload, ...state.items].slice(0, state.limit);
    },
    setLimit: (state, action) => {
      state.limit = action.payload;
    },
    clearMeasurements: (state) => {
      state.items = [];
    },
  },
});

export const { setMeasurements, addMeasurement, setLimit, clearMeasurements } = measurementsSlice.actions;
export default measurementsSlice.reducer;
