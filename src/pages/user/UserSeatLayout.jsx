import React, { useEffect, useState, useCallback } from "react";
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
  FaCheckCircle,
  FaTimesCircle,
  FaSyncAlt,
} from "react-icons/fa";

export default function UserSeatLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const token = useSelector((state) => state.auth.access);
  const user = useSelector((state) => state.auth.user);

  const [showId, setShowId] = useState(
    location.state?.showId ||
      searchParams.get("showId") ||
      sessionStorage.getItem("user_booking_show_id") ||
      ""
  );

  const [show, setShow] = useState(location.state?.show || null);
  const [seats, setSeats] = useState([]);
  const [myTickets, setMyTickets] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const ticketLimit = 8;

  // 1. Initial resolution of showId if none was passed
  useEffect(() => {
    if (!showId) {
      axios
        .get("shows/")
        .then((res) => {
          if (res.data && res.data.length > 0) {
            const firstId = String(res.data[0].id);
            setShowId(firstId);
            setShow(res.data[0]);
            sessionStorage.setItem("user_booking_show_id", firstId);
          }
        })
        .catch((err) => console.error("Error loading default show:", err));
    } else {
      sessionStorage.setItem("user_booking_show_id", String(showId));
    }
  }, [showId]);

  // 2. Fetch seats and show details
  const fetchLayoutData = useCallback(async (currentId) => {
    if (!currentId) return;
    setLoading(true);
    try {
      const [showRes, seatsRes] = await Promise.all([
        axios.get(`shows/${currentId}/`),
        axios.get(`shows/${currentId}/seats/`),
      ]);
      setShow(showRes.data);
      setSeats(seatsRes.data || []);
    } catch (err) {
      console.error("Error fetching show layout:", err);
      toast.error("Failed to load seat layout");
    } finally {
      setLoading(false);
    }
  }, []);

  // 3. Fetch user's booked tickets
  const fetchMyTickets = useCallback(() => {
    if (!token) return;
    axios
      .get("my-tickets/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const myBookedSeats = (res.data || [])
          .filter((ticket) => !ticket.is_cancelled && ticket.seat)
          .map((ticket) => ticket.seat.id);
        setMyTickets(myBookedSeats);
      })
      .catch((err) => console.error("Error loading my tickets:", err));
  }, [token]);

  useEffect(() => {
    if (showId) {
      fetchLayoutData(showId);
      fetchMyTickets();
    }
  }, [showId, fetchLayoutData, fetchMyTickets]);

  const bookedCount = seats.filter((s) => s.is_booked).length;
  const totalCount = seats.length || show?.total_seats || 100;
  const availableCount = Math.max(0, totalCount - bookedCount);

  const getSeatPrice = (seat) => {
    if (!show) return 140;
    const tier =
      seat.tier ||
      (["A", "B"].includes(seat.row)
        ? "VIP"
        : ["C", "D", "E", "F"].includes(seat.row)
        ? "PREMIUM"
        : "STANDARD");
    if (tier === "VIP") return Number(show.vip_price || 250);
    if (tier === "PREMIUM") return Number(show.premium_price || 180);
    return Number(show.standard_price || show.price || 120);
  };

  // Determine exact seat status for consistent coloring
  const getSeatStatus = (seat) => {
    const isMine =
      seat.is_mine ||
      myTickets.includes(seat.id) ||
      (user && (seat.booked_by === user.username || seat.booked_by_id === user.id));

    if (seat.is_booked) {
      return isMine ? "MY_BOOKED" : "BOOKED_BY_OTHER";
    }
    if (selected.some((s) => s.id === seat.id)) {
      return "SELECTED";
    }
    return "AVAILABLE";
  };

  const handleSelect = (seat) => {
    const status = getSeatStatus(seat);
    if (status === "MY_BOOKED" || status === "BOOKED_BY_OTHER") {
      if (status === "MY_BOOKED") {
        toast.info(`Seat ${seat.row}${seat.column} is already booked by you.`);
      } else {
        toast.warning(`Seat ${seat.row}${seat.column} is already booked by another user.`);
      }
      return;
    }

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
        showId: Number(showId),
        show,
        selectedSeats: selected,
        totalAmount,
        count: selected.length,
      },
    });
  };

  return (
    <div className="py-4 pb-28 max-w-5xl mx-auto" data-aos="fade-up">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-amber-400 transition mb-2 cursor-pointer"
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

        {/* Real-time Counts & Refresh */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
              {availableCount} Available
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold">
              {bookedCount} Booked
            </span>
          </div>
          <button
            onClick={() => {
              fetchLayoutData(showId);
              fetchMyTickets();
              toast.info("Refreshed seat status");
            }}
            className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-amber-400 transition cursor-pointer"
            title="Refresh seats from database"
          >
            <FaSyncAlt size={12} />
          </button>
        </div>
      </div>

      {/* Seat Legend — Consistent Color Specifications */}
      <div className="flex flex-wrap items-center justify-center gap-5 text-xs bg-slate-900/90 border border-slate-800 px-5 py-3 rounded-2xl mb-8 shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-md bg-slate-900 border border-slate-700"></div>
          <span className="text-slate-300">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-md bg-amber-500 border border-amber-400 text-slate-950 font-bold"></div>
          <span className="text-slate-300">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-md bg-rose-950/50 border border-rose-800/60"></div>
          <span className="text-rose-300/80">Booked by Others</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-md bg-blue-600 border border-blue-500 shadow-sm shadow-blue-500/30"></div>
          <span className="text-blue-300 font-bold">My Booked Seats (Blue)</span>
        </div>
      </div>

      {/* Curved Screen Representation */}
      <div className="relative mb-12 mt-4">
        <div className="w-4/5 mx-auto h-3 screen-curve"></div>
        <div className="h-14 screen-glow flex items-center justify-center">
          <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-slate-300/80 flex items-center gap-2">
            <FaTv size={13} /> Cinema Screen • All Eyes This Way
          </span>
        </div>
      </div>

      {/* Seat Grid Sections */}
      {loading ? (
        <div className="py-24 text-center text-slate-500">
          <div className="w-10 h-10 border-2 border-amber-500/20 border-t-amber-400 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm">Retrieving real-time seat availability...</p>
        </div>
      ) : (
        <div className="space-y-8 overflow-x-auto pb-4">
          {/* VIP Section */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-amber-400/90 uppercase tracking-wider mb-3 px-2 border-b border-amber-500/20 pb-1">
              <span>👑 VIP Recliner Tier — ₹{show?.vip_price || 250}</span>
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
                      ) || { row: rowLetter, column: col, id: `${rowLetter}${col}`, is_booked: false };

                      const status = getSeatStatus(seat);
                      let seatStyle = "";
                      let tooltip = "";

                      if (status === "MY_BOOKED") {
                        seatStyle =
                          "bg-blue-600 text-white border-2 border-blue-400 shadow-md shadow-blue-500/30 cursor-not-allowed scale-105 font-black";
                        tooltip = `Row ${rowLetter} - Seat ${col} (Your Confirmed Ticket • VIP)`;
                      } else if (status === "BOOKED_BY_OTHER") {
                        seatStyle =
                          "bg-rose-950/50 border border-rose-800/60 text-rose-300/80 cursor-not-allowed opacity-70";
                        tooltip = `Row ${rowLetter} - Seat ${col} (Booked by another user • VIP)`;
                      } else if (status === "SELECTED") {
                        seatStyle =
                          "bg-amber-500 text-slate-950 font-black border-2 border-amber-400 shadow-md shadow-amber-500/25 scale-105 cursor-pointer";
                        tooltip = `Row ${rowLetter} - Seat ${col} (Selected • ₹${getSeatPrice(seat)})`;
                      } else {
                        seatStyle =
                          "bg-slate-900 border border-amber-500/30 text-slate-300 hover:border-amber-400/80 hover:bg-slate-800 cursor-pointer";
                        tooltip = `Row ${rowLetter} - Seat ${col} (Available • ₹${getSeatPrice(seat)})`;
                      }

                      return (
                        <button
                          key={col}
                          type="button"
                          disabled={seat.is_booked}
                          onClick={() => handleSelect(seat)}
                          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex flex-col items-center justify-center text-[10px] font-bold transition duration-150 ${seatStyle}`}
                          title={tooltip}
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
            <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 px-2 border-b border-slate-700/60 pb-1">
              <span>✨ Premium Club Tier — ₹{show?.premium_price || 180}</span>
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
                      ) || { row: rowLetter, column: col, id: `${rowLetter}${col}`, is_booked: false };

                      const status = getSeatStatus(seat);
                      let seatStyle = "";
                      let tooltip = "";

                      if (status === "MY_BOOKED") {
                        seatStyle =
                          "bg-blue-600 text-white border-2 border-blue-400 shadow-md shadow-blue-500/30 cursor-not-allowed scale-105 font-black";
                        tooltip = `Row ${rowLetter} - Seat ${col} (Your Confirmed Ticket • Premium)`;
                      } else if (status === "BOOKED_BY_OTHER") {
                        seatStyle =
                          "bg-rose-950/50 border border-rose-800/60 text-rose-300/80 cursor-not-allowed opacity-70";
                        tooltip = `Row ${rowLetter} - Seat ${col} (Booked by another user • Premium)`;
                      } else if (status === "SELECTED") {
                        seatStyle =
                          "bg-amber-500 text-slate-950 font-black border-2 border-amber-400 shadow-md shadow-amber-500/25 scale-105 cursor-pointer";
                        tooltip = `Row ${rowLetter} - Seat ${col} (Selected • ₹${getSeatPrice(seat)})`;
                      } else {
                        seatStyle =
                          "bg-slate-900 border border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-800 cursor-pointer";
                        tooltip = `Row ${rowLetter} - Seat ${col} (Available • ₹${getSeatPrice(seat)})`;
                      }

                      return (
                        <button
                          key={col}
                          type="button"
                          disabled={seat.is_booked}
                          onClick={() => handleSelect(seat)}
                          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex flex-col items-center justify-center text-[10px] font-bold transition duration-150 ${seatStyle}`}
                          title={tooltip}
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
              <span>🎟️ Standard Classic Tier — ₹{show?.standard_price || 120}</span>
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
                      ) || { row: rowLetter, column: col, id: `${rowLetter}${col}`, is_booked: false };

                      const status = getSeatStatus(seat);
                      let seatStyle = "";
                      let tooltip = "";

                      if (status === "MY_BOOKED") {
                        seatStyle =
                          "bg-blue-600 text-white border-2 border-blue-400 shadow-md shadow-blue-500/30 cursor-not-allowed scale-105 font-black";
                        tooltip = `Row ${rowLetter} - Seat ${col} (Your Confirmed Ticket • Standard)`;
                      } else if (status === "BOOKED_BY_OTHER") {
                        seatStyle =
                          "bg-rose-950/50 border border-rose-800/60 text-rose-300/80 cursor-not-allowed opacity-70";
                        tooltip = `Row ${rowLetter} - Seat ${col} (Booked by another user • Standard)`;
                      } else if (status === "SELECTED") {
                        seatStyle =
                          "bg-amber-500 text-slate-950 font-black border-2 border-amber-400 shadow-md shadow-amber-500/25 scale-105 cursor-pointer";
                        tooltip = `Row ${rowLetter} - Seat ${col} (Selected • ₹${getSeatPrice(seat)})`;
                      } else {
                        seatStyle =
                          "bg-slate-900 border border-slate-800 text-slate-400 hover:border-slate-600 hover:bg-slate-800 cursor-pointer";
                        tooltip = `Row ${rowLetter} - Seat ${col} (Available • ₹${getSeatPrice(seat)})`;
                      }

                      return (
                        <button
                          key={col}
                          type="button"
                          disabled={seat.is_booked}
                          onClick={() => handleSelect(seat)}
                          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex flex-col items-center justify-center text-[10px] font-bold transition duration-150 ${seatStyle}`}
                          title={tooltip}
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
      )}

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
                      className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 font-bold text-xs border border-amber-500/25"
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
            className={`flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm shadow-md transition cursor-pointer ${
              selected.length > 0
                ? "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/15"
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
