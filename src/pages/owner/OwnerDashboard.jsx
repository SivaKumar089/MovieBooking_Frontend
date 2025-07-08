import React, { useState } from "react";
import {
  FaTheaterMasks,
  FaFilm,
  FaCalendarAlt,
  FaPlus,
  FaTicketAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

import { OwnerTheaters } from "./OwnerTheaters";
import { AddTheater } from "./AddTheater";
import { OwnerMovies } from "./OwnerMovies";
import { AddMovie } from "./AddMovie";
import { OwnerShows } from "./OwnerShows";
import { AddShow } from "./AddShow";
import { OwnerBookings } from "./OwnerBookings";

export default function OwnerDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeComponent, setActiveComponent] = useState("Add Theater");

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const navItems = [
    { label: "Add Theater", icon: <FaPlus />, component: <AddTheater /> },
    { label: "Add Movie", icon: <FaPlus />, component: <AddMovie /> },
    { label: "Add Show", icon: <FaPlus />, component: <AddShow /> },
    { label: "Bookings", icon: <FaTicketAlt />, component: <OwnerBookings /> },
  ];

  const currentComponent =
    navItems.find((item) => item.label === activeComponent)?.component || null;

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div
        className={`sticky top-0 h-screen z-20 bg-white w-64 border-r shadow-md p-5 space-y-6 transition-transform duration-300 ease-in-out md:translate-x-0 md:block ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between mb-4 md:hidden">
          <h2 className="text-xl font-bold text-blue-700">Owner Panel</h2>
          <FaTimes
            className="text-gray-600 text-2xl cursor-pointer"
            onClick={toggleSidebar}
          />
        </div>

        {/* Nav Links */}
        <nav className="space-y-2">
          {navItems.map(({ label, icon }) => (
            <button
              key={label}
              onClick={() => {
                setActiveComponent(label);
                setSidebarOpen(false);
              }}
              className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-md font-medium transition ${
                activeComponent === label
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
              }`}
            >
              {icon} {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Mobile Toggle Button */}
      <button
        className="absolute top-4 left-4 z-30 text-gray-700 md:hidden"
        onClick={toggleSidebar}
      >
        <FaBars size={24} />
      </button>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 transition-all duration-300">
        {currentComponent}
      </main>
    </div>
  );
}
