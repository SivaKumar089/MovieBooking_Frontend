import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaFilm,
  FaTheaterMasks,
  FaChair,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaTicketAlt,
  FaQrcode,
  FaPrint,
  FaTrashAlt,
} from "react-icons/fa";

export default function MyTickets() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = () => {
    setLoading(true);
    axios
      .get("my-tickets/")
      .then((res) => {
        setTickets(res.data);
      })
      .catch((err) => {
        console.error("Error loading tickets:", err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleCancelTicket = async (ticketId) => {
    if (!window.confirm("Are you sure you want to cancel this ticket? The seat will be released immediately.")) {
      return;
    }

    try {
      await axios.patch(`bookings/${ticketId}/cancel/`);
      toast.success("Ticket cancelled successfully! Seat has been freed.");
      fetchTickets();
    } catch (err) {
      toast.error("Failed to cancel ticket. Please try again.");
    }
  };

  return (
    <div className="py-4" data-aos="fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <FaTicketAlt /> Digital Passbook
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            My Movie Tickets
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Show these digital passes at the cinema entrance for direct scanning
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-200 text-xs font-semibold transition"
        >
          <FaPrint /> Print Passes
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-500">
          <p>Loading your tickets...</p>
        </div>
      ) : tickets.length === 0 ? (
        <div className="py-20 text-center text-slate-500">
          <FaTicketAlt className="text-5xl mx-auto mb-3 text-slate-700" />
          <p className="text-lg font-medium text-slate-400">No tickets found</p>
          <p className="text-sm mb-6">You haven't booked any movie tickets yet.</p>
          <button
            onClick={() => navigate("/user/movies")}
            className="bg-amber-500 text-black font-bold text-xs px-6 py-2.5 rounded-xl shadow-lg shadow-amber-500/20"
          >
            Explore Movies
          </button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {tickets.map((ticket) => {
            const isCancelled = ticket.is_cancelled;
            const seat = ticket.seat || {};

            return (
              <div
                key={ticket.id}
                className={`relative flex flex-col sm:flex-row rounded-2xl overflow-hidden border shadow-xl transition-all duration-300 ${
                  isCancelled
                    ? "bg-slate-950/60 border-slate-800/80 opacity-60"
                    : "bg-slate-900/90 border-slate-800 hover:border-amber-500/30"
                }`}
              >
                {/* Left Ticket Stub */}
                <div className="flex-1 p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                        {ticket.theater_name}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isCancelled
                            ? "bg-red-500/10 text-red-400 border border-red-500/20"
                            : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        }`}
                      >
                        {isCancelled ? <FaTimesCircle size={9} /> : <FaCheckCircle size={9} />}
                        {isCancelled ? "CANCELLED" : "CONFIRMED"}
                      </span>
                    </div>

                    <h2 className="text-xl font-extrabold text-white mb-1 truncate">
                      {ticket.movie_name}
                    </h2>
                    <p className="text-xs text-slate-400 mb-4">
                      {ticket.theater_location || "Audi 1 • Dolby Atmos"}
                    </p>
                  </div>

                  {/* Show Datetime and Seat Pill */}
                  <div className="grid grid-cols-2 gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                        Date & Time
                      </span>
                      <span className="font-bold text-slate-200">
                        {ticket.show_date || "Today"} • {ticket.show_start_time || "Showtime"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                        Seat & Tier
                      </span>
                      <span className="font-bold text-amber-400">
                        Row {seat.row} - Seat {seat.column}{" "}
                        <span className="text-[10px] font-normal text-slate-400">
                          ({seat.tier || "Std"})
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Perforated Divider (Dashed on desktop) */}
                <div className="relative border-b sm:border-b-0 sm:border-r border-dashed border-slate-700/80 flex items-center justify-center">
                  {/* Decorative Notches */}
                  <div className="hidden sm:block absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-slate-950 border border-slate-800"></div>
                  <div className="hidden sm:block absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-slate-950 border border-slate-800"></div>
                </div>

                {/* Right Ticket Stub (Barcode/QR & Action) */}
                <div className="w-full sm:w-48 bg-slate-950/80 p-5 flex flex-col items-center justify-between text-center border-t sm:border-t-0 border-slate-800">
                  <div className="w-full">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                      Booking Code
                    </span>
                    <span className="font-mono text-xs font-black text-amber-400 tracking-wider block mb-3">
                      {ticket.booking_code || `BK-${ticket.id}0482`}
                    </span>

                    {/* Simulated QR Code Graphic */}
                    <div className="w-24 h-24 mx-auto p-2 bg-white rounded-xl shadow-inner flex flex-col items-center justify-center mb-3">
                      <FaQrcode className="text-slate-900 w-full h-full" />
                    </div>

                    <span className="text-[10px] text-slate-500 block">
                      Paid: ₹{ticket.seat_price || "140"}
                    </span>
                  </div>

                  {!isCancelled && (
                    <button
                      onClick={() => handleCancelTicket(ticket.id)}
                      className="w-full mt-3 py-1.5 px-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-[11px] font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <FaTrashAlt size={10} /> Cancel Seat
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
