import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: localStorage.getItem('authToken'),
  user: localStorage.getItem('authUser') ? JSON.parse(localStorage.getItem('authUser')) : null,
  isAuthenticated: !!localStorage.getItem('authToken'),
  adminMode: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthToken: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    setAuthUser: (state, action) => {
      state.user = action.payload;
    },
    setAdminMode: (state, action) => {
      state.adminMode = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.adminMode = false;
    },
    loginSuccess: (state, action) => {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;
      state.isAuthenticated = true;
      state.adminMode = false;
    },
  },
});

export const { setAuthToken, setAuthUser, setAdminMode, logout, loginSuccess } = authSlice.actions;
export default authSlice.reducer;
