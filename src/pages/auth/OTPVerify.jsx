import React, { useState, useEffect } from "react";
import axios from "../../utils/axios";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";

export default function OTPVerify() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const passedEmail = location.state?.email;
    if (passedEmail) {
      setEmail(passedEmail);
    } else {
      toast.error("No email found. Please request OTP again.");
      navigate("auth/otp/request");
    }
  }, [location.state, navigate]);

  const validate = () => {
    if (!code.trim()) return "OTP is required.";
    if (code.length < 4) return "OTP must be at least 4 digits.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await axios.post("otp/verify/", { email, code });
      toast.success("OTP Verified");
      navigate("/auth/password/reset", { state: { email } }); // Pass email to reset page
    } catch {
      toast.error("Invalid OTP");
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
          Verify OTP
        </h2>

        <div>
          <input
            name="otp"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError("");
            }}
            placeholder="Enter OTP"
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
          Verify
        </button>
      </form>
    </div>
  );
}
