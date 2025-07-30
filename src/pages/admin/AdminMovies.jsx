import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { toast } from "react-toastify";
import {
  FaSearch,
  FaClock,
  FaGlobe,
  FaCalendarAlt,
  FaTheaterMasks,
} from "react-icons/fa";

export default function AdminMovies() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get("movies/")
      .then((res) => setMovies(res.data))
      .catch(() => toast.error("Error loading movies"));
  }, []);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-8" data-aos="fade-up">
   
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Manage Movies</h1>
        <div className="relative">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search movies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {movies
          .filter((m) => m.title.toLowerCase().includes(search.toLowerCase()))
          .map((movie) => (
            <div
              key={movie.id}
              className="bg-gradient-to-br from-white via-blue-50 to-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 p-6"
            >
              <h3 className="text-xl font-bold text-blue-800 mb-2">
                {movie.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4">{movie.description}</p>

              <div className="space-y-2 text-sm text-gray-700">
                <p className="flex items-center gap-2">
                  <FaClock className="text-blue-500" />
                  <span>Duration: {movie.duration_minutes} min</span>
                </p>
                <p className="flex items-center gap-2">
                  <FaGlobe className="text-green-600" />
                  <span>Language: {movie.language}</span>
                </p>
                <p className="flex items-center gap-2">
                  <FaCalendarAlt className="text-pink-500" />
                  <span>
                    Release Date:{" "}
                    {new Date(movie.release_date).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <FaTheaterMasks className="text-purple-600" />
                  <span>Theater: {movie.theater_name}</span>
                </p>
              </div>
            </div>
          ))}
      </div>

      {movies.length === 0 && (
        <p className="text-center text-gray-500">No movies found.</p>
      )}
    </div>
  );
}
