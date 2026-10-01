import React, { useState } from "react";
import axios from "../../utils/axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaCheckCircle,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaEnvelope,
  FaUser,
  FaTheaterMasks,
  FaTicketAlt,
  FaArrowRight,
  FaSpinner,
  FaShieldAlt,
  FaKey,
} from "react-icons/fa";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [code, setOtp] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSendOtp = async () => {
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrors((prev) => ({ ...prev, email: "Please enter a valid email address." }));
      return;
    }

    setSendingOtp(true);
    try {
      const response = await axios.post("email/request/", {
        email: formData.email,
      });
      toast.success(response.data.message || "Verification code sent to your email!");
      setOtpSent(true);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to send verification code.");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!code || code.length < 4) {
      toast.error("Please enter the verification code.");
      return;
    }

    setVerifyingOtp(true);
    try {
      await axios.post("email/verify/", {
        email: formData.email,
        code,
      });
      setEmailVerified(true);
      toast.success("Email verified successfully! Complete your VIP profile.");
    } catch (err) {
      toast.error(err.response?.data?.error || "Invalid or expired verification code.");
    } finally {
      setVerifyingOtp(false);
    }
  };

  const validateForm = () => {
    const { username, password, role } = formData;
    const newErrors = {};

    if (!username.trim()) newErrors.username = "Name is required.";
    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }
    if (!role) newErrors.role = "Please select a cinema role.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailVerified) {
      toast.error("Please verify your email with the OTP before continuing.");
      return;
    }

    if (!validateForm()) return;

    setSubmitting(true);
    try {
      await axios.post("signup/", formData);
      toast.success("Registration successful! Welcome to SeatLock Cinema.");
      navigate("/auth/login");
    } catch (err) {
      const errorMsg =
        err.response?.data?.detail ||
        Object.values(err.response?.data || {})[0] ||
        "Signup failed. Please try again.";
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 px-4 py-12 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/3 translate-x-1/2 w-[400px] h-[400px] bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div
        data-aos="fade-up"
        className="w-full max-w-lg bg-slate-900/85 backdrop-blur-2xl rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-2xl relative z-10"
      >
        {/* Cinema Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <Link to="/" className="flex items-center gap-2.5 mb-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center shadow-lg shadow-amber-500/25 group-hover:scale-105 transition">
              <FaLock className="text-white text-lg" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white">
              Seat<span className="text-amber-400">Lock</span>
            </span>
          </Link>
          <span className="text-xs uppercase tracking-widest font-bold text-amber-400/90 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            Cinema Pass Registration
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-white mt-3">
            Create Your Cinema Account
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Join SeatLock for instant VIP recliners & seamless box-office management
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Step 1: Email & OTP Verification */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5"
            >
              Email Address
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs pointer-events-none" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  disabled={emailVerified || sendingOtp}
                  className={`w-full bg-slate-950/80 border ${
                    emailVerified
                      ? "border-emerald-500/60 bg-emerald-950/20 text-emerald-300"
                      : errors.email
                      ? "border-red-500"
                      : "border-slate-800 focus:border-amber-400"
                  } text-slate-100 pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition placeholder:text-slate-500 disabled:opacity-80`}
                />
              </div>

              {!emailVerified && (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={
                    !formData.email ||
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ||
                    sendingOtp
                  }
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold px-4 py-3 rounded-xl text-xs transition duration-200 whitespace-nowrap cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  {sendingOtp ? (
                    <>
                      <FaSpinner className="animate-spin text-xs" />
                      <span>Sending...</span>
                    </>
                  ) : otpSent ? (
                    "Resend"
                  ) : (
                    "Send OTP"
                  )}
                </button>
              )}
            </div>

            {errors.email && (
              <p className="text-xs text-red-400 mt-1 font-medium">{errors.email}</p>
            )}

            {emailVerified && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-1.5 font-medium">
                <FaCheckCircle size={12} /> Email successfully verified
              </div>
            )}
          </div>

          {/* OTP Input Field */}
          {otpSent && !emailVerified && (
            <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-2xl space-y-3">
              <label className="block text-xs font-semibold text-amber-400 uppercase tracking-wider">
                Enter 6-Digit Verification Code
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <FaKey className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs pointer-events-none" />
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter code"
                    maxLength={6}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-amber-400 text-slate-100 pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-mono tracking-widest text-center"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={!code || verifyingOtp}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold px-5 py-2.5 rounded-xl text-xs transition duration-200 cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  {verifyingOtp ? <FaSpinner className="animate-spin" /> : <FaCheckCircle />}
                  Verify
                </button>
              </div>
              <p className="text-[11px] text-slate-500">
                Check your inbox (and spam folder) for the confirmation code.
              </p>
            </div>
          )}

          {/* Step 2: Profile & Role Selection */}
          {emailVerified && (
            <div className="space-y-4 pt-2">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5"
                >
                  Full Name / Username
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs pointer-events-none" />
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="e.g. Siva Kumar"
                    className={`w-full bg-slate-950/80 border ${
                      errors.username
                        ? "border-red-500"
                        : "border-slate-800 focus:border-amber-400"
                    } text-slate-100 pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition`}
                  />
                </div>
                {errors.username && (
                  <p className="text-xs text-red-400 mt-1 font-medium">{errors.username}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5"
                >
                  Password (min. 6 characters)
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs pointer-events-none" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full bg-slate-950/80 border ${
                      errors.password
                        ? "border-red-500"
                        : "border-slate-800 focus:border-amber-400"
                    } text-slate-100 pl-10 pr-10 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer p-0.5"
                  >
                    {showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-400 mt-1 font-medium">{errors.password}</p>
                )}
              </div>

              {/* Interactive Role Selector Cards */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Account Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setFormData({ ...formData, role: "user" })}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition ${
                      formData.role === "user"
                        ? "bg-amber-500/15 border-amber-500/60 shadow-lg shadow-amber-500/10"
                        : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <FaTicketAlt
                        className={formData.role === "user" ? "text-amber-400" : "text-slate-500"}
                      />
                      <span className="text-xs font-bold text-white">Movie Goer</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-tight">
                      Book VIP recliners, IMAX screens & tickets
                    </p>
                  </div>

                  <div
                    onClick={() => setFormData({ ...formData, role: "owner" })}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition ${
                      formData.role === "owner"
                        ? "bg-amber-500/15 border-amber-500/60 shadow-lg shadow-amber-500/10"
                        : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <FaTheaterMasks
                        className={formData.role === "owner" ? "text-amber-400" : "text-slate-500"}
                      />
                      <span className="text-xs font-bold text-white">Theater Owner</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-tight">
                      Manage cinemas, screens, shows & schedules
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold py-3.5 rounded-xl shadow-lg shadow-amber-500/20 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer text-sm disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <FaSpinner className="animate-spin text-base" />
                    <span>Creating Cinema Account...</span>
                  </>
                ) : (
                  <>
                    <span>Complete VIP Registration</span>
                    <FaArrowRight size={12} />
                  </>
                )}
              </button>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 text-center text-xs text-slate-400">
          Already have an account?{" "}
          <Link
            to="/auth/login"
            className="font-bold text-amber-400 hover:text-amber-300 ml-1 transition hover:underline"
          >
            Sign In Here
          </Link>
        </div>

        <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-600">
          <FaShieldAlt className="text-emerald-500" />
          <span>SeatLock Secure Verification • ACID Guaranteed</span>
        </div>
      </div>
    </div>
  );
};

export default Signup;
