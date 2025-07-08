import React from "react";
import { Routes, Route } from "react-router-dom";
import AuthRoutes from "./AuthRoutes";
import UserRoutes from "./UserRoutes";
import AdminRoutes from "./AdminRoutes";
import OwnerRoutes from "./OwnerRoutes";
import HomePage from "../components/HomePage";
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth/*" element={<AuthRoutes />} />
      <Route path="/user/*" element={<UserRoutes />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="/owner/*" element={<OwnerRoutes />} />
    </Routes>
  );
}
