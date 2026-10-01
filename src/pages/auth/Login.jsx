import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginSuccess } from "../../redux/authSlice";
import axios from "../../utils/axios";
import { toast } from "react-toastify";
import {
  FaEye,
  FaEyeSlash,
  FaLock,
  FaEnvelope,
  FaFilm,
  FaArrowRight,
  FaSpinner,
  FaShieldAlt,
} from "react-icons/fa";

export default function Login() {
  const [credentials, setCredentials] = useState({
    email_or_username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!credentials.email_or_username.trim()) {
      newErrors.email_or_username = "Email or username is required";
    }
    if (!credentials.password) {
      newErrors.password = "Password is required";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validate();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("login/", credentials);
      dispatch(loginSuccess(res.data));
      toast.success("Welcome back to SeatLock Cinema! 🎬");

      const role = res.data?.user?.role || res.data?.role;
      if (role === "admin") {
        navigate("/admin/adminpanel", { replace: true });
      } else if (role === "owner") {
        navigate("/owner/theaters", { replace: true });
      } else {
        navigate("/user/movies", { replace: true });
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.detail ||
        err.response?.data?.error ||
        "Invalid credentials. Please verify your email and password.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 px-4 py-12 relative overflow-hidden">
      {/* Cinematic Ambient Glow Spheres */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/3 translate-x-1/2 w-[400px] h-[400px] bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div
        data-aos="fade-up"
        className="w-full max-w-md bg-slate-900/85 backdrop-blur-2xl rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-2xl relative z-10"
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
            Cinema Pass Access
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-white mt-3">
            Sign In to Your Account
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Access VIP reservations, tickets, and screenings
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email_or_username"
              className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5"
            >
              Email or Username
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs pointer-events-none" />
              <input
                id="email_or_username"
                name="email_or_username"
                type="text"
                value={credentials.email_or_username}
                onChange={handleChange}
                placeholder="name@example.com or username"
                className={`w-full bg-slate-950/80 border ${
                  errors.email_or_username
                    ? "border-red-500/80 focus:border-red-400"
                    : "border-slate-800 focus:border-amber-400"
                } text-slate-100 pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition placeholder:text-slate-500`}
              />
            </div>
            {errors.email_or_username && (
              <p className="text-xs text-red-400 mt-1 font-medium">
                {errors.email_or_username}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-slate-300 uppercase tracking-wider"
              >
                Password
              </label>
              <Link
                to="/auth/otp/request"
                className="text-xs text-amber-400 hover:text-amber-300 transition hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs pointer-events-none" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={credentials.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full bg-slate-950/80 border ${
                  errors.password
                    ? "border-red-500/80 focus:border-red-400"
                    : "border-slate-800 focus:border-amber-400"
                } text-slate-100 pl-10 pr-10 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition placeholder:text-slate-500`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer p-0.5"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-400 mt-1 font-medium">
                {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold py-3.5 rounded-xl shadow-lg shadow-amber-500/20 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin text-base" />
                <span>Authorizing...</span>
              </>
            ) : (
              <>
                <span>Sign In to Cinema</span>
                <FaArrowRight size={12} />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 text-center text-xs text-slate-400">
          Don't have a cinema membership yet?{" "}
          <Link
            to="/auth/signup"
            className="font-bold text-amber-400 hover:text-amber-300 ml-1 transition hover:underline"
          >
            Register Now
          </Link>
        </div>

        <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-600">
          <FaShieldAlt className="text-emerald-500" />
          <span>Encrypted Session • Zero Concurrency Conflict</span>
        </div>
      </div>
    </div>
  );
}

