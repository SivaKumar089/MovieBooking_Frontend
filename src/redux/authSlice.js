import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

const getSavedTokens = () => {
  try {
    const access = localStorage.getItem("accessToken");
    const refresh = localStorage.getItem("refreshToken");
    const savedUser = localStorage.getItem("user");
    if (access) {
      let user = null;
      if (savedUser) {
        try {
          user = JSON.parse(savedUser);
        } catch (e) {
          user = null;
        }
      }
      if (!user) {
        user = jwtDecode(access);
      }
      return { access, refresh, user };
    }
  } catch (e) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
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
      const { access, refresh, user } = action.payload;
      try {
        state.user = user || jwtDecode(access);
      } catch (e) {
        state.user = user || null;
      }
      state.access = access;
      state.refresh = refresh;
      if (access) localStorage.setItem("accessToken", access);
      if (refresh) localStorage.setItem("refreshToken", refresh);
      if (state.user) localStorage.setItem("user", JSON.stringify(state.user));
    },
    logout: (state) => {
      state.user = null;
      state.access = null;
      state.refresh = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
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
