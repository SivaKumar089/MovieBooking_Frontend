import React, { useState, useEffect } from "react";
import axios from "../../utils/axios";
import { toast } from "react-toastify";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { FaKey, FaArrowLeft, FaCheckCircle, FaSpinner, FaShieldAlt } from "react-icons/fa";

export default function OTPVerify() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  useEffect(() => {
    const passedEmail = location.state?.email;
    if (passedEmail) {
      setEmail(passedEmail);
    } else {
      toast.error("No email session detected. Please request a new code.");
      navigate("/auth/otp/request");
    }
  }, [location.state, navigate]);

  const validate = () => {
    if (!code.trim()) return "Verification code is required.";
    if (code.length < 4) return "Code must be at least 4 characters.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setVerifyingOtp(true);
    try {
      await axios.post("otp/verify/", { email, code });
      toast.success("Identity verified! Set your new password.");
      navigate("/auth/password/reset", { state: { email } });
    } catch {
      toast.error("Invalid or expired verification code.");
      setVerifyingOtp(false);
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
          to="/auth/otp/request"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-amber-400 transition mb-6"
        >
          <FaArrowLeft size={10} /> Back
        </Link>

        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center shadow-lg shadow-amber-500/25 mb-4">
            <FaKey className="text-white text-xl" />
          </div>
          <h1 className="text-2xl font-bold text-white">Enter OTP Code</h1>
          <p className="text-xs text-slate-400 mt-1">
            We sent a verification code to{" "}
            <span className="text-amber-400 font-semibold">{email || "your email"}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="otp"
              className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 text-center"
            >
              6-Digit Security Code
            </label>
            <input
              id="otp"
              name="otp"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError("");
              }}
              maxLength={6}
              placeholder="0 0 0 0 0 0"
              className={`w-full bg-slate-950/80 border ${
                error ? "border-red-500" : "border-slate-800 focus:border-amber-400"
              } text-slate-100 text-center py-3.5 rounded-xl text-lg font-mono tracking-[0.4em] focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition placeholder:text-slate-600`}
            />
            {error && <p className="text-xs text-red-400 mt-1 text-center font-medium">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={!code || verifyingOtp}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold py-3.5 rounded-xl shadow-lg shadow-amber-500/20 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer text-sm disabled:opacity-50"
          >
            {verifyingOtp ? (
              <>
                <FaSpinner className="animate-spin text-base" />
                <span>Verifying Security Code...</span>
              </>
            ) : (
              <>
                <FaCheckCircle />
                <span>Authorize & Proceed</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800/80 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
          <FaShieldAlt className="text-emerald-500" />
          <span>Encrypted Authentication Flow</span>
        </div>
      </div>
    </div>
  );
}
