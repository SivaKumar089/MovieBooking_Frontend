import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../../redux/authSlice";
import axios from "../../utils/axios";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const [credentials, setCredentials] = useState({
    email_or_username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!credentials.email_or_username) {
      newErrors.email_or_username = "Email or username is required";
    }

    if (!credentials.password) newErrors.password = "Password is required";


    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validate();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      const res = await axios.post("login/", credentials);
      dispatch(loginSuccess(res.data));
      toast.success("Logged in successfully");

      const role = res.data?.user?.role || res.data?.role;
      if (role === "admin") {
        navigate("/admin/adminpanel");
      } else if (role === "owner") {
        navigate("/owner/theaters");
      } else if (role === "user") {
        navigate("/user/theaters");
      } else {
        navigate("/profile");
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.detail || // DRF often sends this
        err.response?.data?.error || // custom error format
        "Login failed. Please check your credentials.";

      toast.error(errorMsg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div
        data-aos="fade-up"
        className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl space-y-6 border border-gray-200"
      >
        <h2 className="text-3xl font-bold text-center text-blue-600">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label
              htmlFor="email_or_username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email_or_username"
              name="email_or_username"
              type="text"
              value={credentials.email_or_username}
              onChange={handleChange}
              placeholder="Enter your email"
              className={`w-full px-4 py-2 border ${
                errors.email_or_username ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.email_or_username && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email_or_username}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={credentials.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={`w-full px-4 py-2 border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10`}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 cursor-pointer text-gray-500"
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </span>
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password}</p>
            )}

            {/* 🔽 Forgot Password */}
            <div className="text-right mt-2">
              <span
                onClick={() => navigate("/auth/otp/request")} // adjust as needed
                className="text-sm text-blue-600 hover:underline cursor-pointer"
              >
                Forgot Password?
              </span>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
          >
            Login
          </button>
        </form>
        <p className="text-center text-sm text-gray-500">
          I don't have an account?{" "}
          <a
            href="signup"
            className="text-blue-600 font-medium hover:underline"
          >
            Signup
          </a>
        </p>
      </div>
    </div>
  );
}
