import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaFilm,
  FaTheaterMasks,
  FaCalendarAlt,
  FaClock,
  FaChair,
  FaCheckCircle,
  FaFire,
  FaArrowRight,
} from "react-icons/fa";

export default function GetShows() {
  const location = useLocation();
  const navigate = useNavigate();
  const movieId = location.state?.movieId;
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShows = async () => {
      setLoading(true);
      try {
        const url = movieId ? `shows/?movie=${movieId}` : "shows/";
        const res = await axios.get(url);
        setShows(res.data);
      } catch (error) {
        console.error("Error fetching shows:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShows();
  }, [movieId]);

  const handleViewSeat = (showId) => {
    navigate("/user/seat-layout", { state: { showId } });
  };

  return (
    <div className="py-4" data-aos="fade-up">
      <div className="mb-8 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
          <FaCalendarAlt /> Showtime Schedules
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Select Your Cinema & Showtime
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Pick your preferred screen and showtime for real-time seat reservation
        </p>
      </div>

      {loading ? (
        <div className="py-24 text-center text-slate-500">
          <div className="w-10 h-10 border-2 border-amber-500/20 border-t-amber-400 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm">Retrieving auditoriums and showtimes...</p>
        </div>
      ) : shows.length === 0 ? (
        <div className="py-20 text-center text-slate-500">
          <FaCalendarAlt className="text-5xl mx-auto mb-3 text-slate-700" />
          <p className="text-lg font-medium text-slate-400">No scheduled shows found</p>
          <p className="text-sm">Check back soon or explore other movies</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shows.map((s) => {
            const availablePercentage = s.total_seats
              ? Math.round((s.available_seats / s.total_seats) * 100)
              : 100;

            return (
              <div
                key={s.id}
                className="bg-slate-900/80 rounded-2xl border border-slate-800 hover:border-amber-500/40 p-5 transition duration-300 shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider block mb-0.5">
                        {s.theater_name}
                      </span>
                      <h2 className="text-xl font-bold text-white line-clamp-1">
                        {s.movie_name}
                      </h2>
                    </div>
                    <div className="bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-lg text-xs font-bold text-amber-400">
                      ₹{s.standard_price || s.price || 140}+
                    </div>
                  </div>

                  {/* Show Timing & Date */}
                  <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800 mb-4 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-slate-300">
                      <FaCalendarAlt className="text-amber-400" />
                      <span className="font-semibold">{s.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-amber-300 font-bold bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                      <FaClock size={11} />
                      {s.start_time} - {s.end_time}
                    </div>
                  </div>

                  {/* Seating Availability Bar */}
                  <div className="space-y-1.5 mb-5">
                    <div className="flex justify-between text-xs text-slate-400 font-medium">
                      <span className="flex items-center gap-1.5">
                        <FaChair className="text-emerald-400" />
                        Available Seats
                      </span>
                      <span className="text-slate-200 font-bold">
                        {s.available_seats} / {s.total_seats}
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          availablePercentage > 30
                            ? "bg-emerald-500"
                            : availablePercentage > 10
                            ? "bg-amber-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${availablePercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Tier Pricing Guide */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 py-2 border-t border-slate-800/80 mb-4">
                    <span>VIP: ₹{s.vip_price || 280}</span>
                    <span>•</span>
                    <span>Premium: ₹{s.premium_price || 200}</span>
                    <span>•</span>
                    <span>Standard: ₹{s.standard_price || 140}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleViewSeat(s.id)}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs py-3 px-4 rounded-xl shadow-md shadow-amber-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FaChair /> Select Seats <FaArrowRight size={11} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
