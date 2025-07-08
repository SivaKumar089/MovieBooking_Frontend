import React from "react";
import { Routes, Route } from "react-router-dom";
import GetTheaters from "../pages/user/GetTheaters";
import GetMovies from "../pages/user/GetMovies";
import GetShows from "../pages/user/GetShows";
import MyTickets from "../pages/user/MyTickets";
import UserSeatLayout from "../pages/user/UserSeatLayout";
import PaymentPage from "../pages/user/PaymentPage";
import UserDashboard from "../pages/user/UserDashboard";
import NotFound from "../components/NotFound";
import CancelTicket from "../pages/user/CancelTicket";
import Navbar from "../components/Navbar";
export default function UserRoutes() {
  return (
    <Routes>
        <Route path="dashboard" element={<UserDashboard />} />
      <Route element={<Navbar />}>
        <Route path="theaters" element={<GetTheaters />} />
        <Route path="movies" element={<GetMovies />} />
        <Route path="shows" element={<GetShows />} />
        <Route path="my-tickets" element={<MyTickets />} />
        <Route path="seat-layout" element={<UserSeatLayout />} />
        <Route path="payment" element={<PaymentPage />} />
        <Route path="cancel" element={<CancelTicket />} />
      </Route>
        <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
