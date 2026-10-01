import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { refreshToken } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { refreshAccessToken } from "../../api/auth";
import { FaSpinner, FaLock } from "react-icons/fa";

export default function TokenRefresh() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { refresh } = useSelector((state) => state.auth);

  useEffect(() => {
    const refreshTokenFunc = async () => {
      try {
        const data = await refreshAccessToken(refresh);
        dispatch(refreshToken({ access: data.access }));
        toast.success("Security token refreshed");
        navigate("/auth/profile");
      } catch (error) {
        toast.error("Session expired. Please sign in again.");
        navigate("/auth/login");
      }
    };
    if (refresh) {
      refreshTokenFunc();
    } else {
      toast.error("No active session found. Please sign in.");
      navigate("/auth/login");
    }
  }, [dispatch, navigate, refresh]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
          <FaSpinner className="animate-spin text-amber-400 text-2xl" />
        </div>
        <div>
          <div className="font-bold text-white text-base">Refreshing Cinema Session</div>
          <div className="text-xs text-slate-400 mt-1">Verifying cryptographic token credentials...</div>
        </div>
      </div>
    </div>
  );
}
