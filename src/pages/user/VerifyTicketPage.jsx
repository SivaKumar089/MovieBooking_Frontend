import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import TicketScannerModal from "../../components/TicketScannerModal";
import { FaShieldAlt, FaQrcode, FaCheckCircle, FaUserCheck, FaLock } from "react-icons/fa";

export default function VerifyTicketPage() {
  const [modalOpen, setModalOpen] = useState(true);
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.access);
  const navigate = useNavigate();

  // Enforce access control on the scanner page: Owners and Admins only
  useEffect(() => {
    if (!token) {
      toast.error("Authentication required: Please sign in as an owner or administrator.");
      navigate("/auth/login", { replace: true });
      return;
    }
    if (user && user.role !== "owner" && user.role !== "admin") {
      toast.error("Access Denied: Ticket verification terminal is restricted to cinema owners and administrators.");
      navigate("/user/movies", { replace: true });
    }
  }, [user, token, navigate]);

  if (!token || (user && user.role !== "owner" && user.role !== "admin")) {
    return (
      <div className="py-20 text-center text-slate-400">
        <FaShieldAlt className="text-4xl text-rose-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-white mb-2">Restricted Terminal Access</h2>
        <p className="text-sm">Redirecting to cinema catalog...</p>
      </div>
    );
  }

  return (
    <div className="py-8 max-w-3xl mx-auto" data-aos="fade-up">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4">
          <FaShieldAlt size={28} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
          Gate Ticket Verification Terminal
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto mb-8">
          Authorized entrance admission verification. Validates cinema tickets against the live database,
          checks against cancellations, expirations, and duplicate entries, and displays only the Ticket ID and ID Name.
        </p>

        <div className="grid sm:grid-cols-3 gap-4 mb-8 text-left">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
            <div className="text-amber-400 font-bold text-xs uppercase mb-1 flex items-center gap-1.5">
              <FaLock size={11} /> Privacy-First
            </div>
            <p className="text-[11px] text-slate-400">
              Only Ticket ID and verified ID name are displayed. No personal data leaks.
            </p>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
            <div className="text-emerald-400 font-bold text-xs uppercase mb-1 flex items-center gap-1.5">
              <FaCheckCircle size={11} /> Real-Time Check
            </div>
            <p className="text-[11px] text-slate-400">
              Instant atomic check against cancellations, expirations, and prior use.
            </p>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
            <div className="text-sky-400 font-bold text-xs uppercase mb-1 flex items-center gap-1.5">
              <FaUserCheck size={11} /> Admission Lock
            </div>
            <p className="text-[11px] text-slate-400">
              One-click gate admission lock permanently marks ticket used in database.
            </p>
          </div>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-8 py-3.5 rounded-xl shadow-md shadow-amber-500/15 text-sm transition cursor-pointer inline-flex items-center gap-2"
        >
          <FaQrcode /> Launch Ticket Scanner
        </button>
      </div>

      <TicketScannerModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
