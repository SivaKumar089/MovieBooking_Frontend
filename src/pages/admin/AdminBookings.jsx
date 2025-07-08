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
} from "react-icons/fa";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    axios
      .get("bookings/admin/")
      .then((res) => setBookings(res.data))
      .catch((err) => {
        console.error("Error fetching bookings:", err);
        toast.error("Failed to load bookings");
      });
  }, []);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6" data-aos="fade-up">
      <h1 className="text-3xl font-bold text-center sm:text-left">
        🎟 Admin - Bookings
      </h1>

      {bookings.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white p-5 rounded-xl shadow hover:shadow-md transition-all duration-200"
            >
              <div className="space-y-2 text-gray-700 text-sm">
                <p className="flex items-center gap-2 font-medium text-blue-700">
                  <FaUser /> User: {booking.user_name || booking.user}
                </p>

                <p className="flex items-center gap-2">
                  <FaFilm className="text-purple-500" />
                  Movie: {booking.movie_name}
                </p>

                <p className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-red-500" />
                  Theater: {booking.theater_name}
                </p>

                <p className="flex items-center gap-2">
                  <FaChair className="text-yellow-500" />
                  Seat: {booking.seat?.row}
                  {booking.seat?.column}
                </p>

                <p className="flex items-center gap-2">
                  <FaTicketAlt className="text-green-600" />
                  Show: {booking.show}
                </p>

                {booking.date && booking.time && (
                  <p className="flex items-center gap-2">
                    <FaCalendarAlt className="text-blue-400" />
                    Date: {booking.date} at {booking.time}
                  </p>
                )}

                {booking.total_price && (
                  <p className="flex items-center gap-2">
                    <FaRupeeSign className="text-green-700" />
                    Total Price: ₹{booking.total_price}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">No bookings found.</p>
      )}
    </div>
  );
}
