import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { refreshToken } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { refreshAccessToken } from "../../api/auth";

export default function TokenRefresh() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { refresh } = useSelector((state) => state.auth);

  useEffect(() => {
    const refreshTokenFunc = async () => {
      try {
        const data = await refreshAccessToken(refresh);
        dispatch(refreshToken({ access: data.access }));
        toast.success("Access Token Refreshed");
        navigate("/auth/profile");
      } catch (error) {
        toast.error("Failed to refresh token. Please login again.");
        navigate("/auth/loginpage");
      }
    };
    if (refresh) {
      refreshTokenFunc();
    } else {
      toast.error("No refresh token found. Please login.");
      navigate("/auth/loginpage");
    }
  }, [dispatch, navigate, refresh]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center text-lg text-gray-700 animate-pulse">
        Refreshing token...
      </div>
    </div>
  );
}
