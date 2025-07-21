import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { toast } from "react-toastify";
import { FaUser, FaFilm, FaChair, FaTimesCircle } from "react-icons/fa";

export function OwnerBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    axios
      .get("bookings/owner/")
      .then((res) => setBookings(res.data))
      .catch(() => toast.error("Failed to fetch bookings"));
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-10" data-aos="fade-up">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
        🎫 My Theater Bookings
      </h1>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-500">No bookings available</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {bookings.map((b) => (
            <div
              key={b.id}
              className={`rounded-xl p-6 shadow-lg transition hover:shadow-xl bg-white relative border-l-4 ${
                b.is_cancelled ? "border-red-500" : "border-green-500"
              }`}
            >
              {b.is_cancelled && (
                <span className="absolute top-2 right-2 bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <FaTimesCircle className="text-sm" />
                  Cancelled
                </span>
              )}

              <div className="flex items-center gap-2 mb-2 text-gray-700">
                <FaUser className="text-blue-500" />
                <span>
                  <strong>User:</strong> {b.user_name}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-2 text-gray-700">
                <FaFilm className="text-purple-500" />
                <span>
                  <strong>Movie:</strong> {b.movie_name}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-2 text-gray-700">
                <FaChair className="text-yellow-500" />
                <span>
                  <strong>Seat:</strong> {b.seat.row}
                  {b.seat.column}
                </span>
              </div>

              <div className="text-sm text-gray-500">
                <strong>Show:</strong> {b.show}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
