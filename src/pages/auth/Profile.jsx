import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import {
  FaUserCircle,
  FaEnvelope,
  FaUserTag,
  FaTicketAlt,
  FaShieldAlt,
  FaCrown,
  FaSignOutAlt,
  FaFilm,
  FaCalendarCheck,
  FaArrowLeft,
  FaLock,
} from "react-icons/fa";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("profile/")
      .then((res) => {
        setProfile(res.data);
      })
      .catch((err) => {
        toast.error("Error loading cinema profile");
      })
      .finally(() => setLoading(false));
  }, []);

  const getInitials = (name) => {
    if (!name) return "SL";
    return name.slice(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-2 border-amber-500/20 border-t-amber-400 animate-spin"></div>
          <span className="text-sm font-medium">Accessing VIP Passbook...</span>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-300 p-4">
        <p className="mb-4">Unable to retrieve cinema credentials.</p>
        <button
          onClick={() => navigate("/auth/login")}
          className="bg-amber-500 text-black font-bold px-6 py-2.5 rounded-xl text-sm"
        >
          Sign In
        </button>
      </div>
    );
  }

  const isOwner = profile.role === "owner";
  const isAdmin = profile.role === "admin";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Ambient Radial Spotlight */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-b from-amber-500/15 via-sky-500/10 to-transparent blur-3xl pointer-events-none rounded-full"></div>

      <div
        data-aos="fade-up"
        className="w-full max-w-lg bg-slate-900/85 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative z-10"
      >
        {/* Navigation Bar */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-amber-400 transition"
          >
            <FaArrowLeft size={10} /> Back
          </button>

          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20 flex items-center gap-1">
            <FaCrown size={11} /> VIP Passbook
          </span>
        </div>

        {/* Holographic VIP Member Card */}
        <div className="relative rounded-2xl overflow-hidden p-6 mb-6 bg-gradient-to-br from-amber-600/30 via-slate-900 to-slate-950 border border-amber-500/30 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-black flex items-center justify-center font-black text-sm shadow-md shadow-amber-500/30">
                <FaLock />
              </div>
              <span className="font-extrabold text-base tracking-tight text-white">
                Seat<span className="text-amber-400">Lock</span> Cinema
              </span>
            </div>
            <span className="text-[11px] font-mono font-bold text-amber-300 tracking-wider">
              {isAdmin ? "TIER: SUPERADMIN" : isOwner ? "TIER: CINEMA OPERATOR" : "TIER: GOLD PASS"}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-xl font-black text-black shadow-lg shadow-amber-500/20 border-2 border-amber-300/40">
              {getInitials(profile.username)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  {profile.username}
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500 text-black">
                  {profile.role}
                </span>
              </div>
              <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5 font-mono">
                <FaEnvelope size={10} className="text-slate-400" />
                {profile.email}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Membership: Active</span>
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <FaShieldAlt size={10} /> Verified Pass
            </span>
          </div>
        </div>

        {/* Quick Actions List */}
        <div className="space-y-2 mb-6">
          <Link
            to="/user/my-tickets"
            className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-amber-500/30 transition duration-200 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <FaTicketAlt size={14} />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-amber-400 transition">
                  My Booked Cinema Tickets
                </div>
                <div className="text-[11px] text-slate-400">
                  View upcoming shows, seats & QR barcodes
                </div>
              </div>
            </div>
            <span className="text-xs text-slate-500 group-hover:text-amber-400 transition">→</span>
          </Link>

          <Link
            to="/user/movies"
            className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-amber-500/30 transition duration-200 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
                <FaFilm size={14} />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-sky-400 transition">
                  Now Showing Catalog
                </div>
                <div className="text-[11px] text-slate-400">
                  Explore current movie releases and showtimes
                </div>
              </div>
            </div>
            <span className="text-xs text-slate-500 group-hover:text-sky-400 transition">→</span>
          </Link>

          {isOwner && (
            <Link
              to="/owner/theaters"
              className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/70 border border-amber-500/30 hover:border-amber-400 transition duration-200 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                  <FaCalendarCheck size={14} />
                </div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-amber-400 transition">
                    Owner Dashboard & Venues
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Manage screens, auditoriums & schedules
                  </div>
                </div>
              </div>
              <span className="text-xs text-slate-500 group-hover:text-amber-400 transition">→</span>
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/admin/adminpanel"
              className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/70 border border-red-500/30 hover:border-red-400 transition duration-200 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center">
                  <FaShieldAlt size={14} />
                </div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-red-400 transition">
                    SuperAdmin Control Panel
                  </div>
                  <div className="text-[11px] text-slate-400">
                    System-wide auditorium, booking and user audits
                  </div>
                </div>
              </div>
              <span className="text-xs text-slate-500 group-hover:text-red-400 transition">→</span>
            </Link>
          )}
        </div>

        {/* Sign Out Button */}
        <Link
          to="/auth/logout"
          className="w-full py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold transition duration-200 flex items-center justify-center gap-2"
        >
          <FaSignOutAlt /> Sign Out from SeatLock
        </Link>
      </div>
    </div>
  );
}
