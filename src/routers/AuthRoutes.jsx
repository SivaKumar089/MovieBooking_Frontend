import React from "react";
import { Routes, Route } from "react-router-dom";
import  Signup  from "../pages/auth/Signup";
import Login  from "../pages/auth/Login";
import  Profile  from "../pages/auth/Profile";
import  OTPRequest  from "../pages/auth/OTPRequest";
import  OTPVerify  from "../pages/auth/OTPVerify";
import  ResetPassword from "../pages/auth/ResetPassword";
import  TokenRefresh  from "../pages/auth/TokenRefresh";
import NotFound from "../components/NotFound";
import Logout from "../pages/auth/Logout";
export default function AuthRoutes() {
  return (
    <>
      <Routes>
       
        <Route path="signup" element={<Signup />} />
        <Route path="login" element={<Login />} />
        <Route path="logout" element={<Logout />} />
        <Route path="profile" element={<Profile />} />
        <Route path="otp/request" element={<OTPRequest />} />
        <Route path="otp/verify" element={<OTPVerify />} />
        <Route path="password/reset" element={<ResetPassword />} />
        <Route path="token/refresh" element={<TokenRefresh />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
