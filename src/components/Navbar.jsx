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
} from "react-icons/fa";

export default function RoleBasedLayout() {
  const access = useSelector((state) => state.auth.access);
  const [userData, setUserData] = useState(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const navigate =useNavigate('')

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
      {
        name: "Dashboard",
        path: "/user/dashboard",
        icon: <FaHome size={16} />,
      },
      {
        name: "Theaters",
        path: "/user/theaters",
        icon: <FaTheaterMasks size={16} />,
      },
      { name: "Movies", path: "/user/movies", icon: <FaFilm size={16} /> },
      { name: "Shows", path: "/user/shows", icon: <FaCalendarAlt size={16} /> },
      {
        name: "My Tickets",
        path: "/user/my-tickets",
        icon: <FaTicketAlt size={16} />,
      },
    ],
    owner: [
      {
        name: "Dashboard",
        path: "/owner/dashboard",
        icon: <FaHome size={16} />,
      },
      {
        name: "Theaters",
        path: "/owner/theaters",
        icon: <FaTheaterMasks size={16} />,
      },
      { name: "Movies", path: "/owner/movies", icon: <FaFilm size={16} /> },
      {
        name: "Shows",
        path: "/owner/shows",
        icon: <FaCalendarAlt size={16} />,
      },
    ],
    admin: [
      {
        name: "Admin Panel",
        path: "/admin/adminpanel",
        icon: <FaHome size={16} />,
      },
      { name: "Users", path: "/admin/users", icon: <FaUsers size={16} /> },
      { name: "Owners", path: "/admin/owners", icon: <FaUsers size={16} /> },
      { name: "Reports", path: "/reports", icon: <FaChartBar size={16} /> },
    ],
  };

  const links = role ? navLinks[role] : [];

  return (
    <div className="min-h-screen bg-gray-100 ">
      <header className="bg-gray-900 text-white sticky top-0 z-40 flex items-center justify-between px-4 py-3 sm:px-8 shadow-md">
        <button
          className="sm:hidden"
          onClick={() => setIsMobileSidebarOpen(true)}
        >
          <FaBars size={20} />
        </button>

        <NavLink
          to="/"
          className="flex items-center gap-1 p-2 md:p-3 rounded-md  transition duration-300"
        >
          <img
            src="/website_icon.png"
            alt="BookIt Logo"
            className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
          />
          <span className="text-lg sm:text-xl font-bold text-white">
            BookIt
          </span>
        </NavLink>

        <nav className="hidden sm:flex shadow-sm  px-8 py-2 gap-6 text-sm">
          {links.map((link, index) => (
            <NavLink
              key={index}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-1 transition ${
                  isActive
                    ? "text-blue-500 font-semibold"
                    : "hover:text-yellow-500"
                }`
              }
            >
              {link.icon}
              {link.name}
            </NavLink>
          ))}
          <NavLink
            to="/auth/logout"
            className={({ isActive }) =>
              `flex items-center gap-1 transition ${
                isActive ? "text-blue-500" : "text-red-500 hover:text-red-400"
              }`
            }
          >
            <FaSignOutAlt size={16} />
            Logout
          </NavLink>
        </nav>
        {username && (
          <div
            onClick={() => navigate("/auth/profile")}
            className="text-sm font-medium text-gray-300 cursor-pointer hover:text-white transition"
          >
            {username}
          </div>
        )}
      </header>

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white z-50 transform transition-transform duration-300 ease-in-out sm:hidden ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button onClick={() => setIsMobileSidebarOpen(false)}>
            <FaTimes size={20} />
          </button>
        </div>

        <nav className="flex flex-col p-4 gap-4 text-sm">
          {links.map((link, index) => (
            <NavLink
              key={index}
              to={link.path}
              onClick={() => setIsMobileSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 transition ${
                  isActive
                    ? "text-blue-400 font-semibold"
                    : "hover:text-yellow-400"
                }`
              }
            >
              {link.icon}
              {link.name}
            </NavLink>
          ))}
          <NavLink
            to="/auth/logout"
            onClick={() => setIsMobileSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-2 mt-6 transition ${
                isActive ? "text-blue-400" : "text-red-400 hover:text-red-300"
              }`
            }
          >
            <FaSignOutAlt size={16} />
            Logout
          </NavLink>
        </nav>
      </div>

      <main className="p-4 sm:px-8">
        <Outlet />
      </main>
    </div>
  );
}
