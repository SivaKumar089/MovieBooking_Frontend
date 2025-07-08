import React, { useState } from "react";
import axios from "../../utils/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function OTPRequest() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

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

    try {
      await axios.post("otp/request/",{email});
      toast.success("OTP sent!");
      navigate("/auth/otp/verify", { state: { email } }); 
    } catch (err) {
      const msg = err.response?.data?.error || "Error sending OTP";
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        data-aos="fade-up"
        className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl space-y-6 border border-gray-200"
      >
        <h2 className="text-3xl font-bold text-center text-blue-600">
          Request OTP
        </h2>

        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            placeholder="Enter your email"
            className={`w-full px-4 py-2 border ${
              error ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
        >
          Send OTP
        </button>
      </form>
    </div>
  );
}
