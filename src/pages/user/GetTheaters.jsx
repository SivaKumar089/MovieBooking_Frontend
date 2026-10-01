import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaFilm,
  FaTheaterMasks,
  FaArrowRight,
  FaSearch,
  FaStar,
  FaVolumeUp,
  FaTv,
} from "react-icons/fa";

export default function GetTheaters() {
  const [theaters, setTheaters] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("theaters/")
      .then((res) => {
        if (Array.isArray(res.data)) setTheaters(res.data);
      })
      .catch((err) => console.error("Error loading theaters:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleViewMovies = (theaterId) => {
    navigate("/user/movies", { state: { theaterId } });
  };

  const filteredTheaters = theaters.filter(
    (t) =>
      (t.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.location || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="py-4" data-aos="fade-up">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <FaTheaterMasks /> Premier Cinema Venues
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Partnered Multiplexes in Bengaluru
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Experience laser projection, VIP recliners, and Dolby Atmos audio at {theaters.length} certified locations
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
          <input
            type="text"
            placeholder="Search venue or area..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 text-slate-200 text-sm pl-9 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-amber-400 placeholder:text-slate-500 transition"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center text-slate-500">
          <div className="w-10 h-10 border-2 border-amber-500/20 border-t-amber-400 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm">Locating cinema auditoriums...</p>
        </div>
      ) : filteredTheaters.length === 0 ? (
        <div className="py-20 text-center text-slate-500">
          <FaTheaterMasks className="text-5xl mx-auto mb-3 text-slate-700" />
          <p className="text-lg font-medium text-slate-400">No matching theaters found</p>
          <p className="text-sm mt-1">Try adjusting your search query</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTheaters.map((t) => (
            <div
              key={t.id}
              className="bg-slate-900/85 backdrop-blur-xl rounded-2xl p-6 border border-slate-800 hover:border-amber-500/40 shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div>
                {/* Amenity Badges */}
                <div className="flex flex-wrap items-center gap-1.5 mb-4">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                    IMAX Laser 4K
                  </span>
                  <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider bg-sky-500/10 px-2 py-1 rounded-md border border-sky-500/20 flex items-center gap-1">
                    <FaVolumeUp size={9} /> Dolby Atmos
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
                    VIP Recliners
                  </span>
                </div>

                <h2 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition flex items-center gap-2">
                  <FaTheaterMasks className="text-amber-400 flex-shrink-0" />
                  <span>{t.name}</span>
                </h2>

                <p className="text-slate-400 text-xs sm:text-sm flex items-start gap-2 mb-6 font-light">
                  <FaMapMarkerAlt className="text-red-400 flex-shrink-0 mt-0.5" />
                  <span>{t.location}</span>
                </p>
              </div>

              <button
                onClick={() => handleViewMovies(t.id)}
                className="w-full bg-slate-800 hover:bg-gradient-to-r hover:from-amber-500 hover:to-amber-600 hover:text-black text-slate-100 font-bold text-xs py-3 px-4 rounded-xl border border-slate-700/80 hover:border-amber-400 transition duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <FaFilm /> Browse Now Showing
                <FaArrowRight size={11} className="group-hover:translate-x-1 transition" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
