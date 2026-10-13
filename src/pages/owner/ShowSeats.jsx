import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
  FaChair,
  FaArrowLeft,
  FaTv,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaSyncAlt,
  FaTicketAlt,
  FaRupeeSign,
  FaInfoCircle,
  FaUserCheck,
} from "react-icons/fa";

export function ShowSeats() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const token = useSelector((state) => state.auth.access);
  const currentUser = useSelector((state) => state.auth.user);

  const [showsList, setShowsList] = useState([]);
  const [selectedShowId, setSelectedShowId] = useState(
    location.state?.showId ||
      searchParams.get("showId") ||
      sessionStorage.getItem("owner_selected_show_id") ||
      ""
  );
  const [showDetails, setShowDetails] = useState(null);
  const [seats, setSeats] = useState([]);
  const [myTickets, setMyTickets] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [inspectSeat, setInspectSeat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  // 1. Fetch available shows for the dropdown selector
  useEffect(() => {
    axios
      .get("shows/?managed=true")
      .then((res) => {
        const list = res.data || [];
        setShowsList(list);
        if (!selectedShowId && list.length > 0) {
          const firstId = String(list[0].id);
          setSelectedShowId(firstId);
          sessionStorage.setItem("owner_selected_show_id", firstId);
        }
      })
      .catch(() => {
        // Fallback to all shows
        axios.get("shows/").then((res) => {
          const list = res.data || [];
          setShowsList(list);
          if (!selectedShowId && list.length > 0) {
            const firstId = String(list[0].id);
            setSelectedShowId(firstId);
            sessionStorage.setItem("owner_selected_show_id", firstId);
          }
        });
      });
  }, []);

  // 2. Fetch seats & show details whenever selectedShowId changes
  const fetchShowData = useCallback(async (idToFetch) => {
    if (!idToFetch) return;
    setLoading(true);
    try {
      const [showRes, seatsRes] = await Promise.all([
        axios.get(`shows/${idToFetch}/`),
        axios.get(`shows/${idToFetch}/seats/`),
      ]);
      setShowDetails(showRes.data);
      setSeats(seatsRes.data || []);
      setSelectedSeats([]);
      setInspectSeat(null);
      sessionStorage.setItem("owner_selected_show_id", String(idToFetch));
    } catch (err) {
      console.error("Failed to load show data:", err);
      toast.error("Failed to load auditorium seating data");
    } finally {
      setLoading(false);
    }
  }, []);

  // 3. Fetch logged in user's / owner's booked tickets
  const fetchMyTickets = useCallback(() => {
    if (!token) return;
    axios
      .get("my-tickets/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const bookedSeatIds = (res.data || [])
          .filter((t) => !t.is_cancelled && t.seat)
          .map((t) => t.seat.id);
        setMyTickets(bookedSeatIds);
      })
      .catch((err) => console.warn("Could not fetch my tickets:", err));
  }, [token]);

  useEffect(() => {
    if (selectedShowId) {
      fetchShowData(selectedShowId);
      fetchMyTickets();
    }
  }, [selectedShowId, fetchShowData, fetchMyTickets]);

  const handleShowSelectChange = (e) => {
    const newId = e.target.value;
    setSelectedShowId(newId);
    sessionStorage.setItem("owner_selected_show_id", newId);
  };

  // Precise seat counts
  const bookedCount = seats.filter((s) => s.is_booked).length;
  const totalCount = seats.length || showDetails?.total_seats || 100;
  const availableCount = Math.max(0, totalCount - bookedCount);
  const occupancyRate = totalCount > 0 ? Math.round((bookedCount / totalCount) * 100) : 0;

  // Determine pricing
  const getSeatPrice = (seat) => {
    if (!showDetails) return 140;
    const tier = seat.tier || (["A", "B"].includes(seat.row) ? "VIP" : ["C", "D", "E", "F"].includes(seat.row) ? "PREMIUM" : "STANDARD");
    if (tier === "VIP") return Number(showDetails.vip_price || 250);
    if (tier === "PREMIUM") return Number(showDetails.premium_price || 180);
    return Number(showDetails.standard_price || showDetails.price || 120);
  };

  // Determine exact seat status
  const getSeatStatus = (seat) => {
    const isMine =
      seat.is_mine ||
      myTickets.includes(seat.id) ||
      (currentUser && (seat.booked_by === currentUser.username || seat.booked_by_id === currentUser.id));

    if (seat.is_booked) {
      return isMine ? "MY_BOOKED" : "BOOKED_BY_OTHER";
    }
    if (selectedSeats.some((s) => s.id === seat.id)) {
      return "SELECTED";
    }
    return "AVAILABLE";
  };

  // Seat click handler
  const handleSeatClick = (seat) => {
    const status = getSeatStatus(seat);

    if (status === "MY_BOOKED" || status === "BOOKED_BY_OTHER") {
      // Show inspect details for booked seat
      setInspectSeat(seat);
      return;
    }

    // Toggle temporary selection
    if (selectedSeats.some((s) => s.id === seat.id)) {
      setSelectedSeats((prev) => prev.filter((s) => s.id !== seat.id));
    } else {
      if (selectedSeats.length >= 8) {
        toast.info("Maximum 8 seats can be selected at a time.");
        return;
      }
      setSelectedSeats((prev) => [...prev, seat]);
    }
  };

  // Direct Book Selected Seats for Owner
  const handleOwnerBookSeats = async () => {
    if (selectedSeats.length === 0) {
      toast.warning("Please select at least one available seat to book.");
      return;
    }

    setBookingLoading(true);
    try {
      const payload = {
        show_id: Number(selectedShowId),
        seat_ids: selectedSeats.map((s) => s.id),
        payment_id: `OWNER-DESK-${Date.now()}`,
      };

      const res = await axios.post("bookings/", payload);
      toast.success(
        `🎉 Successfully booked ${selectedSeats.length} seat(s)! Booking Code: ${res.data?.booking_code}`
      );

      // Re-fetch show data & my tickets immediately to update UI in real-time
      await fetchShowData(selectedShowId);
      fetchMyTickets();
      setSelectedSeats([]);
    } catch (err) {
      console.error("Booking failed:", err);
      const errMsg =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        "Failed to complete booking. Please try again.";
      toast.error(errMsg);
    } finally {
      setBookingLoading(false);
    }
  };

  const totalSelectedAmount = selectedSeats.reduce(
    (sum, seat) => sum + getSeatPrice(seat),
    0
  );

  return (
    <div className="py-4 pb-20 max-w-5xl mx-auto" data-aos="fade-up">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-amber-400 transition mb-2 cursor-pointer"
          >
            <FaArrowLeft size={10} /> Back to Screening Schedule
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <FaChair className="text-amber-400" />
            Auditorium Seat Status & Booking Map
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Real-time seat-by-seat reservation status, inventory tracking, and direct booking
          </p>
        </div>

        {/* Screening Show Selector Dropdown */}
        <div className="flex items-center gap-2">
          {showsList.length > 0 && (
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Auditorium Show:
              </label>
              <select
                value={selectedShowId}
                onChange={handleShowSelectChange}
                className="bg-slate-900 border border-slate-700/80 text-amber-400 text-xs font-bold px-3 py-2 rounded-xl focus:outline-none focus:border-amber-400"
              >
                {showsList.map((s) => (
                  <option key={s.id} value={s.id}>
                    #{s.id} • {s.movie_name} ({s.date} {s.start_time?.slice(0, 5)})
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={() => {
              fetchShowData(selectedShowId);
              fetchMyTickets();
              toast.info("Refreshed seat status from database");
            }}
            className="p-2.5 mt-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-amber-400 transition cursor-pointer"
            title="Refresh database status"
          >
            <FaSyncAlt size={13} />
          </button>
        </div>
      </div>

      {/* Real-time Status Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Total Capacity
          </span>
          <div className="text-2xl font-black text-white mt-1">{totalCount}</div>
          <span className="text-[10px] text-slate-500">10 Rows × 10 Seats</span>
        </div>

        <div className="bg-slate-900/90 border border-emerald-500/20 rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <FaCheckCircle size={10} /> Available
          </span>
          <div className="text-2xl font-black text-emerald-400 mt-1">{availableCount}</div>
          <span className="text-[10px] text-slate-500">Ready for booking</span>
        </div>

        <div className="bg-slate-900/90 border border-rose-500/20 rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
            <FaTimesCircle size={10} /> Booked
          </span>
          <div className="text-2xl font-black text-rose-400 mt-1">{bookedCount}</div>
          <span className="text-[10px] text-slate-500">{occupancyRate}% Occupancy</span>
        </div>

        <div className="bg-slate-900/90 border border-blue-500/25 rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
            <FaTicketAlt size={10} /> My Booked Seats
          </span>
          <div className="text-2xl font-black text-blue-400 mt-1">
            {seats.filter((s) => s.is_booked && (s.is_mine || myTickets.includes(s.id))).length}
          </div>
          <span className="text-[10px] text-slate-500">Booked by this account</span>
        </div>
      </div>

      {/* Current Show Details Banner */}
      {showDetails && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 mb-6 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-black">
              #{showDetails.id}
            </div>
            <div>
              <div className="font-extrabold text-white text-sm sm:text-base">
                {showDetails.movie_name}
              </div>
              <div className="text-slate-400 text-xs">
                {showDetails.theater_name}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-300">
            <span className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
              <FaCalendarAlt className="text-amber-400" /> {showDetails.date}
            </span>
            <span className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
              <FaClock className="text-sky-400" /> {showDetails.start_time} - {showDetails.end_time}
            </span>
            <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1.5 rounded-xl font-bold">
              VIP ₹{showDetails.vip_price || 250} • Standard ₹{showDetails.standard_price || 120}
            </span>
          </div>
        </div>
      )}

      {/* Seat Color Legend — Exact Specifications */}
      <div className="flex flex-wrap items-center justify-center gap-5 text-xs bg-slate-900/90 border border-slate-800 px-5 py-3 rounded-2xl mb-6 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-md bg-slate-900 border border-slate-700"></div>
          <span className="text-slate-300 font-medium">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-md bg-amber-500 border border-amber-400 text-slate-950 font-bold"></div>
          <span className="text-slate-300 font-medium">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-md bg-rose-950/50 border border-rose-800/60"></div>
          <span className="text-rose-300/90 font-medium">Booked by Others</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-md bg-blue-600 border border-blue-500 shadow-sm shadow-blue-500/30"></div>
          <span className="text-blue-300 font-bold">My Booked Seats (Blue)</span>
        </div>
      </div>

      {/* Screen Representation */}
      <div className="relative mb-10 mt-4">
        <div className="w-3/4 mx-auto h-3 screen-curve"></div>
        <div className="h-12 screen-glow flex items-center justify-center">
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-sky-400/80 flex items-center gap-2">
            <FaTv size={12} /> Auditorium Screen Direction
          </span>
        </div>
      </div>

      {/* Seat Map */}
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
                    ) || {
                      row: rowLetter,
                      column: col,
                      id: `${rowLetter}${col}`,
                      is_booked: false,
                    };

                    const status = getSeatStatus(seat);

                    // Dynamic Styling based on Exact Specifications:
                    // - Blue: My booked seats
                    // - Muted red/unavailable: Booked by other users
                    // - Amber: Selected
                    // - Slate dark: Available
                    let seatClasses = "";
                    let tooltip = "";

                    if (status === "MY_BOOKED") {
                      seatClasses =
                        "bg-blue-600 text-white border-2 border-blue-400 shadow-md shadow-blue-500/30 font-black cursor-pointer scale-105";
                      tooltip = `Seat ${rowLetter}${col}: YOUR Booked Ticket (Click to inspect)`;
                    } else if (status === "BOOKED_BY_OTHER") {
                      seatClasses =
                        "bg-rose-950/50 border border-rose-800/60 text-rose-300/80 cursor-pointer opacity-70 hover:opacity-100";
                      tooltip = `Seat ${rowLetter}${col}: Booked by ${seat.booked_by || "Customer"} (Click to inspect)`;
                    } else if (status === "SELECTED") {
                      seatClasses =
                        "bg-amber-500 text-slate-950 font-black border-2 border-amber-400 shadow-md shadow-amber-500/25 scale-105 cursor-pointer";
                      tooltip = `Seat ${rowLetter}${col}: Selected • ₹${getSeatPrice(seat)}`;
                    } else {
                      seatClasses =
                        "bg-slate-900 border border-slate-700 text-slate-300 hover:border-amber-400 hover:text-white hover:bg-slate-800 cursor-pointer";
                      tooltip = `Seat ${rowLetter}${col}: Available • ₹${getSeatPrice(seat)}`;
                    }

                    return (
                      <button
                        key={col}
                        type="button"
                        onClick={() => handleSeatClick(seat)}
                        title={tooltip}
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex flex-col items-center justify-center text-[10px] font-bold transition duration-150 ${seatClasses}`}
                      >
                        <FaChair size={10} />
                        {col}
                      </button>
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

      {/* Seat Inspection Drawer / Modal */}
      {inspectSeat && (
        <div className="mt-6 bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black ${
                inspectSeat.is_mine || myTickets.includes(inspectSeat.id)
                  ? "bg-blue-600 text-white"
                  : "bg-rose-600 text-white"
              }`}
            >
              {inspectSeat.row}{inspectSeat.column}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-white font-bold text-sm">
                  Seat {inspectSeat.row}{inspectSeat.column} Details
                </h4>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    inspectSeat.is_mine || myTickets.includes(inspectSeat.id)
                      ? "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                      : "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                  }`}
                >
                  {inspectSeat.is_mine || myTickets.includes(inspectSeat.id)
                    ? "YOUR TICKET"
                    : "CUSTOMER BOOKING"}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Reserved by:{" "}
                <strong className="text-slate-200">
                  {inspectSeat.booked_by || "Audience Member"}
                </strong>
                {inspectSeat.booking_code && (
                  <span className="ml-2 font-mono text-amber-400">
                    ({inspectSeat.booking_code})
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setInspectSeat(null)}
              className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 transition cursor-pointer"
            >
              Close Details
            </button>
          </div>
        </div>
      )}

      {/* Floating Selection & Direct Booking Bar for Owner */}
      {selectedSeats.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 px-6 py-4 shadow-2xl z-40">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs text-slate-400 font-medium flex items-center gap-2">
                <span>Selected as Owner ({selectedSeats.length} seats):</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSeats.map((s) => (
                    <span
                      key={s.id}
                      className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/30"
                    >
                      {s.row}{s.column}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-xl sm:text-2xl font-black text-white flex items-center gap-1 mt-1">
                <span>Total:</span>
                <span className="text-amber-400 flex items-center">
                  <FaRupeeSign size={18} />
                  {totalSelectedAmount}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedSeats([])}
                className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white text-xs font-semibold transition cursor-pointer"
              >
                Clear Selection
              </button>

              <button
                onClick={handleOwnerBookSeats}
                disabled={bookingLoading}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-extrabold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 transition cursor-pointer disabled:opacity-50"
              >
                <FaTicketAlt />
                <span>
                  {bookingLoading ? "Confirming Booking..." : "Confirm & Book Seats"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShowSeats;
