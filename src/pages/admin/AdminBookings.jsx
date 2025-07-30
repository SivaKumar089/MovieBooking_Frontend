import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { toast } from "react-toastify";
import {
  FaUser,
  FaFilm,
  FaMapMarkerAlt,
  FaChair,
  FaCalendarAlt,
  FaRupeeSign,
  FaTicketAlt,
  FaSearch,
} from "react-icons/fa";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get("bookings/admin/")
      .then((res) => setBookings(res.data))
      .catch((err) => {
        toast.error("Failed to load bookings");
      });
  }, []);

  const filteredBookings = bookings.filter(
    (b) =>
      (b.user_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (b.movie_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (b.theater_name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6" data-aos="fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-center sm:text-left text-blue-700">
          🎟️ Admin - Bookings
        </h1>

       
        <div className="relative max-w-md mx-auto sm:mx-0">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by user, movie, or theater..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
     
      {filteredBookings.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
            >
              <div className="space-y-3 text-gray-800 text-sm">
                <p className="flex items-center gap-2 font-semibold text-blue-700 text-base">
                  <FaUser /> {booking.user_name || booking.user}
                </p>

                <p className="flex items-center gap-2">
                  <FaFilm className="text-purple-600" />
                  Movie:{" "}
                  <span className="font-medium text-gray-900">
                    {booking.movie_name}
                  </span>
                </p>

                <p className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-red-500" />
                  Theater:{" "}
                  <span className="font-medium text-gray-900">
                    {booking.theater_name}
                  </span>
                </p>

                <p className="flex items-center gap-2">
                  <FaChair className="text-yellow-500" />
                  Seat:{" "}
                  <span className="font-medium text-gray-900">
                    {booking.seat?.row}
                    {booking.seat?.column}
                  </span>
                </p>

                <p className="flex items-center gap-2">
                  <FaTicketAlt className="text-green-600" />
                  Show:{" "}
                  <span className="font-medium text-gray-900">
                    {booking.show}
                  </span>
                </p>

                {booking.date && booking.time && (
                  <p className="flex items-center gap-2">
                    <FaCalendarAlt className="text-blue-400" />
                    Date:{" "}
                    <span className="font-medium text-gray-900">
                      {booking.date} at {booking.time}
                    </span>
                  </p>
                )}

                {booking.total_price && (
                  <p className="flex items-center gap-2">
                    <FaRupeeSign className="text-green-700" />
                    Total Price:{" "}
                    <span className="font-semibold text-gray-900">
                      ₹{booking.total_price}
                    </span>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center pt-10 text-lg">
          No bookings found.
        </p>
      )}
    </div>
  );
}
