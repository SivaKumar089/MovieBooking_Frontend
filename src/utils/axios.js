import axios from "axios";
import {jwtDecode} from "jwt-decode";
import dayjs from "dayjs";
import store from "../redux/store";
import { refreshToken as updateAccessToken, logout } from "../redux/authSlice";

const baseURL = import.meta.env.VITE_BACKEND_URL;



const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(async (req) => {
  const state = store.getState();
  let access = state.auth.access;
  const refresh = state.auth.refresh;

  if (access) {
    const user = jwtDecode(access);
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

    if (isExpired && refresh) {
      try {
        const response = await axios.post(`${baseURL}/token/refresh/`, {
          refresh,
        });
        access = response.data.access;
        store.dispatch(updateAccessToken({ access }));
      } catch (err) {
        store.dispatch(logout());
      }
    }

    req.headers.Authorization = `Bearer ${access}`;
  }

  return req;
});

export default axiosInstance;
