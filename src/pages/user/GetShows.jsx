import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaFilm,
  FaTheaterMasks,
  FaCalendarAlt,
  FaClock,
  FaEye,
  FaChair,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

export default function GetShows() {
  const location = useLocation();
  const navigate=useNavigate()
  const movieId = location.state?.movieId;
  const [shows, setShows] = useState([]);

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const url = movieId ? `shows/?movie=${movieId}` : "shows/";
        const res = await axios.get(url);
        setShows(res.data);
      } catch (error) {
        console.error("Error fetching shows:", error);
      }
    };

    fetchShows();
  }, [movieId]);

  const handleViewSeat = (showId) => {
    navigate("/user/seat-layout", { state: { showId } });
  };
  return (
    <div className="p-6" data-aos="fade-up">
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600 flex justify-center items-center gap-2">
        <FaChair className="text-indigo-700" /> Available Shows
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shows.map((s) => (
          <div
            key={s.id}
            className="p-5 bg-white rounded-2xl shadow-lg border hover:shadow-xl transition"
          >
            {/* Movie Title */}
            <h2 className="text-xl font-bold mb-3 text-gray-800 flex items-center gap-2">
              <FaFilm className="text-indigo-500" /> {s.movie_name}
            </h2>

            {/* Show Info */}
            <div className="text-sm text-gray-600 space-y-2 mb-4">
              <p className="flex items-center gap-2">
                <FaTheaterMasks className="text-indigo-400" />
                <span className="font-medium">Theater:</span> {s.theater_name}
              </p>

              <p className="flex items-center gap-2">
                <FaCalendarAlt className="text-indigo-400" />
                <span className="font-medium">Date:</span> {s.date}
              </p>

              <p className="flex items-center gap-2">
                <FaClock className="text-indigo-400" />
                <span className="font-medium">Time:</span> {s.start_time} -{" "}
                {s.end_time}
              </p>

              {/* Seat Statistics */}
              <p className="flex items-center gap-2">
                <FaChair className="text-green-500" />
                <span className="font-medium text-gray-700">Total:</span>{" "}
                {s.total_seats}
              </p>

              <p className="flex items-center gap-2">
                <FaTimesCircle className="text-red-500" />
                <span className="font-medium text-gray-700">Booked:</span>{" "}
                {s.booked_seats}
              </p>

              <p className="flex items-center gap-2">
                <FaCheckCircle className="text-green-600" />
                <span className="font-medium text-gray-700">
                  Available:
                </span>{" "}
                {s.available_seats}
              </p>
            </div>

            {/* Button */}
            <button
              onClick={() => handleViewSeat(s.id)}
              className="flex items-center justify-center gap-2 w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition"
            >
              <FaEye /> View Seats
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
