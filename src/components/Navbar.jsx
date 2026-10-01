import React, { useEffect, useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "../utils/axios";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaTheaterMasks,
  FaFilm,
  FaCalendarAlt,
  FaTicketAlt,
  FaUsers,
  FaChartBar,
  FaSignOutAlt,
  FaLock,
} from "react-icons/fa";

export default function RoleBasedLayout() {
  const access = useSelector((state) => state.auth.access);
  const [userData, setUserData] = useState(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (access) {
      axios
        .get("profile/", {
          headers: { Authorization: `Bearer ${access}` },
        })
        .then((res) => setUserData(res.data))
        .catch((err) => console.error("Profile fetch error:", err));
    }
  }, [access]);

  const role = userData?.role;
  const username = userData?.username;

  const navLinks = {
    user: [
      { name: "Dashboard", path: "/user/dashboard", icon: <FaHome size={15} /> },
      { name: "Theaters", path: "/user/theaters", icon: <FaTheaterMasks size={15} /> },
      { name: "Movies", path: "/user/movies", icon: <FaFilm size={15} /> },
      { name: "Shows", path: "/user/shows", icon: <FaCalendarAlt size={15} /> },
      { name: "My Tickets", path: "/user/my-tickets", icon: <FaTicketAlt size={15} /> },
    ],
    owner: [
      { name: "Dashboard", path: "/owner/dashboard", icon: <FaHome size={15} /> },
      { name: "Theaters", path: "/owner/theaters", icon: <FaTheaterMasks size={15} /> },
      { name: "Movies", path: "/owner/movies", icon: <FaFilm size={15} /> },
      { name: "Shows", path: "/owner/shows", icon: <FaCalendarAlt size={15} /> },
      { name: "Bookings", path: "/owner/bookings", icon: <FaTicketAlt size={15} /> },
    ],
    admin: [
      { name: "Admin Panel", path: "/admin/adminpanel", icon: <FaHome size={15} /> },
      { name: "Movies", path: "/admin/movies", icon: <FaFilm size={15} /> },
      { name: "Theaters", path: "/admin/theaters", icon: <FaTheaterMasks size={15} /> },
      { name: "Bookings", path: "/admin/bookings", icon: <FaTicketAlt size={15} /> },
      { name: "Users", path: "/admin/users", icon: <FaUsers size={15} /> },
      { name: "Owners", path: "/admin/owners", icon: <FaUsers size={15} /> },
    ],
  };

  const links = role ? navLinks[role] : [];

  const getInitials = (name) => {
    if (!name) return "U";
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Sleek Cinema Header */}
      <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 px-4 sm:px-8 py-3.5 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              className="sm:hidden text-slate-400 hover:text-white p-1.5 focus:outline-none"
              onClick={() => setIsMobileSidebarOpen(true)}
            >
              <FaBars size={20} />
            </button>

            <NavLink
              to="/"
              className="flex items-center gap-2 group transition duration-300"
            >
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition">
                <FaLock className="text-white text-base" />
              </div>
              <span className="text-xl font-black tracking-tight text-white flex items-center gap-0.5">
                Seat<span className="text-amber-400">Lock</span>
                <span className="ml-2 text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 hidden md:inline">
                  Cinema
                </span>
              </span>
            </NavLink>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden sm:flex items-center gap-2 text-sm font-medium">
            {links.map((link, index) => (
              <NavLink
                key={index}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all duration-200 ${
                    isActive
                      ? "bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-sm shadow-amber-500/10"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                  }`
                }
              >
                {link.icon}
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Right Action / Profile */}
          <div className="flex items-center gap-3">
            {username ? (
              <div className="flex items-center gap-3">
                <div
                  onClick={() => navigate("/auth/profile")}
                  className="flex items-center gap-2 py-1 px-2.5 rounded-full bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 cursor-pointer transition"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                    {getInitials(username)}
                  </div>
                  <span className="text-xs font-semibold text-slate-200 max-w-[100px] truncate hidden md:inline">
                    {username}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-700 text-slate-300 font-medium capitalize">
                    {role}
                  </span>
                </div>

                <NavLink
                  to="/auth/logout"
                  className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition"
                  title="Logout"
                >
                  <FaSignOutAlt size={16} />
                </NavLink>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <NavLink
                  to="/auth/login"
                  className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-lg transition"
                >
                  Sign In
                </NavLink>
                <NavLink
                  to="/auth/signup"
                  className="text-xs font-semibold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black px-3.5 py-1.5 rounded-lg shadow-md shadow-amber-500/20 font-bold transition"
                >
                  Get Started
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 sm:hidden transition-opacity"
          onClick={() => setIsMobileSidebarOpen(false)}
        >
          <div
            className="fixed top-0 left-0 h-full w-72 bg-slate-900 border-r border-slate-800 p-5 flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center">
                    <FaLock className="text-white text-sm" />
                  </div>
                  <span className="font-bold text-lg text-white">SeatLock</span>
                </div>
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <FaTimes size={18} />
                </button>
              </div>

              <nav className="flex flex-col gap-1.5 mt-5">
                {links.map((link, index) => (
                  <NavLink
                    key={index}
                    to={link.path}
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                        isActive
                          ? "bg-amber-500/15 text-amber-400 border border-amber-500/20"
                          : "text-slate-300 hover:text-white hover:bg-slate-800"
                      }`
                    }
                  >
                    {link.icon}
                    {link.name}
                  </NavLink>
                ))}
              </nav>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <NavLink
                to="/auth/logout"
                onClick={() => setIsMobileSidebarOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition"
              >
                <FaSignOutAlt size={16} />
                Sign Out
              </NavLink>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:px-8 py-6">
        <Outlet />
      </main>
    </div>
  );
}
