import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

const getSavedTokens = () => {
  try {
    const access = localStorage.getItem("accessToken");
    const refresh = localStorage.getItem("refreshToken");
    if (access) {
      const user = jwtDecode(access);
      return { access, refresh, user };
    }
  } catch (e) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }
  return { access: null, refresh: null, user: null };
};

const saved = getSavedTokens();

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: saved.user,
    access: saved.access,
    refresh: saved.refresh,
  },
  reducers: {
    loginSuccess: (state, action) => {
      const { access, refresh } = action.payload;
      try {
        state.user = jwtDecode(access);
      } catch (e) {
        state.user = null;
      }
      state.access = access;
      state.refresh = refresh;
      if (access) localStorage.setItem("accessToken", access);
      if (refresh) localStorage.setItem("refreshToken", refresh);
    },
    logout: (state) => {
      state.user = null;
      state.access = null;
      state.refresh = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
    refreshToken: (state, action) => {
      state.access = action.payload.access;
      if (action.payload.access) {
        localStorage.setItem("accessToken", action.payload.access);
      }
    },
  },
});

export const { loginSuccess, logout, refreshToken } = authSlice.actions;
export default authSlice.reducer;
