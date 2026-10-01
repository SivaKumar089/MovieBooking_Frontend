import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { toast } from "react-toastify";
import {
  FaSearch,
  FaClock,
  FaGlobe,
  FaCalendarAlt,
  FaTheaterMasks,
  FaFilm,
  FaStar,
  FaSpinner,
} from "react-icons/fa";

export default function AdminMovies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    axios
      .get("movies/")
      .then((res) => setMovies(res.data))
      .catch(() => toast.error("Error loading movies"))
      .finally(() => setLoading(false));
  }, []);

  const filteredMovies = movies.filter((m) =>
    (m.title || "").toLowerCase().includes(search.toLowerCase()) ||
    (m.language || "").toLowerCase().includes(search.toLowerCase()) ||
    (m.theater_name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6" data-aos="fade-up">
      {/* Top Banner & Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 backdrop-blur-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FaFilm className="text-amber-400" /> Movie Catalog & Titles
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Global film inventory across all theater screens
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-72">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
            <input
              type="text"
              placeholder="Search by title, language, or hall..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs pl-9 pr-3.5 py-2.5 rounded-xl focus:outline-none focus:border-amber-400/80 placeholder:text-slate-600 transition"
            />
          </div>
          <span className="hidden sm:inline-flex items-center px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-amber-400 font-mono">
            {filteredMovies.length} Titles
          </span>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
          <FaSpinner className="animate-spin text-amber-400 text-3xl mb-3" />
          <p className="text-sm">Loading film catalog...</p>
        </div>
      ) : filteredMovies.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-slate-850 p-8">
          <FaFilm className="text-slate-600 text-4xl mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-300">No Movies Found</h3>
          <p className="text-xs text-slate-500 mt-1">
            {search ? `No titles match "${search}"` : "No movies registered yet in the system."}
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMovies.map((movie) => (
            <div
              key={movie.id}
              className="bg-slate-900/90 rounded-2xl border border-slate-800 hover:border-amber-500/40 p-5 shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div>
                {/* Poster / Header Thumbnail */}
                <div className="flex gap-4 mb-4">
                  <div className="w-16 h-24 rounded-lg bg-slate-950 border border-slate-800 flex-shrink-0 overflow-hidden relative">
                    {movie.poster_url ? (
                      <img
                        src={movie.poster_url}
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-amber-400/50">
                        <FaFilm size={24} />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition line-clamp-1">
                        {movie.title}
                      </h3>
                      {movie.rating && (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20 flex-shrink-0">
                          <FaStar size={10} /> {movie.rating}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {movie.description || "No synopsis available."}
                    </p>
                  </div>
                </div>

                {/* Metadata Pills */}
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-850 mb-3">
                  <div className="flex items-center gap-2">
                    <FaClock className="text-amber-400 text-xs flex-shrink-0" />
                    <span className="truncate">{movie.duration_minutes} min</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaGlobe className="text-sky-400 text-xs flex-shrink-0" />
                    <span className="truncate">{movie.language}</span>
                  </div>
                  <div className="flex items-center gap-2 col-span-2">
                    <FaCalendarAlt className="text-rose-400 text-xs flex-shrink-0" />
                    <span className="truncate">
                      {movie.release_date
                        ? new Date(movie.release_date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Theater & ID Footer */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5 truncate max-w-[200px]">
                  <FaTheaterMasks className="text-purple-400 flex-shrink-0" />
                  <span className="truncate">{movie.theater_name || "Assigned Theater"}</span>
                </span>
                <span className="font-mono text-slate-500 flex-shrink-0">#{movie.id}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
