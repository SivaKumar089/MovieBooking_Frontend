import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  FaSearch,
  FaVideo,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaChair,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export function OwnerShows() {
  const navigate=useNavigate()
  const [shows, setShows] = useState([]);
  const [search, setSearch] = useState("");

  const { id: ownerId } = useSelector((state) => state.auth.user); 

  useEffect(() => {
    axios
      .get("shows/")
      .then((res) => {
        setShows(res.data);
      })
      .catch((err) => {
        toast.error("Failed to load your shows");
      });
  }, [ownerId]);
const filteredShows =
  search.trim() === ""
    ? shows
    : shows.filter(
        (s) =>
          (s.movie_name?.toLowerCase() || "").includes(search.toLowerCase()) ||
          (s.theater_name?.toLowerCase() || "").includes(search.toLowerCase()) 
      );


  return (
    <div className="p-6" data-aos="fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700 flex items-center gap-2">
        <FaVideo className="text-indigo-600" /> My Shows
      </h1>

      <div className="relative mb-6">
        <FaSearch className="absolute top-3 left-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search shows..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>
      </div>

      {filteredShows.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredShows.map((show) => (
            <div
              key={show.id}
              className="p-5 bg-white border border-indigo-100 rounded-xl shadow hover:shadow-lg transition duration-300"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <FaVideo className="text-indigo-500" /> {show.movie_name}
              </h2>

              <p className="text-gray-700 mb-1 flex items-center gap-2">
                <FaMapMarkerAlt className="text-pink-500" /> Theater:{" "}
                <span className="font-medium text-gray-800">
                  {show.theater_name}
                </span>
              </p>

              <p className="text-gray-700 mb-1 flex items-center gap-2">
                <FaCalendarAlt className="text-green-600" /> Date: {show.date}
              </p>

              <p className="text-gray-700 mb-3 flex items-center gap-2">
                <FaClock className="text-yellow-500" /> Time: {show.start_time}{" "}
                - {show.end_time}
              </p>

              <div className="text-sm text-gray-700 flex flex-col gap-1">
                <p className="flex items-center gap-2">
                  <FaChair className="text-blue-500" />
                  Total Seats:{" "}
                  <span className="font-medium">{show.total_seats}</span>
                </p>
                <p className="flex items-center gap-2">
                  <FaChair className="text-red-500" />
                  Booked:{" "}
                  <span className="font-medium">{show.booked_seats}</span>
                </p>
                <p className="flex items-center gap-2">
                  <FaChair className="text-green-500" />
                  Available:{" "}
                  <span className="font-medium">{show.available_seats}</span>
                </p>
              </div>
              <button
                onClick={() =>
                  navigate("/owner/seatlayout", { state: { showId: show.id } })
                }
                className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 cursor-pointer text-white py-2 px-4 rounded shadow transition flex items-center justify-center gap-2 text-sm font-medium"
              >
                <FaChair /> Show Seats
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-4">No shows found.</p>
      )}
    </div>
  );
}
