import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { toast } from "react-toastify";
import {
  FaUser,
  FaFilm,
  FaMapMarkerAlt,
  FaChair,
  FaCalendarAlt,
  FaRupeeSign,
  FaTicketAlt,
  FaSearch,
  FaSpinner,
  FaReceipt,
} from "react-icons/fa";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    axios
      .get("bookings/admin/")
      .then((res) => setBookings(res.data))
      .catch((err) => {
        toast.error("Failed to load bookings");
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredBookings = bookings.filter(
    (b) =>
      (b.user_name || b.user || "").toLowerCase().includes(search.toLowerCase()) ||
      (b.movie_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (b.theater_name || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = bookings.reduce((sum, b) => sum + (Number(b.total_price) || 0), 0);

  return (
    <div className="space-y-6" data-aos="fade-up">
      {/* Top Banner & Stats */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 backdrop-blur-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FaTicketAlt className="text-amber-400" /> Platform Admissions & Bookings
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Global ticket sales ledger across all cinemas and screenings
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-64">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
            <input
              type="text"
              placeholder="Search user, movie, venue..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs pl-9 pr-3.5 py-2.5 rounded-xl focus:outline-none focus:border-amber-400/80 placeholder:text-slate-600 transition"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-amber-400 font-mono">
              {filteredBookings.length} Tickets
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-emerald-400 font-mono">
              <FaRupeeSign size={10} />
              {totalRevenue.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
          <FaSpinner className="animate-spin text-amber-400 text-3xl mb-3" />
          <p className="text-sm">Loading admissions ledger...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-slate-850 p-8">
          <FaReceipt className="text-slate-600 text-4xl mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-300">No Bookings Found</h3>
          <p className="text-xs text-slate-500 mt-1">
            {search ? `No tickets match "${search}"` : "No bookings recorded in the system yet."}
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-slate-900/90 rounded-2xl border border-slate-800 hover:border-amber-500/40 p-5 shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 relative overflow-hidden"
            >
              {/* Subtle top color strip */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600" />

              <div>
                {/* Header: User & Seat */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                      <FaUser size={13} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition">
                        {booking.user_name || booking.user || "Audience Member"}
                      </h4>
                      <span className="text-[10px] font-mono text-slate-500">
                        Pass ID: #{booking.id}
                      </span>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-300 font-mono text-xs font-bold flex items-center gap-1">
                    <FaChair size={10} />
                    {booking.seat ? `${booking.seat.row}${booking.seat.column}` : "VIP"}
                  </span>
                </div>

                {/* Details Card */}
                <div className="space-y-2 text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-850 mb-3">
                  <p className="flex items-center gap-2">
                    <FaFilm className="text-amber-400 text-xs flex-shrink-0" />
                    <span className="font-semibold text-white truncate">
                      {booking.movie_name || "Screening Title"}
                    </span>
                  </p>

                  <p className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-rose-400 text-xs flex-shrink-0" />
                    <span className="truncate text-slate-400">
                      {booking.theater_name || "Auditorium"}
                    </span>
                  </p>

                  {(booking.date || booking.time) && (
                    <p className="flex items-center gap-2 text-slate-400">
                      <FaCalendarAlt className="text-sky-400 text-xs flex-shrink-0" />
                      <span>
                        {booking.date} {booking.time ? `at ${booking.time}` : ""}
                      </span>
                    </p>
                  )}
                </div>
              </div>

              {/* Price & Status Footer */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-emerald-400 font-mono font-bold text-sm flex items-center">
                  <FaRupeeSign size={12} />
                  {booking.total_price || "150"}
                </span>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  CONFIRMED
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
