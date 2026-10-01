import React, { useState } from "react";
import {
  FaTheaterMasks,
  FaFilm,
  FaCalendarAlt,
  FaTicketAlt,
  FaPlus,
  FaBars,
  FaTimes,
  FaLock,
  FaHome,
  FaShieldAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";

import { AddTheater } from "./AddTheater";
import { AddMovie } from "./AddMovie";
import { AddShow } from "./AddShow";
import { OwnerBookings } from "./OwnerBookings";
import { OwnerTheaters } from "./OwnerTheaters";
import { OwnerMovies } from "./OwnerMovies";
import { OwnerShows } from "./OwnerShows";

export default function OwnerDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeComponent, setActiveComponent] = useState("My Theaters");

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const navItems = [
    { label: "My Theaters", icon: <FaTheaterMasks />, component: <OwnerTheaters /> },
    { label: "My Movies", icon: <FaFilm />, component: <OwnerMovies /> },
    { label: "My Shows", icon: <FaCalendarAlt />, component: <OwnerShows /> },
    { label: "Register Venue", icon: <FaPlus />, component: <AddTheater /> },
    { label: "Add Movie", icon: <FaPlus />, component: <AddMovie /> },
    { label: "Schedule Show", icon: <FaPlus />, component: <AddShow /> },
    { label: "Audience Bookings", icon: <FaTicketAlt />, component: <OwnerBookings /> },
  ];

  const currentComponent =
    navItems.find((item) => item.label === activeComponent)?.component || null;

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-20 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-30 h-screen bg-slate-900/95 border-r border-slate-800 w-64 p-5 space-y-6 transition-transform duration-300 ease-in-out backdrop-blur-xl ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 flex flex-col justify-between`}
      >
        <div>
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-105 transition">
                <FaLock className="text-white text-sm" />
              </div>
              <span className="font-extrabold text-lg text-white">
                Seat<span className="text-amber-400">Lock</span>
              </span>
            </Link>
            <button className="md:hidden text-slate-400 p-1" onClick={toggleSidebar}>
              <FaTimes size={18} />
            </button>
          </div>

          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3 px-3">
            Operator Console
          </div>

          <nav className="flex flex-col gap-1.5">
            {navItems.map(({ label, icon }) => (
              <button
                key={label}
                onClick={() => {
                  setActiveComponent(label);
                  setSidebarOpen(false);
                }}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl cursor-pointer text-xs sm:text-sm font-semibold transition w-full text-left ${
                  activeComponent === label
                    ? "bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-sm shadow-amber-500/10"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <span className="text-sm">{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-8 pt-6 border-t border-slate-800/80 px-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 px-2">
              Audience View
            </div>
            <Link
              to="/user/movies"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800/40 transition"
            >
              <FaFilm size={12} /> Live Audience Catalog
            </Link>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 text-center flex items-center justify-center gap-1.5">
          <FaShieldAlt className="text-amber-500/80" />
          <span>Operator Command Terminal</span>
        </div>
      </aside>

      {/* Mobile Toggle Button */}
      <button
        className="fixed top-4 left-4 z-40 bg-slate-900 border border-slate-800 text-slate-300 p-2.5 rounded-xl shadow-lg md:hidden cursor-pointer"
        onClick={toggleSidebar}
      >
        <FaBars size={18} />
      </button>

      {/* Main Content Pane */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 w-full overflow-y-auto min-w-0">
        <div className="max-w-6xl mx-auto">{currentComponent}</div>
      </main>
    </div>
  );
}
