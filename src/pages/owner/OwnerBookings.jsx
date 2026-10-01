import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { toast } from "react-toastify";
import {
  FaUser,
  FaFilm,
  FaChair,
  FaTimesCircle,
  FaCheckCircle,
  FaSearch,
  FaTicketAlt,
  FaRupeeSign,
} from "react-icons/fa";

export function OwnerBookings() {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get("bookings/owner/")
      .then((res) => setBookings(res.data))
      .catch(() => toast.error("Failed to fetch audience bookings"))
      .finally(() => setLoading(false));
  }, []);

  const filteredBookings = bookings.filter(
    (b) =>
      (b.user_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (b.movie_name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="py-4" data-aos="fade-up">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <FaTicketAlt /> Admissions Ledger
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Audience Reservations
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Real-time ticket bookings, customer accounts, and seat allocation log
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
          <input
            type="text"
            placeholder="Search customer, movie..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 text-slate-200 text-sm pl-9 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-amber-400 placeholder:text-slate-500 transition"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center text-slate-500">
          <div className="w-10 h-10 border-2 border-amber-500/20 border-t-amber-400 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm">Loading ticket ledger...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="py-20 text-center text-slate-500">
          <FaTicketAlt className="text-5xl mx-auto mb-3 text-slate-700" />
          <p className="text-lg font-medium text-slate-400">No audience bookings found</p>
          <p className="text-xs mt-1">New reservations will appear automatically</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredBookings.map((b) => (
            <div
              key={b.id}
              className={`rounded-2xl p-5 border shadow-xl transition-all duration-300 relative flex flex-col justify-between ${
                b.is_cancelled
                  ? "bg-slate-950/60 border-slate-800 opacity-60"
                  : "bg-slate-900/85 backdrop-blur-xl border-slate-800 hover:border-amber-500/30"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-[11px] font-bold text-amber-400">
                    BK-#{b.id}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      b.is_cancelled
                        ? "bg-red-500/10 text-red-400 border border-red-500/20"
                        : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    }`}
                  >
                    {b.is_cancelled ? <FaTimesCircle size={9} /> : <FaCheckCircle size={9} />}
                    {b.is_cancelled ? "CANCELLED" : "CONFIRMED"}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-white mb-1 line-clamp-1">
                  {b.movie_name}
                </h2>

                <div className="space-y-1.5 text-xs text-slate-300 my-4 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2">
                    <FaUser className="text-sky-400" size={11} />
                    <span>Customer: <strong className="text-white">{b.user_name || "Guest"}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaChair className="text-amber-400" size={11} />
                    <span>
                      Allocated Seat:{" "}
                      <strong className="text-amber-300 font-bold">
                        {b.seat?.row}{b.seat?.column}
                      </strong>
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>Show: #{b.show}</span>
                <span className="text-emerald-400 font-bold">Paid</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
