import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
  FaCreditCard,
  FaMoneyBillWave,
  FaChair,
  FaArrowLeft,
  FaCheckCircle,
  FaSpinner,
  FaShieldAlt,
  FaQrcode,
  FaMobileAlt,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { showId, selectedSeats, totalAmount, count, show: stateShow } =
    location.state || {};
  const token = useSelector((state) => state.auth.access);

  const [show, setShow] = useState(stateShow || null);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("RAZORPAY");

  useEffect(() => {
    if (!show && showId) {
      axios.get(`shows/${showId}/`).then((res) => setShow(res.data));
    }
  }, [showId, show]);

  if (!showId || !selectedSeats) {
    return (
      <div className="py-20 text-center text-slate-400">
        <p className="mb-4">No active booking session found.</p>
        <button
          onClick={() => navigate("/user/movies")}
          className="bg-amber-500 text-black font-bold px-6 py-2 rounded-xl"
        >
          Return to Movies
        </button>
      </div>
    );
  }

  const convenienceFee = Math.round(totalAmount * 0.05); // 5% fee
  const grandTotal = totalAmount + convenienceFee;

  const handleAtomicPayment = async () => {
    setLoading(true);
    try {
      // Single atomic batch request to backend
      const res = await axios.post(
        "bookings/",
        {
          show_id: showId,
          seat_ids: selectedSeats.map((s) => s.id),
          payment_id: `PAY-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const bookingCode = res.data.booking_code || "CONFIRMED";
      toast.success(`Booking Confirmed! Code: ${bookingCode}`);
      navigate("/user/my-tickets");
    } catch (err) {
      const errMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Booking failed. Please try again.";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-6 max-w-4xl mx-auto" data-aos="fade-up">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-amber-400 transition mb-6"
      >
        <FaArrowLeft size={10} /> Back to Seat Selection
      </button>

      <div className="grid md:grid-cols-5 gap-8">
        {/* Left 3 cols: Order Summary */}
        <div className="md:col-span-3 bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
            <div>
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                Booking Checkout
              </span>
              <h1 className="text-2xl font-extrabold text-white">
                {show?.movie_name || "Movie Show"}
              </h1>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400">Total Seats</span>
              <div className="text-lg font-bold text-white">{count}</div>
            </div>
          </div>

          {/* Show Details Summary */}
          <div className="space-y-3 text-xs text-slate-300 mb-6 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-amber-400" />
              <span>{show?.theater_name}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-sky-400" />
              <span>Show Date: {show?.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaClock className="text-emerald-400" />
              <span>Show Time: {show?.start_time} - {show?.end_time}</span>
            </div>
          </div>

          {/* Selected Seats Badges */}
          <div className="mb-6">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Reserved Seats ({selectedSeats.length})
            </label>
            <div className="flex flex-wrap gap-2">
              {selectedSeats.map((s) => (
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

          {/* Itemized Price Breakdown */}
          <div className="space-y-2 pt-4 border-t border-slate-800 text-xs text-slate-400">
            <div className="flex justify-between">
              <span>Tickets Subtotal</span>
              <span className="text-slate-200 font-semibold">₹{totalAmount}</span>
            </div>
            <div className="flex justify-between">
              <span>Convenience Fee & GST (5%)</span>
              <span className="text-slate-200 font-semibold">₹{convenienceFee}</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-white pt-3 border-t border-slate-800">
              <span>Grand Total</span>
              <span className="text-amber-400">₹{grandTotal}</span>
            </div>
          </div>
        </div>

        {/* Right 2 cols: Payment Method & Authorization */}
        <div className="md:col-span-2 space-y-5">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-2xl">
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <FaCreditCard className="text-amber-400" /> Payment Options
            </h2>

            <div className="space-y-3 mb-6">
              {[
                {
                  id: "RAZORPAY",
                  title: "Razorpay Gateway",
                  desc: "UPI, Cards, NetBanking",
                  icon: <FaShieldAlt className="text-sky-400" size={18} />,
                },
                {
                  id: "UPI",
                  title: "Instant UPI QR",
                  desc: "GPay, PhonePe, Paytm",
                  icon: <FaQrcode className="text-emerald-400" size={18} />,
                },
                {
                  id: "CARD",
                  title: "Credit / Debit Card",
                  desc: "Visa, Mastercard, RuPay",
                  icon: <FaCreditCard className="text-amber-400" size={18} />,
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
                    {m.icon}
                    <div>
                      <div className="text-xs font-bold text-white">{m.title}</div>
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

            {/* Atomic Pay Now Button */}
            <button
              onClick={handleAtomicPayment}
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-sm shadow-xl transition flex items-center justify-center gap-2 cursor-pointer ${
                loading
                  ? "bg-amber-500/50 text-black cursor-wait"
                  : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-amber-500/20"
              }`}
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin text-lg" />
                  <span>Locking Seats & Processing...</span>
                </>
              ) : (
                <>
                  <FaCheckCircle />
                  <span>Authorize & Pay ₹{grandTotal}</span>
                </>
              )}
            </button>

            <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-500 text-center">
              <FaShieldAlt className="text-emerald-500" />
              <span>256-bit Encrypted • Atomic Concurrency Locked</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
