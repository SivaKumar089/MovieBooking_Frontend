import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  FaSearch,
  FaFilm,
  FaClock,
  FaLanguage,
  FaCalendarAlt,
  FaTags,
} from "react-icons/fa";

export function OwnerMovies() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");

  const { id: ownerId } = useSelector((state) => state.auth.user);

  useEffect(() => {
    axios
      .get("movies/")
      .then((res) => {
        setMovies(res.data);
      })
      .catch((err) => {
        toast.error("Failed to load your movies");
      });
  }, [ownerId]);

  const filteredMovies =
    search.trim() === ""
      ? movies
      : movies.filter(
          (m) =>
            (m.title && m.title.toLowerCase().includes(search.toLowerCase())) ||
            (m.description &&
              m.description.toLowerCase().includes(search.toLowerCase()))
        );

  return (
    <div className="p-6" data-aos="fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold mb-6 text-indigo-700 flex items-center gap-2">
          <FaFilm className="text-indigo-600" /> My Movies
        </h1>

        <div className="relative mb-6">
          <FaSearch className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search movies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
      </div>

      {filteredMovies.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMovies.map((movie) => (
            <div
              key={movie.id}
              className="p-5 bg-white border border-indigo-100 rounded-xl shadow hover:shadow-lg transition duration-300"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <FaFilm className="text-indigo-500" /> {movie.title}
              </h2>

              <p className="text-gray-600 mb-2 flex items-center gap-2">
                <FaTags className="text-yellow-500" />
                {movie.description}
              </p>

              <p className="text-sm text-gray-700 flex items-center gap-2 mb-1">
                <FaClock className="text-pink-500" />
                Duration: {movie.duration_minutes} mins
              </p>

              <p className="text-sm text-gray-700 flex items-center gap-2 mb-1">
                <FaLanguage className="text-green-600" />
                Language: {movie.language}
              </p>

              <p className="text-sm text-gray-700 flex items-center gap-2">
                <FaCalendarAlt className="text-blue-600" />
                Release Date: {movie.release_date}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-4">No movies found.</p>
      )}
    </div>
  );
}
