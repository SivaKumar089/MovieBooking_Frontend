import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../../utils/axios";
import { useSelector } from "react-redux";
import {
  FaExclamationTriangle,
  FaArrowLeft,
  FaTrashAlt,
  FaSpinner,
  FaTicketAlt,
  FaShieldAlt,
} from "react-icons/fa";

export default function CancelTicket() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.access);
  const [cancelling, setCancelling] = useState(false);

  const { ticketId, movieName, theaterName, seatInfo, price } = location.state || {};
  const ticketPrice = Number(price || 140);
  const cancelFee = Math.round(ticketPrice * 0.2); // 20% cancellation deduction
  const refundAmount = ticketPrice - cancelFee;

  if (!ticketId) {
    return (
      <div className="py-20 text-center text-slate-400">
        <p className="mb-4">No ticket selected for cancellation.</p>
        <button
          onClick={() => navigate("/user/my-tickets")}
          className="bg-amber-500 text-black font-bold px-6 py-2.5 rounded-xl text-sm"
        >
          View My Tickets
        </button>
      </div>
    );
  }

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await axios.patch(`bookings/${ticketId}/cancel/`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Ticket successfully cancelled. Seat has been released!");
      navigate("/user/my-tickets");
    } catch (err) {
      toast.error(err.response?.data?.error || "Cancellation request failed.");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-8" data-aos="fade-up">
      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-amber-400 transition mb-6"
        >
          <FaArrowLeft size={10} /> Back to Tickets
        </button>

        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-4">
            <FaExclamationTriangle size={24} />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            Cancel Cinema Reservation?
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            This action will release your seat back to the live public inventory immediately.
          </p>
        </div>

        {/* Ticket Details Summary */}
        <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl space-y-2 text-xs mb-6">
          <div className="flex justify-between text-slate-400">
            <span>Movie:</span>
            <span className="text-white font-bold">{movieName || "Movie Ticket"}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Seat:</span>
            <span className="text-amber-400 font-bold">{seatInfo || "Reserved Seat"}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Original Ticket:</span>
            <span className="text-white font-semibold">₹{ticketPrice}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Cinema Cancellation Fee (20%):</span>
            <span className="text-red-400 font-semibold">- ₹{cancelFee}</span>
          </div>
          <div className="flex justify-between text-sm font-extrabold text-white pt-2 border-t border-slate-800">
            <span>Net Refundable Amount:</span>
            <span className="text-emerald-400">₹{refundAmount}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            disabled={cancelling}
            className="w-full sm:w-1/2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition cursor-pointer"
          >
            Keep Ticket
          </button>
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="w-full sm:w-1/2 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition shadow-lg shadow-red-600/20 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {cancelling ? (
              <>
                <FaSpinner className="animate-spin text-sm" />
                <span>Releasing Seat...</span>
              </>
            ) : (
              <>
                <FaTrashAlt size={11} />
                <span>Confirm Cancel</span>
              </>
            )}
          </button>
        </div>

        <div className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-slate-600 text-center">
          <FaShieldAlt className="text-emerald-500" />
          <span>Automated Refund Policy</span>
        </div>
      </div>
    </div>
  );
}
