import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { refreshToken } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { refreshAccessToken } from "../../api/auth"; // ✅ Import from API file

export default function TokenRefresh() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { refresh } = useSelector((state) => state.auth); // ✅ get refresh token

  useEffect(() => {
    const refreshTokenFunc = async () => {
      try {
        const data = await refreshAccessToken(refresh); // API call
        dispatch(refreshToken({ access: data.access })); // update Redux
        toast.success("🔁 Access Token Refreshed");
        navigate("/auth/profile");
      } catch (error) {
        toast.error("❌ Failed to refresh token. Please login again.");
        navigate("/auth/login");
      }
    };
    if (refresh) {
      refreshTokenFunc();
    } else {
      toast.error("No refresh token found. Please login.");
      navigate("/login");
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
