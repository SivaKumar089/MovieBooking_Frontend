import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    access: null,
    refresh: null,
  },
  reducers: {
    loginSuccess: (state, action) => {
      const { access, refresh } = action.payload;
      state.user = jwtDecode(access);
      state.access = access;
      state.refresh = refresh;
    },
    logout: (state) => {
      state.user = null;
      state.access = null;
      state.refresh = null;
    },
    refreshToken: (state, action) => {
      state.access = action.payload.access;
    },
  },
});

export const { loginSuccess, logout, refreshToken } = authSlice.actions;
export default authSlice.reducer;
