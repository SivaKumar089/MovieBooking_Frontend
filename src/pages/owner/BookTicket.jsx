import React, { useState } from "react";
import axios from "../../utils/axios";
import { toast } from "react-toastify";
import { FaTicketAlt, FaChair, FaCalendarCheck } from "react-icons/fa";

export function BookTicket() {
  const [showId, setShowId] = useState("");
  const [seat, setSeat] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBook = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`shows/${showId}/seats/`, { seat_number: seat });
      toast.success("Box Office Ticket issued successfully!");
      setSeat("");
    } catch (err) {
      toast.error(err.response?.data?.error || "Booking failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-4 max-w-xl mx-auto" data-aos="fade-up">
      <div className="mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
          <FaTicketAlt /> Box Office Terminal
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Direct Ticket Issue
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Walk-in counter reservations with instant seat locking
        </p>
      </div>

      <form
        onSubmit={handleBook}
        className="bg-slate-900/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-4"
      >
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Screening Show ID
          </label>
          <div className="relative">
            <FaCalendarCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs pointer-events-none" />
            <input
              placeholder="e.g. 1"
              value={showId}
              onChange={(e) => setShowId(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-400 text-slate-100 pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition placeholder:text-slate-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Seat Code
          </label>
          <div className="relative">
            <FaChair className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs pointer-events-none" />
            <input
              placeholder="e.g. A1, B5"
              value={seat}
              onChange={(e) => setSeat(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-400 text-slate-100 pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition placeholder:text-slate-500 uppercase"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold py-3.5 rounded-xl shadow-lg shadow-amber-500/20 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer text-sm disabled:opacity-50"
        >
          <FaTicketAlt />
          <span>{loading ? "Issuing Ticket..." : "Issue Box Office Ticket"}</span>
        </button>
      </form>
    </div>
  );
}
