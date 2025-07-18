import React, { useState } from "react";
import axios from "../../utils/axios";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromOTP = location.state?.email || "";
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: emailFromOTP,
    new_password: "",
    confirm_password: "",
  });

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetpassword, Setresetpassword] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    Setresetpassword(true);

    if (formData.new_password !== formData.confirm_password) {
      toast.error("Passwords do not match");
      Setresetpassword(false);
      return;
    }

    try {
      await axios.post("password/reset/", {
        email: formData.email,
        new_password: formData.new_password,
      });

      toast.success("Password reset successful");
      navigate("/auth/loginpage");
    } catch (err) {
      const errorMsg =
        err.response?.data?.error || "Password reset failed. Try again.";
      Setresetpassword(false);
      toast.error(errorMsg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        data-aos="fade-up"
        className="w-full max-w-md bg-white rounded-xl shadow-md p-6 space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center text-indigo-700">
          Reset Password
        </h2>

        {error && (
          <div className="bg-red-100 text-red-600 border border-red-400 rounded-md px-4 py-2 text-sm">
            {error}
          </div>
        )}

        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={(e) => {
            handleChange(e);
            setError("");
          }}
          placeholder="Email"
          className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-indigo-400"
          required
        />

        <div className="relative">
          <input
            name="new_password"
            type={showNewPassword ? "text" : "password"}
            value={formData.new_password}
            onChange={(e) => {
              handleChange(e);
              setError("");
            }}
            placeholder="New Password"
            className="w-full px-4 py-2 border rounded pr-10 focus:ring-2 focus:ring-indigo-400"
            required
          />
          <span
            className="absolute top-1/2 transform -translate-y-1/2 right-3 text-gray-500 cursor-pointer"
            onClick={() => setShowNewPassword(!showNewPassword)}
          >
            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <div className="relative">
          <input
            name="confirm_password"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirm_password}
            onChange={(e) => {
              handleChange(e);
              setError("");
            }}
            placeholder="Confirm Password"
            className="w-full px-4 py-2 border rounded pr-10 focus:ring-2 focus:ring-indigo-400"
            required
          />
          <span
            className="absolute top-1/2 transform -translate-y-1/2 right-3 text-gray-500 cursor-pointer"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold transition duration-200"
        >
          {resetpassword ? "Reseting..." : "Reset password"}
        </button>
      </form>
    </div>
  );
}
