import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaChair, FaArrowLeft, FaTv, FaSpinner } from "react-icons/fa";

export function ShowSeats() {
  const { showId } = useParams();
  const navigate = useNavigate();
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/shows/${showId}/seats/`)
      .then((res) => setSeats(res.data))
      .catch((err) => {
        toast.error("Failed to load show seat layout");
      })
      .finally(() => setLoading(false));
  }, [showId]);

  const bookedCount = seats.filter((s) => s.is_booked).length;
  const availableCount = seats.length - bookedCount;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8" data-aos="fade-up">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition cursor-pointer"
            >
              <FaArrowLeft size={14} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <FaChair className="text-amber-400" /> Show Seat Inspector
              </h1>
              <p className="text-xs text-slate-400">
                Auditorium real-time reservation status for Screening #{showId}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {availableCount} Available
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              {bookedCount} Booked
            </span>
          </div>
        </div>

        {/* Curved Screen Element */}
        <div className="text-center py-4">
          <div className="w-3/4 mx-auto h-2 bg-gradient-to-r from-transparent via-amber-400 to-transparent rounded-full shadow-[0_0_25px_rgba(251,191,36,0.6)]" />
          <p className="text-[11px] font-mono tracking-[0.3em] uppercase text-amber-500/70 mt-2 flex items-center justify-center gap-2">
            <FaTv size={12} /> Auditorium Screen
          </p>
        </div>

        {/* Seats Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <FaSpinner className="animate-spin text-amber-400 text-3xl mb-3" />
            <p className="text-sm">Mapping auditorium seats...</p>
          </div>
        ) : seats.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-slate-850 p-8">
            <FaChair className="text-slate-600 text-4xl mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-300">No Seats Configured</h3>
            <p className="text-xs text-slate-500 mt-1">
              This show does not have an active seating map attached.
            </p>
          </div>
        ) : (
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-2xl">
            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2.5">
              {seats.map((seat) => (
                <div
                  key={seat.id}
                  className={`text-center py-2 px-1 rounded-xl text-xs font-mono font-bold transition-all duration-200 border flex flex-col items-center justify-center gap-0.5 ${
                    seat.is_booked
                      ? "bg-rose-950/40 border-rose-500/30 text-rose-400 cursor-not-allowed"
                      : "bg-slate-950 border-emerald-500/40 text-emerald-400 hover:border-emerald-400 hover:scale-105"
                  }`}
                >
                  <FaChair size={11} className={seat.is_booked ? "text-rose-400" : "text-emerald-400"} />
                  <span>
                    {seat.row}
                    {seat.number || seat.column}
                  </span>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-slate-950 border border-emerald-500/50" />
                <span>Available</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-rose-950/50 border border-rose-500/40" />
                <span>Reserved / Booked</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default ShowSeats;
