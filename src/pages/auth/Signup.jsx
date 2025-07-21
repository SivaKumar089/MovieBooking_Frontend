import React, { useState } from "react";
import axios from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaCheckCircle,
  FaEye,
  FaEyeSlash,
  FaTimesCircle,
  FaExclamationCircle,
} from "react-icons/fa";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [code, setOtp] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [sendingOtp, setsendingOtp] = useState(false);
  const [sign, setSign] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSendOtp = async () => {
    setMessage("");
    setError("");
    setsendingOtp(true);
    if (!formData.email) {
      setError("Please enter your email.");
      return;
    }

    try {
      const response = await axios.post("email/request/", {
        email: formData.email,
      });
      setMessage(response.data.message || "OTP sent successfully.");
      setOtpSent(true);
      setsendingOtp(false);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send OTP.");
      setsendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    setMessage("");
    setError("");
    setVerifyingOtp(true);
    if (!code) {
      setError("Please enter the OTP.");
      return;
    }

    try {
      const response = await axios.post("email/verify/", {
        email: formData.email,
        code,
      });
      setEmailVerified(true);

      setMessage("Email verified successfully.");
    } catch (err) {
      setError("Invalid OTP.");
      setVerifyingOtp(false);
    }
  };

  const validateForm = () => {
    const { username, email, password, role } = formData;
    const newErrors = {};

    if (!username.trim()) newErrors.username = "Name is required.";

    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        newErrors.email = "Enter a valid email.";
      }
    }

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    if (!role) newErrors.role = "Please select a role.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSign(true);
    if (!validateForm()) {
      setSign(false);
      return;
    }

    try {
      await axios.post("/auth/signup/", formData);
      setSign(false);
      toast.success("Signup successful! Login now.");
      navigate("/auth/login");
    } catch (err) {
      setSign(false);
      
      const errorMsg =
        err.response?.data?.detail ||
        Object.values(err.response?.data || {})[0] ||
        "Signup failed. Please try again.";
      toast.error(errorMsg);
    }
  };

  return (
    <div
      data-aos="fade-up"
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 p-4"
    >
      <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl px-8 py-10 space-y-6 border border-gray-100">
        <h2 className="text-3xl font-extrabold text-center text-blue-700">
          Create Your Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email + Verify Icon */}
          <div className="relative">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`flex-1 px-4 py-2 border rounded-xl focus:ring-2 focus:outline-none shadow-sm ${
                  emailVerified
                    ? "border-green-500 bg-gray-100"
                    : "border-gray-300 focus:ring-blue-400"
                }`}
                disabled={emailVerified || sendingOtp}
              />
              {!otpSent && !emailVerified && (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={
                    !formData.email ||
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ||
                    sendingOtp
                  }
                  className={`px-4 py-2 rounded-xl  text-white transition ${
                    !formData.email ||
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ||
                    sendingOtp
                      ? "bg-blue-300 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                  }`}
                >
                  {sendingOtp ? "Sending..." : "Send OTP"}
                </button>
              )}
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* OTP Field */}
          {otpSent && !emailVerified && (
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  setOtp(e.target.value);
                  setError("");
                }}
                placeholder="Enter OTP"
                maxLength={6}
                className="w-full sm:flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
              />

              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={code.length !== 6 || verifyingOtp}
                className={`w-full sm:w-auto px-4 py-2 rounded-xl text-white transition ${
                  code.length !== 6 || verifyingOtp
                    ? "bg-green-300 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 cursor-pointer"
                }`}
              >
                {verifyingOtp ? "Verifying..." : "Verify"}
              </button>
            </div>
          )}

          {message && (
            <div className="flex items-center text-green-600 text-sm gap-2">
              <FaCheckCircle size={16} /> {message}
            </div>
          )}
          {error && (
            <div className="flex items-center text-red-600 text-sm gap-2">
              <FaExclamationCircle size={16} /> {error}
            </div>
          )}

          {/* Hidden Fields until email is verified */}
          {emailVerified && (
            <>
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  Name
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                )}
              </div>

              <div className="relative">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 cursor-pointer text-gray-500"
                >
                  {showPassword ? (
                    <FaEyeSlash size={20} />
                  ) : (
                    <FaEye size={20} />
                  )}
                </span>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  Select Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value="" disabled hidden>
                    -- Select Role --
                  </option>
                  <option value="user">User</option>
                  <option value="owner">Owner</option>
                </select>
                {errors.role && (
                  <p className="text-red-500 text-sm mt-1">{errors.role}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={sign}
                className={`w-full bg-blue-600 text-white py-2 rounded-xl font-semibold transition duration-300 shadow-md ${
                  sign
                    ? "bg-blue-400 cursor-not-allowed"
                    : "hover:bg-blue-700 cursor-pointer"
                }`}
              >
                {sign ? "Signing Up..." : "Signup"}
              </button>
            </>
          )}
        </form>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <a href="login" className="text-blue-600 font-medium hover:underline">
            Login
          </a>
        </p>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Signup;
