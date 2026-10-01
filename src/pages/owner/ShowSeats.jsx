import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import { toast } from "react-toastify";
import { FaChair, FaArrowLeft, FaTv, FaCrown, FaShieldAlt } from "react-icons/fa";

export function ShowSeats() {
  const location = useLocation();
  const navigate = useNavigate();
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const showId = location.state?.showId;

  useEffect(() => {
    if (!showId) return;
    setLoading(true);
    axios
      .get(`shows/${showId}/seats/`)
      .then((res) => setSeats(res.data))
      .catch(() => toast.error("Failed to load show seats"))
      .finally(() => setLoading(false));
  }, [showId]);

  const bookedCount = seats.filter((s) => s.is_booked).length;
  const availableCount = seats.length - bookedCount;

  return (
    <div className="py-4 max-w-5xl mx-auto" data-aos="fade-up">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-amber-400 transition mb-2"
          >
            <FaArrowLeft size={10} /> Back to Screening Schedule
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <FaChair className="text-amber-400" />
            Auditorium Seat Layout Inspector
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Real-time visual map of booked vs available seating inventory
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs bg-slate-900/90 border border-slate-800 px-4 py-2.5 rounded-xl">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-md bg-emerald-500/20 border border-emerald-500/50"></div>
            <span className="text-slate-300">Available ({availableCount})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-md bg-red-500"></div>
            <span className="text-slate-300">Booked ({bookedCount})</span>
          </div>
        </div>
      </div>

      {/* Curved Screen Representation */}
      <div className="relative mb-10 mt-4">
        <div className="w-3/4 mx-auto h-3 screen-curve"></div>
        <div className="h-12 screen-glow flex items-center justify-center">
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-sky-400/80 flex items-center gap-2">
            <FaTv size={12} /> Auditorium Screen Direction
          </span>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-500">
          <div className="w-10 h-10 border-2 border-amber-500/20 border-t-amber-400 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm">Mapping auditorium seats...</p>
        </div>
      ) : (
        <div className="bg-slate-900/85 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-2xl overflow-x-auto pb-6">
          <div className="min-w-[650px] space-y-3">
            {["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"].map((rowLetter) => (
              <div key={rowLetter} className="flex items-center justify-center gap-2">
                <span className="w-6 text-center text-xs font-bold text-slate-500 font-mono">
                  {rowLetter}
                </span>

                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((col) => {
                    const seat = seats.find(
                      (s) => s.row === rowLetter && s.column === col
                    ) || { row: rowLetter, column: col, is_booked: false };

                    return (
                      <div
                        key={col}
                        title={
                          seat.is_booked
                            ? `Seat ${rowLetter}${col}: Booked (${seat.booked_by || "Customer"})`
                            : `Seat ${rowLetter}${col}: Available`
                        }
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex flex-col items-center justify-center text-[10px] font-bold transition duration-150 ${
                          seat.is_booked
                            ? "bg-red-500/80 text-white border border-red-400 shadow-md shadow-red-500/20"
                            : "bg-slate-950 border border-slate-700/80 text-emerald-400 hover:border-emerald-400"
                        }`}
                      >
                        <FaChair size={10} />
                        {col}
                      </div>
                    );
                  })}
                </div>

                <span className="w-6 text-center text-xs font-bold text-slate-500 font-mono">
                  {rowLetter}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
