import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaFilm,
  FaTheaterMasks,
  FaTicketAlt,
  FaUsers,
  FaUserShield,
  FaBars,
  FaTimes,
  FaExternalLinkAlt,
  FaTv,
} from "react-icons/fa";

import AdminMovies from "./AdminMovies";
import AdminTheaters from "./AdminTheaters";
import AdminBookings from "./AdminBookings";
import AdminUsers from "./AdminUsers";
import AdminOwners from "./AdminOwners";
import AdminShows from "./AdminShows";

export default function AdminDashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeComponent, setActiveComponent] = useState("Theaters");

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const navItems = [
    {
      label: "Theaters",
      icon: <FaTheaterMasks size={18} />,
      component: <AdminTheaters />,
      description: "Manage registered cinema halls",
    },
    {
      label: "Movies",
      icon: <FaFilm size={18} />,
      component: <AdminMovies />,
      description: "Inspect movie catalog & ratings",
    },
    {
      label: "Shows",
      icon: <FaTv size={18} />,
      component: <AdminShows />,
      description: "Showtime schedules & occupancy",
    },
    {
      label: "Bookings",
      icon: <FaTicketAlt size={18} />,
      component: <AdminBookings />,
      description: "System-wide admission tickets",
    },
    {
      label: "Owners",
      icon: <FaUserShield size={18} />,
      component: <AdminOwners />,
      description: "Theater partners & operators",
    },
    {
      label: "Users",
      icon: <FaUsers size={18} />,
      component: <AdminUsers />,
      description: "Registered moviegoers & accounts",
    },
  ];

  const activeItem = navItems.find((item) => item.label === activeComponent) || navItems[0];

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-black">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed z-40 inset-y-0 left-0 transform bg-slate-900/95 border-r border-slate-800/80 w-72 p-5 flex flex-col justify-between shadow-2xl backdrop-blur-xl transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-black font-black text-sm shadow-lg shadow-amber-500/20">
                  SL
                </div>
                <div>
                  <h2 className="text-base font-black tracking-wider text-white">
                    SEAT<span className="text-amber-400">LOCK</span>
                  </h2>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500 block">
                    Admin Console
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={toggleSidebar}
              className="text-slate-400 hover:text-white md:hidden p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <FaTimes size={18} />
            </button>
          </div>

          {/* System Status Pill */}
          <div className="flex items-center justify-between px-3 py-2 bg-slate-950/80 rounded-xl border border-slate-800/80 text-xs">
            <span className="text-slate-400">System Status</span>
            <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              ONLINE
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 px-3 pb-1">
              Platform Controls
            </p>
            {navItems.map(({ label, icon, description }) => {
              const isActive = activeComponent === label;
              return (
                <button
                  key={label}
                  onClick={() => {
                    setActiveComponent(label);
                    setSidebarOpen(false);
                  }}
                  className={`w-full text-left flex items-center gap-3 px-3.5 py-3 rounded-xl cursor-pointer transition-all duration-200 group ${
                    isActive
                      ? "bg-gradient-to-r from-amber-500/20 to-amber-500/5 text-amber-300 border border-amber-500/30 shadow-lg shadow-amber-500/5 font-semibold"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  <span
                    className={`transition-colors ${
                      isActive ? "text-amber-400" : "text-slate-500 group-hover:text-amber-400"
                    }`}
                  >
                    {icon}
                  </span>
                  <div className="flex-1">
                    <span className="text-sm block leading-tight">{label}</span>
                    <span className="text-[10px] text-slate-500 block font-normal leading-none mt-0.5">
                      {description}
                    </span>
                  </div>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <Link
            to="/"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-400 hover:text-white hover:border-slate-700 transition"
          >
            <span>Public Cinema View</span>
            <FaExternalLinkAlt size={11} className="text-slate-500" />
          </Link>
          <div className="text-[11px] text-slate-500 text-center py-1">
            SeatLock Master v2.4 • VIP Suite
          </div>
        </div>
      </aside>

      {/* Main Section */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-20 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 px-4 md:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white md:hidden cursor-pointer border border-slate-700/60"
            >
              <FaBars size={18} />
            </button>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                <span className="text-amber-400">{activeItem.icon}</span>
                {activeItem.label}
              </h1>
              <p className="text-xs text-slate-400 hidden sm:block">
                {activeItem.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
              <FaUserShield size={12} /> Root SuperAdmin
            </span>
          </div>
        </header>

        {/* Dynamic Body */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {activeItem.component}
          </div>
        </main>
      </div>
    </div>
  );
}
