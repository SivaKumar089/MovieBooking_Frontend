import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaVideo,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaChair,
  FaArrowRight,
  FaRupeeSign,
} from "react-icons/fa";

export function OwnerShows() {
  const navigate = useNavigate();
  const [shows, setShows] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const ownerId = useSelector((state) => state.auth.user?.user_id);

  useEffect(() => {
    setLoading(true);
    axios
      .get("shows/")
      .then((res) => {
        setShows(res.data);
      })
      .catch((err) => {
        toast.error("Failed to load your shows");
      })
      .finally(() => setLoading(false));
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
    <div className="py-4" data-aos="fade-up">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <FaCalendarAlt /> Screening Schedule
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Auditorium Shows
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Live schedule, occupancy rates, and seat reservation status across all screens
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
          <input
            type="text"
            placeholder="Search by movie or theater..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 text-slate-200 text-sm pl-9 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-amber-400 placeholder:text-slate-500 transition"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center text-slate-500">
          <div className="w-10 h-10 border-2 border-amber-500/20 border-t-amber-400 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm">Loading screening schedules...</p>
        </div>
      ) : filteredShows.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredShows.map((show) => {
            const booked = show.booked_seats || 0;
            const total = show.total_seats || 100;
            const occupancyRate = Math.round((booked / total) * 100);

            return (
              <div
                key={show.id}
                className="bg-slate-900/85 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl hover:border-amber-500/40 transition duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-0.5">
                        {show.theater_name}
                      </span>
                      <h2 className="text-lg font-bold text-white line-clamp-1">
                        {show.movie_name}
                      </h2>
                    </div>
                    <div className="bg-slate-800/80 border border-slate-700 px-2.5 py-1 rounded-lg text-xs font-bold text-amber-400">
                      ₹{show.standard_price || show.price || 140}+
                    </div>
                  </div>

                  {/* Timing Pill */}
                  <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-xl mb-4 text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <FaCalendarAlt className="text-amber-400" size={11} /> Date:
                      </span>
                      <span className="font-semibold text-white">{show.date}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <FaClock className="text-sky-400" size={11} /> Time:
                      </span>
                      <span className="font-semibold text-white">
                        {show.start_time} - {show.end_time}
                      </span>
                    </div>
                  </div>

                  {/* Occupancy Progress */}
                  <div className="space-y-1.5 mb-5">
                    <div className="flex justify-between text-xs text-slate-400 font-medium">
                      <span className="flex items-center gap-1">
                        <FaChair className="text-emerald-400" />
                        Occupancy
                      </span>
                      <span className="text-slate-200 font-bold">
                        {booked} / {total} ({occupancyRate}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          occupancyRate > 70
                            ? "bg-red-500"
                            : occupancyRate > 30
                            ? "bg-amber-500"
                            : "bg-emerald-500"
                        }`}
                        style={{ width: `${occupancyRate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() =>
                    navigate("/owner/seatlayout", { state: { showId: show.id } })
                  }
                  className="w-full bg-slate-800 hover:bg-slate-700 text-slate-100 hover:text-amber-400 font-bold text-xs py-2.5 px-4 rounded-xl border border-slate-700/80 transition duration-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FaChair /> Inspect Seat Layout
                  <FaArrowRight size={10} />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-20 text-center text-slate-500">
          <FaVideo className="text-5xl mx-auto mb-3 text-slate-700" />
          <p className="text-lg font-medium text-slate-400">No scheduled shows found</p>
          <p className="text-xs mt-1">Schedule your first screening using the sidebar</p>
        </div>
      )}
    </div>
  );
}
