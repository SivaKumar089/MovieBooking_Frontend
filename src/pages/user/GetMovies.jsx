import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaClock,
  FaLanguage,
  FaCalendarAlt,
  FaTheaterMasks,
  FaStar,
  FaSearch,
  FaFilter,
  FaFilm,
} from "react-icons/fa";

export default function GetMovies() {
  const location = useLocation();
  const theaterId = location.state?.theaterId;
  const initialSearch = location.state?.search || "";
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedGenre, setSelectedGenre] = useState("ALL");
  const [selectedLanguage, setSelectedLanguage] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const url = theaterId ? `movies/?theater=${theaterId}` : "movies/";
        const res = await axios.get(url);
        setMovies(res.data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [theaterId]);

  const handleViewShows = (movieId) => {
    navigate("/user/shows", { state: { movieId } });
  };

  // Extract unique genres & languages for filter pills
  const genres = [
    "ALL",
    ...new Set(
      movies
        .map((m) => m.genre?.split("/")[0]?.trim())
        .filter(Boolean)
    ),
  ];

  const filteredMovies = movies.filter((m) => {
    const matchesSearch =
      (m.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.genre || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.language || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGenre =
      selectedGenre === "ALL" ||
      (m.genre || "").toLowerCase().includes(selectedGenre.toLowerCase());

    const matchesLanguage =
      selectedLanguage === "ALL" ||
      (m.language || "").toLowerCase() === selectedLanguage.toLowerCase();

    return matchesSearch && matchesGenre && matchesLanguage;
  });

  return (
    <div className="py-4" data-aos="fade-up">
      {/* Top Header & Search Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <FaFilm /> Live Catalog
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Now Showing in Cinemas
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Showing {filteredMovies.length} releases available for instant booking
          </p>
        </div>

        {/* Filter & Search Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
            <input
              type="text"
              placeholder="Search title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-900 border border-slate-700/80 text-slate-200 text-sm pl-9 pr-4 py-2 rounded-xl focus:outline-none focus:border-amber-400 w-44 sm:w-56"
            />
          </div>
        </div>
      </div>

      {/* Genre Chips Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
        {genres.map((g) => (
          <button
            key={g}
            onClick={() => setSelectedGenre(g)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              selectedGenre === g
                ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                : "bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-white"
            }`}
          >
            {g === "ALL" ? "All Genres" : g}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-24 text-center text-slate-500">
          <div className="w-10 h-10 border-2 border-amber-500/20 border-t-amber-400 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm">Loading cinema releases...</p>
        </div>
      ) : filteredMovies.length === 0 ? (
        <div className="py-20 text-center text-slate-500">
          <FaFilm className="text-5xl mx-auto mb-3 text-slate-700" />
          <p className="text-lg font-medium text-slate-400">No movies found</p>
          <p className="text-sm">Try clearing your search query or filter</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredMovies.map((m) => (
            <div
              key={m.id}
              className="group bg-slate-900/80 rounded-2xl overflow-hidden border border-slate-800 hover:border-amber-500/40 transition duration-300 shadow-xl flex flex-col justify-between"
            >
              {/* Poster Image Container */}
              <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-800">
                <img
                  src={
                    m.poster_url ||
                    "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600"
                  }
                  alt={m.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600";
                  }}
                />

                {/* Rating Badge */}
                <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-amber-400 text-xs font-bold flex items-center gap-1 border border-amber-500/30 shadow-lg">
                  <FaStar size={11} /> {m.rating || "8.5"}
                </div>

                {/* Language Tag */}
                <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-semibold text-slate-300 border border-slate-700/60 uppercase">
                  {m.language || "English"}
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
              </div>

              {/* Movie Details */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider block mb-1">
                    {m.genre || "Action / Drama"}
                  </span>
                  <h2 className="text-lg font-bold text-white group-hover:text-amber-400 transition line-clamp-1">
                    {m.title}
                  </h2>
                  <p className="text-slate-400 text-xs line-clamp-2 mt-1.5 font-light leading-relaxed">
                    {m.description || "Experience this spectacular release on the big screen with Dolby surround sound."}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                    <span className="flex items-center gap-1">
                      <FaClock size={11} className="text-slate-500" />
                      {m.duration_minutes} mins
                    </span>
                    <span className="flex items-center gap-1">
                      <FaCalendarAlt size={11} className="text-slate-500" />
                      {m.release_date ? new Date(m.release_date).toLocaleDateString() : "Now Showing"}
                    </span>
                  </div>

                  <button
                    onClick={() => handleViewShows(m.id)}
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs py-2.5 px-4 rounded-xl shadow-md shadow-amber-500/20 transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <FaTheaterMasks /> Select Showtimes
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
