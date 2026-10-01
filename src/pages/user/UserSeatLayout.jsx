import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
  FaTicketAlt,
  FaChair,
  FaRupeeSign,
  FaArrowRight,
  FaArrowLeft,
  FaInfoCircle,
  FaTv,
} from "react-icons/fa";

export default function UserSeatLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const showId = location.state?.showId;

  const [show, setShow] = useState(null);
  const [seats, setSeats] = useState([]);
  const [myTickets, setMyTickets] = useState([]);
  const [selected, setSelected] = useState([]);
  const [ticketLimit, setTicketLimit] = useState(6);
  const token = useSelector((state) => state.auth.access);

  useEffect(() => {
    if (!showId) return;

    // Load show details for pricing
    axios
      .get(`shows/${showId}/`)
      .then((res) => setShow(res.data))
      .catch((err) => console.error("Error fetching show:", err));

    // Load seats
    axios
      .get(`shows/${showId}/seats/`)
      .then((res) => setSeats(res.data))
      .catch((err) => console.error("Error loading seats:", err));

    // Load user's booked tickets
    if (token) {
      axios
        .get(`my-tickets/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const myBookedSeats = res.data
            .filter((ticket) => !ticket.is_cancelled && ticket.seat)
            .map((ticket) => ticket.seat.id);
          setMyTickets(myBookedSeats);
        })
        .catch((err) => console.error("Error loading my tickets:", err));
    }
  }, [showId, token]);

  const getSeatPrice = (seat) => {
    if (!show) return 140;
    const tier = seat.tier || (['A', 'B'].includes(seat.row) ? 'VIP' : ['C', 'D', 'E', 'F'].includes(seat.row) ? 'PREMIUM' : 'STANDARD');
    if (tier === 'VIP') return Number(show.vip_price || 280);
    if (tier === 'PREMIUM') return Number(show.premium_price || 200);
    return Number(show.standard_price || show.price || 140);
  };

  const handleSelect = (seat) => {
    if (seat.is_booked || myTickets.includes(seat.id)) return;

    if (selected.some((s) => s.id === seat.id)) {
      setSelected((prev) => prev.filter((s) => s.id !== seat.id));
    } else {
      if (selected.length >= ticketLimit) {
        toast.info(`You can select a maximum of ${ticketLimit} seats per booking.`);
        return;
      }
      setSelected((prev) => [...prev, seat]);
    }
  };

  const totalAmount = selected.reduce((sum, seat) => sum + getSeatPrice(seat), 0);

  const handleProceedToPay = () => {
    if (selected.length === 0) {
      toast.error("Please select at least one seat to proceed.");
      return;
    }

    navigate("/user/payment", {
      state: {
        showId,
        show,
        selectedSeats: selected,
        totalAmount,
        count: selected.length,
      },
    });
  };

  // Group seats by tier / row sections
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

  return (
    <div className="py-4 pb-28 max-w-5xl mx-auto" data-aos="fade-up">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-amber-400 transition mb-2"
          >
            <FaArrowLeft size={10} /> Back to Shows
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <FaTicketAlt className="text-amber-400" />
            {show?.movie_name || "Select Your Seats"}
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            {show?.theater_name} • {show?.date} • {show?.start_time}
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs bg-slate-900/90 border border-slate-800 px-4 py-2.5 rounded-xl">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-md bg-slate-800 border border-emerald-500/50"></div>
            <span className="text-slate-300">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-md bg-amber-500 text-black font-bold"></div>
            <span className="text-slate-300">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-md bg-slate-800 border border-slate-700 opacity-40"></div>
            <span className="text-slate-500">Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-md bg-sky-500"></div>
            <span className="text-slate-300">My Ticket</span>
          </div>
        </div>
      </div>

      {/* Curved Screen Representation */}
      <div className="relative mb-12 mt-6">
        <div className="w-4/5 mx-auto h-3 screen-curve"></div>
        <div className="h-16 screen-glow flex items-center justify-center">
          <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-sky-400/80 flex items-center gap-2">
            <FaTv size={13} /> All Eyes This Way • Cinema Screen
          </span>
        </div>
      </div>

      {/* Seat Grid Sections */}
      <div className="space-y-8 overflow-x-auto pb-4">
        {/* VIP Section */}
        <div>
          <div className="flex items-center justify-between text-xs font-bold text-amber-400 uppercase tracking-wider mb-3 px-2 border-b border-amber-500/20 pb-1">
            <span>👑 VIP Recliner Tier — ₹{show?.vip_price || 280}</span>
            <span className="text-[10px] text-slate-400 font-normal">Rows A & B</span>
          </div>
          <div className="flex flex-col gap-2 min-w-[500px]">
            {["A", "B"].map((rowLetter) => (
              <div key={rowLetter} className="flex items-center justify-center gap-2">
                <span className="w-6 text-center text-xs font-bold text-slate-500">
                  {rowLetter}
                </span>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((col) => {
                    const seat = seats.find(
                      (s) => s.row === rowLetter && s.column === col
                    ) || { row: rowLetter, column: col, id: `${rowLetter}${col}` };

                    const isMine = myTickets.includes(seat.id);
                    const isSelected = selected.some((s) => s.id === seat.id);

                    let seatStyle = "bg-slate-900 border border-amber-500/40 text-slate-300 hover:border-amber-400 hover:bg-slate-800 cursor-pointer";
                    if (seat.is_booked) {
                      seatStyle = isMine
                        ? "bg-sky-500 text-white cursor-not-allowed border-sky-400 shadow-md shadow-sky-500/20"
                        : "bg-slate-900/40 border border-slate-800 text-slate-600 cursor-not-allowed opacity-40";
                    } else if (isSelected) {
                      seatStyle = "bg-amber-500 text-black font-extrabold border-amber-400 shadow-lg shadow-amber-500/30 scale-105 cursor-pointer";
                    }

                    return (
                      <button
                        key={col}
                        disabled={seat.is_booked}
                        onClick={() => handleSelect(seat)}
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex flex-col items-center justify-center text-[10px] font-bold transition duration-150 ${seatStyle}`}
                        title={`${rowLetter}${col} • ₹${getSeatPrice(seat)}`}
                      >
                        <FaChair size={11} />
                        {col}
                      </button>
                    );
                  })}
                </div>
                <span className="w-6 text-center text-xs font-bold text-slate-500">
                  {rowLetter}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Premium Section */}
        <div>
          <div className="flex items-center justify-between text-xs font-bold text-sky-400 uppercase tracking-wider mb-3 px-2 border-b border-sky-500/20 pb-1">
            <span>✨ Premium Club Tier — ₹{show?.premium_price || 200}</span>
            <span className="text-[10px] text-slate-400 font-normal">Rows C to F</span>
          </div>
          <div className="flex flex-col gap-2 min-w-[500px]">
            {["C", "D", "E", "F"].map((rowLetter) => (
              <div key={rowLetter} className="flex items-center justify-center gap-2">
                <span className="w-6 text-center text-xs font-bold text-slate-500">
                  {rowLetter}
                </span>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((col) => {
                    const seat = seats.find(
                      (s) => s.row === rowLetter && s.column === col
                    ) || { row: rowLetter, column: col, id: `${rowLetter}${col}` };

                    const isMine = myTickets.includes(seat.id);
                    const isSelected = selected.some((s) => s.id === seat.id);

                    let seatStyle = "bg-slate-900 border border-slate-700 text-slate-300 hover:border-sky-400 hover:bg-slate-800 cursor-pointer";
                    if (seat.is_booked) {
                      seatStyle = isMine
                        ? "bg-sky-500 text-white cursor-not-allowed border-sky-400 shadow-md shadow-sky-500/20"
                        : "bg-slate-900/40 border border-slate-800 text-slate-600 cursor-not-allowed opacity-40";
                    } else if (isSelected) {
                      seatStyle = "bg-amber-500 text-black font-extrabold border-amber-400 shadow-lg shadow-amber-500/30 scale-105 cursor-pointer";
                    }

                    return (
                      <button
                        key={col}
                        disabled={seat.is_booked}
                        onClick={() => handleSelect(seat)}
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex flex-col items-center justify-center text-[10px] font-bold transition duration-150 ${seatStyle}`}
                        title={`${rowLetter}${col} • ₹${getSeatPrice(seat)}`}
                      >
                        <FaChair size={11} />
                        {col}
                      </button>
                    );
                  })}
                </div>
                <span className="w-6 text-center text-xs font-bold text-slate-500">
                  {rowLetter}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Standard Section */}
        <div>
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 px-2 border-b border-slate-700/40 pb-1">
            <span>🎟️ Standard Classic Tier — ₹{show?.standard_price || 140}</span>
            <span className="text-[10px] text-slate-400 font-normal">Rows G to J</span>
          </div>
          <div className="flex flex-col gap-2 min-w-[500px]">
            {["G", "H", "I", "J"].map((rowLetter) => (
              <div key={rowLetter} className="flex items-center justify-center gap-2">
                <span className="w-6 text-center text-xs font-bold text-slate-500">
                  {rowLetter}
                </span>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((col) => {
                    const seat = seats.find(
                      (s) => s.row === rowLetter && s.column === col
                    ) || { row: rowLetter, column: col, id: `${rowLetter}${col}` };

                    const isMine = myTickets.includes(seat.id);
                    const isSelected = selected.some((s) => s.id === seat.id);

                    let seatStyle = "bg-slate-900 border border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-800 cursor-pointer";
                    if (seat.is_booked) {
                      seatStyle = isMine
                        ? "bg-sky-500 text-white cursor-not-allowed border-sky-400 shadow-md shadow-sky-500/20"
                        : "bg-slate-900/40 border border-slate-800 text-slate-600 cursor-not-allowed opacity-40";
                    } else if (isSelected) {
                      seatStyle = "bg-amber-500 text-black font-extrabold border-amber-400 shadow-lg shadow-amber-500/30 scale-105 cursor-pointer";
                    }

                    return (
                      <button
                        key={col}
                        disabled={seat.is_booked}
                        onClick={() => handleSelect(seat)}
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex flex-col items-center justify-center text-[10px] font-bold transition duration-150 ${seatStyle}`}
                        title={`${rowLetter}${col} • ₹${getSeatPrice(seat)}`}
                      >
                        <FaChair size={11} />
                        {col}
                      </button>
                    );
                  })}
                </div>
                <span className="w-6 text-center text-xs font-bold text-slate-500">
                  {rowLetter}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Sticky Checkout Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 px-6 py-4 shadow-2xl z-40">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs text-slate-400 font-medium flex items-center gap-2">
              <span>Selected ({selected.length} seats):</span>
              {selected.length === 0 ? (
                <span className="text-slate-500 italic">None selected yet</span>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {selected.map((s) => (
                    <span
                      key={s.id}
                      className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/30"
                    >
                      {s.row}{s.column}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="text-xl sm:text-2xl font-black text-white flex items-center gap-1 mt-1">
              <span>Total:</span>
              <span className="text-amber-400 flex items-center">
                <FaRupeeSign size={18} />
                {totalAmount}
              </span>
              <span className="text-[11px] font-normal text-slate-400 ml-1">
                (incl. GST & booking)
              </span>
            </div>
          </div>

          <button
            onClick={handleProceedToPay}
            disabled={selected.length === 0}
            className={`flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm shadow-xl transition cursor-pointer ${
              selected.length > 0
                ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-amber-500/20"
                : "bg-slate-800 text-slate-500 cursor-not-allowed"
            }`}
          >
            <span>Proceed to Checkout</span>
            <FaArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
