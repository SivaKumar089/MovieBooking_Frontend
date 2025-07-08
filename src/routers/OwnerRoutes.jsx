import React from "react";
import { Routes, Route } from "react-router-dom";
import { OwnerTheaters } from "../pages/owner/OwnerTheaters";
import { OwnerMovies } from "../pages/owner/OwnerMovies";
import { OwnerShows } from "../pages/owner/OwnerShows";
import { AddTheater } from "../pages/owner/AddTheater";
import { AddMovie } from "../pages/owner/AddMovie";
import { AddShow } from "../pages/owner/AddShow";
import { OwnerBookings } from "../pages/owner/OwnerBookings";
import OwnerDashboard from "../pages/owner/OwnerDashboard";
import NotFound from "../components/NotFound";
import Navbar from "../components/Navbar";
import { ShowSeats } from "../pages/owner/ShowSeats";
export default function OwnerRoutes() {
  return (
    <Routes>
      <Route path="dashboard" element={<OwnerDashboard />} />
      <Route element={<Navbar />}>
        <Route path="theaters" element={<OwnerTheaters />} />
        <Route path="movies" element={<OwnerMovies />} />
        <Route path="shows" element={<OwnerShows />} />
        <Route path="add-theater" element={<AddTheater />} />
        <Route path="add-movie" element={<AddMovie />} />
        <Route path="add-show" element={<AddShow />} />
        <Route path="bookings" element={<OwnerBookings />} />
        <Route path="seatlayout" element={<ShowSeats />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
