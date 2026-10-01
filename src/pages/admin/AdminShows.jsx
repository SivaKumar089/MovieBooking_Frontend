import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { toast } from "react-toastify";
import {
  FaFilm,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaUsers,
  FaSearch,
  FaTv,
  FaSpinner,
} from "react-icons/fa";

export default function AdminShows() {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    axios
      .get("shows/")
      .then((res) => setShows(res.data))
      .catch(() => toast.error("Error loading shows"))
      .finally(() => setLoading(false));
  }, []);

  const filteredShows = shows.filter(
    (show) =>
      (show.movie_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (show.theater_name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6" data-aos="fade-up">
      {/* Header Banner & Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 backdrop-blur-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FaTv className="text-amber-400" /> Showtime Master Schedule
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time screening schedules and auditorium occupancy monitoring
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-72">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
            <input
              type="text"
              placeholder="Search by movie or theater..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs pl-9 pr-3.5 py-2.5 rounded-xl focus:outline-none focus:border-amber-400/80 placeholder:text-slate-600 transition"
            />
          </div>
          <span className="hidden sm:inline-flex items-center px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-amber-400 font-mono">
            {filteredShows.length} Shows
          </span>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
          <FaSpinner className="animate-spin text-amber-400 text-3xl mb-3" />
          <p className="text-sm">Loading screening schedules...</p>
        </div>
      ) : filteredShows.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-slate-850 p-8">
          <FaTv className="text-slate-600 text-4xl mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-300">No Shows Found</h3>
          <p className="text-xs text-slate-500 mt-1">
            {search ? `No screenings match "${search}"` : "No shows currently scheduled."}
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredShows.map((show) => {
            const total = show.total_seats || 100;
            const booked = show.booked_seats || 0;
            const occupancyPct = Math.round((booked / total) * 100);
            const isSoldOut = show.available_seats === 0;

            return (
              <div
                key={show.id}
                className="bg-slate-900/90 rounded-2xl border border-slate-800 hover:border-amber-500/40 p-5 shadow-xl transition-all duration-300 group hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
                        <FaFilm size={15} />
                      </div>
                      <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition truncate">
                        {show.movie_name}
                      </h3>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex-shrink-0 border ${
                        isSoldOut
                          ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                          : occupancyPct > 80
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                          : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      }`}
                    >
                      {isSoldOut ? "Sold Out" : `${show.available_seats} Left`}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-850 mb-4">
                    <p className="flex items-center gap-2 text-slate-300">
                      <FaMapMarkerAlt className="text-emerald-400 text-xs flex-shrink-0" />
                      <span className="truncate">{show.theater_name}</span>
                    </p>
                    <p className="flex items-center gap-2 text-slate-300">
                      <FaCalendarAlt className="text-purple-400 text-xs flex-shrink-0" />
                      <span>{show.date}</span>
                    </p>
                    <p className="flex items-center gap-2 text-slate-300">
                      <FaClock className="text-amber-400 text-xs flex-shrink-0" />
                      <span className="font-mono">
                        {show.start_time} — {show.end_time}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Occupancy Bar */}
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <FaUsers className="text-slate-500" />
                      <span>{booked} / {total} booked</span>
                    </span>
                    <span className="font-mono font-bold text-amber-400">{occupancyPct}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full transition-all duration-500 ${
                        occupancyPct > 80
                          ? "bg-gradient-to-r from-amber-500 to-rose-500"
                          : "bg-gradient-to-r from-emerald-500 to-amber-500"
                      }`}
                      style={{ width: `${Math.min(occupancyPct, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
