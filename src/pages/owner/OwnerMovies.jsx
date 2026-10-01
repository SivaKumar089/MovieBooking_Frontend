import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaFilm,
  FaClock,
  FaLanguage,
  FaCalendarAlt,
  FaStar,
  FaPlus,
  FaTheaterMasks,
} from "react-icons/fa";

export function OwnerMovies() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const ownerId = useSelector((state) => state.auth.user?.user_id);

  useEffect(() => {
    setLoading(true);
    axios
      .get("movies/")
      .then((res) => {
        setMovies(res.data);
      })
      .catch((err) => {
        toast.error("Failed to load your movies");
      })
      .finally(() => setLoading(false));
  }, [ownerId]);

  const filteredMovies =
    search.trim() === ""
      ? movies
      : movies.filter(
          (m) =>
            (m.title && m.title.toLowerCase().includes(search.toLowerCase())) ||
            (m.description &&
              m.description.toLowerCase().includes(search.toLowerCase())) ||
            (m.genre && m.genre.toLowerCase().includes(search.toLowerCase()))
        );

  return (
    <div className="py-4" data-aos="fade-up">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <FaFilm /> Portfolio Catalog
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Cinematic Releases
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Active cinematic films available for show scheduling across your auditoriums
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
          <input
            type="text"
            placeholder="Search by title, genre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 text-slate-200 text-sm pl-9 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-amber-400 placeholder:text-slate-500 transition"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center text-slate-500">
          <div className="w-10 h-10 border-2 border-amber-500/20 border-t-amber-400 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm">Retrieving movie library...</p>
        </div>
      ) : filteredMovies.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMovies.map((movie) => (
            <div
              key={movie.id}
              className="bg-slate-900/85 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden shadow-xl hover:border-amber-500/40 transition duration-300 flex flex-col justify-between"
            >
              {/* Poster Preview */}
              <div className="relative aspect-[16/9] w-full bg-slate-800 overflow-hidden">
                <img
                  src={
                    movie.poster_url ||
                    "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600"
                  }
                  alt={movie.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600";
                  }}
                />
                <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-amber-400 text-xs font-bold flex items-center gap-1 border border-amber-500/30">
                  <FaStar size={11} /> {movie.rating || "8.5"}
                </div>
                <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-semibold text-slate-300 border border-slate-700/60 uppercase">
                  {movie.language || "English"}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80"></div>
              </div>

              {/* Details */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                    {movie.genre || "Action / Sci-Fi"}
                  </span>
                  <h2 className="text-lg font-bold text-white mb-2 line-clamp-1">
                    {movie.title}
                  </h2>
                  <p className="text-slate-400 text-xs line-clamp-2 mb-4 font-light leading-relaxed">
                    {movie.description || "Exciting theatrical feature scheduled for multiple screens."}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <FaClock size={11} className="text-slate-500" />
                    {movie.duration_minutes}m
                  </span>
                  <span className="flex items-center gap-1">
                    <FaCalendarAlt size={11} className="text-slate-500" />
                    {movie.release_date}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-slate-500">
          <FaFilm className="text-5xl mx-auto mb-3 text-slate-700" />
          <p className="text-lg font-medium text-slate-400">No movies found</p>
          <p className="text-xs mt-1">Add a new release to your cinema roster</p>
        </div>
      )}
    </div>
  );
}
