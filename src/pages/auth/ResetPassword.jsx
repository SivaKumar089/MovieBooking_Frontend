import React, { useState } from "react";
import axios from "../../utils/axios";
import { toast } from "react-toastify";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { FaEye, FaEyeSlash, FaLock, FaEnvelope, FaKey, FaArrowLeft, FaCheckCircle, FaSpinner } from "react-icons/fa";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromOTP = location.state?.email || "";
  const [formData, setFormData] = useState({
    email: emailFromOTP,
    new_password: "",
    confirm_password: "",
  });

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.new_password || formData.new_password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    if (formData.new_password !== formData.confirm_password) {
      toast.error("Passwords do not match. Please verify.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await axios.post("password/reset/", {
        email: formData.email.trim(),
        new_password: formData.new_password,
      });

      toast.success(res.data?.message || "Password reset successful! Sign in with your new credentials.");
      navigate("/auth/login", { replace: true });
    } catch (err) {
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        (typeof err.response?.data === "string" && !err.response.data.includes("<!DOCTYPE") ? err.response.data : "") ||
        err.message ||
        "Password reset failed. Please try again.";
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 px-4 py-12 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div
        data-aos="fade-up"
        className="w-full max-w-md bg-slate-900/85 backdrop-blur-2xl rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-2xl relative z-10"
      >
        <Link
          to="/auth/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-amber-400 transition mb-6"
        >
          <FaArrowLeft size={10} /> Back to Sign In
        </Link>

        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center shadow-lg shadow-amber-500/25 mb-4">
            <FaLock className="text-white text-xl" />
          </div>
          <h1 className="text-2xl font-bold text-white">Create New Password</h1>
          <p className="text-xs text-slate-400 mt-1">
            Set a new secure password for your SeatLock Cinema account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5"
            >
              Account Email
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs pointer-events-none" />
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                required
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-400 text-slate-100 pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition placeholder:text-slate-500"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="new_password"
              className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5"
            >
              New Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs pointer-events-none" />
              <input
                id="new_password"
                name="new_password"
                type={showNewPassword ? "text" : "password"}
                value={formData.new_password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-400 text-slate-100 pl-10 pr-10 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition placeholder:text-slate-500"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer p-0.5"
              >
                {showNewPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="confirm_password"
              className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5"
            >
              Confirm New Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs pointer-events-none" />
              <input
                id="confirm_password"
                name="confirm_password"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirm_password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-400 text-slate-100 pl-10 pr-10 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition placeholder:text-slate-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer p-0.5"
              >
                {showConfirmPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold py-3.5 rounded-xl shadow-lg shadow-amber-500/20 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer text-sm disabled:opacity-50"
          >
            {submitting ? (
              <>
                <FaSpinner className="animate-spin text-base" />
                <span>Updating Password...</span>
              </>
            ) : (
              <>
                <FaCheckCircle />
                <span>Save New Password</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
