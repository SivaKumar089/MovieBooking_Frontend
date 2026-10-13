import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { QRCodeSVG } from "qrcode.react";
import { useSelector } from "react-redux";
import TicketScannerModal from "../../components/TicketScannerModal";
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
  FaShieldAlt,
  FaExpand,
  FaUserCheck,
  FaTimes,
  FaInfoCircle,
} from "react-icons/fa";

export default function MyTickets() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPass, setSelectedPass] = useState(null);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [targetVerifyId, setTargetVerifyId] = useState(null);

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
    if (
      !window.confirm(
        "Are you sure you want to cancel this ticket? The seat will be released immediately."
      )
    ) {
      return;
    }

    try {
      await axios.patch(`bookings/${ticketId}/cancel/`);
      toast.success("Ticket cancelled successfully! Seat has been freed.");
      fetchTickets();
    } catch (err) {
      const errMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to cancel ticket. Please try again.";
      toast.error(errMsg);
    }
  };

  const handleOpenScanner = (ticketId = null) => {
    setTargetVerifyId(ticketId);
    setScannerOpen(true);
  };

  return (
    <div className="py-4" data-aos="fade-up">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <FaTicketAlt size={11} /> Digital Passbook
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            My Movie Tickets
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Display your verified digital pass with scannable QR code at the cinema gate
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => handleOpenScanner(null)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/40 text-amber-300 text-xs font-semibold transition cursor-pointer shadow-sm"
          >
            <FaShieldAlt size={12} /> Gate Pass Scanner
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold transition cursor-pointer"
          >
            <FaPrint size={12} /> Print Passes
          </button>
        </div>
      </div>

      {/* Ticket List */}
      {loading ? (
        <div className="py-24 text-center text-slate-500">
          <p className="text-sm font-medium">Retrieving your digital passes...</p>
        </div>
      ) : tickets.length === 0 ? (
        <div className="py-20 text-center text-slate-500">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-600">
            <FaTicketAlt className="text-2xl" />
          </div>
          <p className="text-lg font-bold text-slate-300">No tickets found</p>
          <p className="text-xs text-slate-500 mb-6 max-w-sm mx-auto mt-1">
            You don't have any active bookings. Browse movies to reserve your seats.
          </p>
          <button
            onClick={() => navigate("/user/movies")}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-6 py-2.5 rounded-xl shadow-md shadow-amber-500/15 transition cursor-pointer"
          >
            Browse Movies
          </button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {tickets.map((ticket) => {
            const isCancelled = ticket.is_cancelled;
            const isUsed = ticket.is_used;
            const seat = ticket.seat || {};
            const qrPayload = JSON.stringify({
              ticket_id: ticket.id,
              booking_code: ticket.booking_code || `BK-${ticket.id}`,
            });

            return (
              <div
                key={ticket.id}
                className={`relative flex flex-col sm:flex-row rounded-2xl overflow-hidden border shadow-xl transition-all duration-300 ${
                  isCancelled
                    ? "bg-slate-950/70 border-slate-800/60 opacity-60"
                    : isUsed
                    ? "bg-slate-900/80 border-slate-800 opacity-90"
                    : "bg-slate-900/90 border-slate-800 hover:border-slate-700"
                }`}
              >
                {/* Left Stub: Details */}
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
                            : isUsed
                            ? "bg-slate-800 text-slate-400 border border-slate-700"
                            : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        }`}
                      >
                        {isCancelled ? (
                          <FaTimesCircle size={9} />
                        ) : isUsed ? (
                          <FaUserCheck size={9} />
                        ) : (
                          <FaCheckCircle size={9} />
                        )}
                        {isCancelled
                          ? "CANCELLED"
                          : isUsed
                          ? "ADMITTED / USED"
                          : "CONFIRMED"}
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-white mb-1 truncate">
                      {ticket.movie_name}
                    </h2>
                    <p className="text-xs text-slate-400 mb-4">
                      {ticket.theater_location || "Audi 1 • Dolby Atmos"}
                    </p>
                  </div>

                  {/* Datetime & Seat Spec */}
                  <div className="grid grid-cols-2 gap-2 bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                        Showtime
                      </span>
                      <span className="font-semibold text-slate-200">
                        {ticket.show_date || "Today"} • {ticket.show_start_time || "Showtime"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                        Seat Assignment
                      </span>
                      <span className="font-bold text-amber-300">
                        Row {seat.row} - Seat {seat.column}{" "}
                        <span className="text-[10px] font-normal text-slate-400">
                          ({seat.tier || "Standard"})
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Perforated Divider */}
                <div className="relative border-b sm:border-b-0 sm:border-r border-dashed border-slate-800 flex items-center justify-center">
                  <div className="hidden sm:block absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-slate-950 border border-slate-800"></div>
                  <div className="hidden sm:block absolute -bottom-3 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-slate-950 border border-slate-800"></div>
                </div>

                {/* Right Stub: Valid Scannable QR Code */}
                <div className="w-full sm:w-48 bg-slate-950/90 p-5 flex flex-col items-center justify-between text-center border-t sm:border-t-0 border-slate-800">
                  <div className="w-full">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                      Ticket Pass ID
                    </span>
                    <span className="font-mono text-xs font-bold text-amber-300 tracking-wider block mb-2.5">
                      TKT-{ticket.id}
                    </span>

                    {/* Verified Scannable QR Code */}
                    <div
                      onClick={() => setSelectedPass(ticket)}
                      className="w-24 h-24 mx-auto p-1.5 bg-white rounded-xl shadow-md flex items-center justify-center mb-2 cursor-pointer hover:scale-105 transition group"
                      title="Click to enlarge QR pass for entrance scanning"
                    >
                      <QRCodeSVG
                        value={qrPayload}
                        size={84}
                        level="M"
                        bgColor="#ffffff"
                        fgColor="#0f172a"
                      />
                    </div>

                    <button
                      onClick={() => setSelectedPass(ticket)}
                      className="text-[10px] text-slate-400 hover:text-amber-300 inline-flex items-center gap-1 transition mb-2"
                    >
                      <FaExpand size={9} /> Click to Enlarge
                    </button>

                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleOpenScanner(ticket.id)}
                        className="text-[10px] bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-700/80 px-2 py-1 rounded-md transition font-medium cursor-pointer"
                      >
                        Verify Pass
                      </button>
                    </div>
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

      {/* Full-Screen Gate Pass Modal */}
      {selectedPass && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl relative animate-fadeIn">
            <button
              onClick={() => setSelectedPass(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-lg transition"
            >
              <FaTimes size={16} />
            </button>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold uppercase tracking-wider mb-3">
              <FaShieldAlt size={10} /> Verified Cinema Admission Pass
            </div>

            <h3 className="text-xl font-extrabold text-white mb-1">
              {selectedPass.movie_name}
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              {selectedPass.theater_name} • Seat {selectedPass.seat?.row}
              {selectedPass.seat?.column}
            </p>

            {/* High-Contrast Crisp Gate QR Code */}
            <div className="p-4 bg-white rounded-2xl shadow-xl inline-block mx-auto mb-4">
              <QRCodeSVG
                value={JSON.stringify({
                  ticket_id: selectedPass.id,
                  booking_code: selectedPass.booking_code || `BK-${selectedPass.id}`,
                })}
                size={180}
                level="H"
                bgColor="#ffffff"
                fgColor="#020617"
              />
            </div>

            {/* Privacy-Preserving Verification Identity */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-left mb-4 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Ticket ID:</span>
                <span className="font-mono font-bold text-white">TKT-{selectedPass.id}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Associated ID Name:</span>
                <span className="font-bold text-amber-400">
                  {selectedPass.user_name || "Guest Ticket"}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Booking Code:</span>
                <span className="font-mono text-slate-300">
                  {selectedPass.booking_code || `BK-${selectedPass.id}0482`}
                </span>
              </div>
            </div>

            {(user?.role === "owner" || user?.role === "admin") && (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedPass(null);
                    handleOpenScanner(selectedPass.id);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-md transition cursor-pointer"
                >
                  Scan / Verify Against Database
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Integrated Ticket Scanner Modal */}
      <TicketScannerModal
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
        initialTicketId={targetVerifyId}
      />
    </div>
  );
}
