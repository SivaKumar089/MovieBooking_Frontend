import React, { useState } from "react";
import axios from "../../utils/axios";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaKey, FaArrowLeft, FaSpinner, FaLock, FaShieldAlt } from "react-icons/fa";

export default function OTPRequest() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [sendingOtp, setSendingOtp] = useState(false);

  const validateEmail = () => {
    if (!email.trim()) return "Email is required.";
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) return "Enter a valid email address.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateEmail();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSendingOtp(true);
    try {
      await axios.post("otp/request/", { email });
      toast.success("Security code dispatched to your email!");
      navigate("/auth/otp/verify", { state: { email } });
    } catch (err) {
      const msg = err.response?.data?.error || "Error sending recovery code";
      toast.error(msg);
    } finally {
      setSendingOtp(false);
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
            <FaKey className="text-white text-xl" />
          </div>
          <h1 className="text-2xl font-bold text-white">Reset Password</h1>
          <p className="text-xs text-slate-400 mt-1">
            Enter your registered cinema email address to receive a secure OTP code.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5"
            >
              Registered Email
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs pointer-events-none" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                placeholder="name@example.com"
                className={`w-full bg-slate-950/80 border ${
                  error ? "border-red-500" : "border-slate-800 focus:border-amber-400"
                } text-slate-100 pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition placeholder:text-slate-500`}
              />
            </div>
            {error && <p className="text-xs text-red-400 mt-1 font-medium">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={!email.trim() || sendingOtp}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold py-3.5 rounded-xl shadow-lg shadow-amber-500/20 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer text-sm disabled:opacity-50"
          >
            {sendingOtp ? (
              <>
                <FaSpinner className="animate-spin text-base" />
                <span>Sending Code...</span>
              </>
            ) : (
              <span>Send Recovery Code</span>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800/80 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
          <FaShieldAlt className="text-emerald-500" />
          <span>SeatLock Identity Guard</span>
        </div>
      </div>
    </div>
  );
}
