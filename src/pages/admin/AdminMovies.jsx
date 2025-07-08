import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { toast } from "react-toastify";
import { FaClock, FaGlobe, FaCalendarAlt } from "react-icons/fa";

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
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6" data-aos="fade-up">
      <h1 className="text-3xl font-bold text-center sm:text-left">
        🎬 Manage Movies
      </h1>

      <input
        type="text"
        placeholder="Search movies..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {movies
          .filter((m) => m.title.toLowerCase().includes(search.toLowerCase()))
          .map((movie) => (
            <div
              key={movie.id}
              className="bg-white p-5 rounded-xl shadow hover:shadow-md transition-all duration-200"
            >
              <h3 className="text-xl font-semibold mb-2 text-blue-700">
                {movie.title}
              </h3>
              <p className="text-gray-600 mb-3 text-sm">{movie.description}</p>

              <div className="text-sm space-y-1 text-gray-700">
                <p className="flex items-center gap-2">
                  <FaClock className="text-blue-500" />
                  <span>{movie.duration_minutes} min</span>
                </p>
                <p className="flex items-center gap-2">
                  <FaGlobe className="text-green-600" />
                  <span>{movie.language}</span>
                </p>
                <p className="flex items-center gap-2">
                  <FaCalendarAlt className="text-pink-500" />
                  <span>
                    {new Date(movie.release_date).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
