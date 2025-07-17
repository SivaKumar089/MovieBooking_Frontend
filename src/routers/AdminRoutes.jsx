import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminPanel from "../pages/admin/AdminPanel";
import AdminMovies from "../pages/admin/AdminMovies";
import AdminTheaters from "../pages/admin/AdminTheaters";
import AdminBookings from "../pages/admin/AdminBookings";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminOwners from "../pages/admin/AdminOwners";
import NotFound from "../components/NotFound";
export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="adminpanel" element={<AdminPanel />} />
      <Route path="movies" element={<AdminMovies />} />
      <Route path="theaters" element={<AdminTheaters />} />
      <Route path="bookings" element={<AdminBookings />} />
      <Route path="users" element={<AdminUsers />} />
      <Route path="owners" element={<AdminOwners />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
