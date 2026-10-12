import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
  FaBolt,
  FaWallet,
  FaTicketAlt,
  FaTrashAlt,
  FaCheckCircle,
  FaSpinner,
  FaShieldAlt,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaChair,
  FaArrowLeft,
  FaSyncAlt,
  FaInfoCircle,
  FaCoins,
} from "react-icons/fa";

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.access);

  // Read state or fallback
  const incoming = location.state || {};
  const [show, setShow] = useState(incoming.show || null);
  const [showId, setShowId] = useState(incoming.showId || null);
  const [selectedSeats, setSelectedSeats] = useState(incoming.selectedSeats || null);
  const [loading, setLoading] = useState(false);
  const [initializingDummy, setInitializingDummy] = useState(false);
  const [clearingBackend, setClearingBackend] = useState(false);
  const [isDemoGenerated, setIsDemoGenerated] = useState(false);
  const [isCleared, setIsCleared] = useState(false);

  // 100% Mock / Dummy payment methods (NO Razorpay, NO UPI cards, NO QR codes)
  const [paymentMethod, setPaymentMethod] = useState("DUMMY_DIGITAL");
  const [mockTxId] = useState(() => Math.floor(100000 + Math.random() * 900000));

  // Initialize dummy session if accessed directly without prior state
  const loadDummyData = async () => {
    setInitializingDummy(true);
    setIsCleared(false);
    try {
      // Try to fetch active shows from backend
      const showsRes = await axios.get("shows/");
      const availableShows = showsRes.data || [];
      if (availableShows.length > 0) {
        const firstShow = availableShows[0];
        setShow(firstShow);
        setShowId(firstShow.id);

        // Fetch available unbooked seats
        const seatsRes = await axios.get(`shows/${firstShow.id}/seats/`);
        const freeSeats = (seatsRes.data || []).filter((s) => !s.is_booked);
        const demoSeats = freeSeats.slice(0, 2);

        if (demoSeats.length > 0) {
          setSelectedSeats(demoSeats);
          setIsDemoGenerated(true);
          setInitializingDummy(false);
          return;
        }
      }
    } catch (err) {
      console.warn("Could not fetch shows, loading offline dummy data", err);
    }

    // Fallback offline dummy data
    setShow({
      id: 1,
      movie_name: "Jailer 2 (Dummy Demo)",
      theater_name: "PVR Cinemas • Screen 1",
      date: "2026-10-08",
      start_time: "06:00:00",
      end_time: "09:00:00",
      vip_price: 280,
    });
    setShowId(1);
    setSelectedSeats([
      { id: 1, row: "A", column: 1, tier: "VIP" },
      { id: 2, row: "A", column: 2, tier: "VIP" },
    ]);
    setIsDemoGenerated(true);
    setInitializingDummy(false);
  };

  useEffect(() => {
    if (!showId || !selectedSeats) {
      // Auto-load dummy session so http://localhost:5173/user/payment works immediately
      loadDummyData();
    } else if (!show && showId) {
      axios
        .get(`shows/${showId}/`)
        .then((res) => setShow(res.data))
        .catch((err) => console.error(err));
    }
  }, [showId, selectedSeats]);

  // Clear current booking data
  const handleClearData = () => {
    setSelectedSeats(null);
    setShow(null);
    setShowId(null);
    setIsCleared(true);
    toast.success("Booking data cleared! You can load fresh dummy data or pick real seats.");
  };

  // Clear all previous test bookings and free seats in database
  const handleWipeTestBookings = async () => {
    if (!token) {
      toast.warning("Please sign in first to clear database test records.");
      return;
    }
    if (!window.confirm("Clear all your test bookings from the database and free up reserved seats?")) {
      return;
    }
    setClearingBackend(true);
    try {
      const res = await axios.post("bookings/clear-test-data/");
      toast.success(res.data.message || "Test bookings cleared and seats freed!");
      // Reload fresh dummy session
      loadDummyData();
    } catch (err) {
      const errMsg = err.response?.data?.message || err.response?.data?.error || "Failed to clear test data";
      toast.error(errMsg);
    } finally {
      setClearingBackend(false);
    }
  };

  // Calculate pricing (fake / dummy amounts)
  const calcSubtotal = () => {
    if (!selectedSeats || selectedSeats.length === 0) return 0;
    if (incoming.totalAmount) return incoming.totalAmount;
    return selectedSeats.reduce((sum, s) => {
      if (s.tier === "VIP") return sum + (Number(show?.vip_price) || 280);
      if (s.tier === "PREMIUM") return sum + (Number(show?.premium_price) || 180);
      return sum + (Number(show?.standard_price) || 120);
    }, 0);
  };

  const totalAmount = calcSubtotal();
  const convenienceFee = Math.round(totalAmount * 0.05); // 5% simulated fee
  const grandTotal = totalAmount + convenienceFee;

  // Handle fake / dummy digital payment submission
  const handleDummyDigitalPayment = async () => {
    setLoading(true);
    try {
      // Single atomic batch request to backend with dummy digital payment ID
      const dummyPaymentId = `DUMMY-DIGITAL-${paymentMethod}-${Date.now()}`;
      const payload = {
        show_id: showId || show?.id || 1,
        seat_ids:
          selectedSeats && selectedSeats.length > 0
            ? selectedSeats.map((s) => s.id ?? `${s.row}${s.column}`)
            : [1, 2],
        payment_id: dummyPaymentId,
      };

      const res = await axios.post("bookings/", payload);

      const bookingCode = res.data?.booking_code || "CONFIRMED";
      toast.success(
        `🎉 Fake Digital Payment Approved! Booking Confirmed: ${bookingCode}`,
        { autoClose: 3500 }
      );
      navigate("/user/my-tickets");
    } catch (err) {
      console.error("Payment error:", err);
      let errMsg = "Booking simulation failed. Please try again.";
      if (err.response?.data) {
        const d = err.response.data;
        if (typeof d === "string") {
          errMsg = d;
        } else if (d.error) {
          errMsg = d.error;
        } else if (d.message) {
          errMsg = d.message;
        } else if (d.detail) {
          errMsg = d.detail;
        } else {
          const keys = Object.keys(d);
          if (keys.length > 0) {
            const val = d[keys[0]];
            errMsg = `${keys[0]}: ${Array.isArray(val) ? val.join(", ") : val}`;
          }
        }
      } else if (err.message) {
        errMsg = err.message;
      }
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // If user explicitly cleared data or has no active session
  if (isCleared || (!selectedSeats && !initializingDummy)) {
    return (
      <div className="py-16 max-w-lg mx-auto text-center" data-aos="fade-up">
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-8 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 mx-auto flex items-center justify-center text-amber-400 mb-4">
            <FaTrashAlt size={24} />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Booking Data Cleared</h2>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            All checkout and payment session data has been reset. You can load a fresh dummy demo session or select a movie and seats.
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={loadDummyData}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs py-3 px-4 rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2"
            >
              <FaSyncAlt /> Load Fresh Dummy Demo Data
            </button>
            <button
              onClick={() => navigate("/user/movies")}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs py-3 px-4 rounded-xl border border-slate-700 transition"
            >
              Return to Movies & Shows
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (initializingDummy) {
    return (
      <div className="py-24 text-center text-slate-400">
        <FaSpinner className="animate-spin text-3xl mx-auto text-amber-400 mb-3" />
        <p className="text-sm font-medium text-slate-300">Setting up sandbox dummy checkout...</p>
      </div>
    );
  }

  return (
    <div className="py-6 max-w-4xl mx-auto" data-aos="fade-up">
      {/* Top Banner: Sandbox Notice */}
      <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-amber-500/15 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mt-0.5 shrink-0">
            <FaBolt size={14} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                Sandbox Demo Environment
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                100% Fake Payment
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Zero real cost. No Razorpay, UPI QR, card, or real bank account required. Only dummy amounts and mock authorization.
            </p>
          </div>
        </div>

        {/* Action: Clear Data */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleClearData}
            title="Clear current checkout data"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-red-500/20 border border-slate-700 hover:border-red-500/40 text-[11px] font-semibold text-slate-300 hover:text-red-300 transition cursor-pointer"
          >
            <FaTrashAlt size={10} /> Clear Data
          </button>
          <button
            onClick={handleWipeTestBookings}
            disabled={clearingBackend}
            title="Clear all saved test bookings and free seats"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-amber-500/20 border border-slate-700 hover:border-amber-500/40 text-[11px] font-semibold text-slate-300 hover:text-amber-300 transition cursor-pointer disabled:opacity-50"
          >
            <FaSyncAlt size={10} className={clearingBackend ? "animate-spin" : ""} /> Reset Seats
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-amber-400 transition"
        >
          <FaArrowLeft size={10} /> Back
        </button>

        {isDemoGenerated && (
          <span className="text-[11px] text-amber-400/90 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-lg font-medium flex items-center gap-1.5">
            <FaInfoCircle size={11} /> Auto-Loaded Dummy Session
          </span>
        )}
      </div>

      <div className="grid md:grid-cols-5 gap-8">
        {/* Left 3 cols: Order Summary */}
        <div className="md:col-span-3 bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
            <div>
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                Simulated Checkout
              </span>
              <h1 className="text-2xl font-extrabold text-white">
                {show?.movie_name || "Movie Show"}
              </h1>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400">Total Seats</span>
              <div className="text-lg font-bold text-white">{selectedSeats?.length || 0}</div>
            </div>
          </div>

          {/* Show Details Summary */}
          <div className="space-y-3 text-xs text-slate-300 mb-6 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-amber-400" />
              <span>{show?.theater_name || "Cinema Hall"}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-sky-400" />
              <span>Show Date: {show?.date || "Today"}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaClock className="text-emerald-400" />
              <span>Show Time: {show?.start_time || "18:00"} - {show?.end_time || "21:00"}</span>
            </div>
          </div>

          {/* Selected Seats Badges */}
          <div className="mb-6">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Seats ({selectedSeats?.length || 0})
            </label>
            <div className="flex flex-wrap gap-2">
              {selectedSeats?.map((s) => (
                <div
                  key={s.id}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-bold text-white flex items-center gap-1.5"
                >
                  <FaChair className="text-amber-400" size={11} />
                  <span>
                    {s.row}{s.column}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    ({s.tier || "Standard"})
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Itemized Price Breakdown (Explicitly Fake Amount) */}
          <div className="space-y-2 pt-4 border-t border-slate-800 text-xs text-slate-400">
            <div className="flex justify-between items-center">
              <span>Tickets Subtotal</span>
              <span className="text-slate-200 font-semibold flex items-center gap-1">
                <span>₹{totalAmount}</span>
                <span className="text-[10px] text-slate-500">(Dummy)</span>
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Convenience Fee (5%)</span>
              <span className="text-slate-200 font-semibold flex items-center gap-1">
                <span>₹{convenienceFee}</span>
                <span className="text-[10px] text-slate-500">(Dummy)</span>
              </span>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-800">
              <div>
                <span className="text-base font-extrabold text-white block">Grand Total</span>
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                  Zero Real Cost • Fake Simulation
                </span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-amber-400">₹{grandTotal}</span>
                <span className="text-[10px] text-slate-500 block">Fake Amount</span>
              </div>
            </div>

            <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
              <FaInfoCircle className="text-amber-400 mt-0.5 shrink-0" />
              <span>
                This transaction uses simulated digital currency. No real bank accounts, cards, or reserve accounts will be charged.
              </span>
            </div>
          </div>
        </div>

        {/* Right 2 cols: Fake Digital Payment Method & Authorization */}
        <div className="md:col-span-2 space-y-5">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-2xl">
            <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <FaWallet className="text-amber-400" /> Fake Digital Payment
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Select your simulated digital payment mode:
            </p>

            {/* Simulated Payment Modes */}
            <div className="space-y-3 mb-6">
              {[
                {
                  id: "DUMMY_DIGITAL",
                  title: "Instant Fake Digital Pay",
                  desc: "1-Click instant sandbox approval",
                  badge: "Instant",
                  icon: <FaBolt className="text-amber-400" size={16} />,
                },
                {
                  id: "DUMMY_WALLET",
                  title: "Mock Digital Wallet",
                  desc: "Virtual balance: ₹50,000 (Dummy)",
                  badge: "Virtual",
                  icon: <FaCoins className="text-emerald-400" size={16} />,
                },
                {
                  id: "DUMMY_PASS",
                  title: "Free Sandbox Demo Pass",
                  desc: "Zero-deduction test voucher",
                  badge: "Free Pass",
                  icon: <FaTicketAlt className="text-sky-400" size={16} />,
                },
              ].map((m) => (
                <div
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id)}
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                    paymentMethod === m.id
                      ? "bg-amber-500/10 border-amber-400 shadow-md shadow-amber-500/10"
                      : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center">
                      {m.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white">{m.title}</span>
                        <span className="text-[9px] bg-slate-800 text-amber-300 px-1.5 py-0.5 rounded border border-slate-700 font-semibold">
                          {m.badge}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">{m.desc}</div>
                    </div>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      paymentMethod === m.id
                        ? "border-amber-400 bg-amber-400"
                        : "border-slate-600"
                    }`}
                  >
                    {paymentMethod === m.id && (
                      <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Dummy Account Info Card */}
            <div className="mb-6 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Digital Account:</span>
                <span className="text-slate-200 font-mono font-bold">DEMO-USER-WALLET</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Mock Transaction Ref:</span>
                <span className="text-amber-400 font-mono font-bold">MOCK-PAY-{mockTxId}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Real Amount Charged:</span>
                <span className="text-emerald-400 font-bold">₹0.00 (Zero Real Cost)</span>
              </div>
            </div>

            {/* Proceed with Fake Digital Payment Button */}
            <button
              onClick={handleDummyDigitalPayment}
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer ${
                loading
                  ? "bg-amber-500/50 text-slate-950 cursor-wait"
                  : "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/15"
              }`}
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin text-lg" />
                  <span>Processing Fake Digital Payment...</span>
                </>
              ) : (
                <>
                  <FaBolt />
                  <span>Proceed with Fake Payment (₹{grandTotal})</span>
                </>
              )}
            </button>

            <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 text-center">
              <FaShieldAlt className="text-emerald-400" />
              <span>Sandbox Simulation Active • Safe & Non-Financial</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
