import React, { useState } from "react";
import {
  FaFilm,
  FaTheaterMasks,
  FaTicketAlt,
  FaUsers,
  FaUserShield,
  FaBars,
  FaTimes,
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
      icon: <FaTheaterMasks size={16} />,
      component: <AdminTheaters />,
    },
    { label: "Movies", icon: <FaFilm size={16} />, component: <AdminMovies /> },
    {
      label: "Shows",
      icon: <FaUserShield size={16} />,
      component: <AdminShows />,
    },
    {
      label: "Bookings",
      icon: <FaTicketAlt size={16} />,
      component: <AdminBookings />,
    },
    {
      label: "Owners",
      icon: <FaUserShield size={16} />,
      component: <AdminOwners />,
    },
    {
      label: "Users",
      icon: <FaUsers size={16} />,
      component: <AdminUsers />,
    },
  ];

  const currentComponent =
    navItems.find((item) => item.label === activeComponent)?.component || null;

  return (
    <div className="min-h-screen flex bg-gray-100">
      <div
        className={`fixed z-20 inset-y-0 left-0 transform bg-white w-64 border-r shadow-lg p-4 space-y-4 transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:block ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between md:hidden mb-4">
          <h2 className="text-xl font-bold text-purple-700">Admin Panel</h2>
          <FaTimes
            className="text-gray-600 text-xl cursor-pointer"
            onClick={toggleSidebar}
          />
        </div>

        <nav className="space-y-2">
          {navItems.map(({ label, icon }) => (
            <button
              key={label}
              onClick={() => {
                setActiveComponent(label);
                setSidebarOpen(false);
              }}
              className={`w-full text-left flex items-center gap-2 px-3 py-2 cursor-pointer rounded-md font-medium transition-all duration-200 ${
                activeComponent === label
                  ? "bg-purple-100 text-purple-700"
                  : "text-gray-700 hover:bg-gray-100 hover:text-purple-600"
              }`}
            >
              {icon} <span className="text-sm">{label}</span>
            </button>
          ))}
        </nav>
      </div>
      <button
        className="absolute top-4 left-4 z-30 text-gray-700 md:hidden cursor-pointer"
        onClick={toggleSidebar}
      >
        <FaBars size={20} />
      </button>

      <main className="flex-1 p-4 md:p-6 ml-0  transition-all duration-300 bg-gray-50">
        <div className="bg-white rounded-xl shadow p-4 md:p-6">
          {currentComponent}
        </div>
      </main>
    </div>
  ); 
}
