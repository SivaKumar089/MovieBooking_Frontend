import React, { useState } from "react";
import {
  FaHome,
  FaTheaterMasks,
  FaFilm,
  FaTicketAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";


import GetMovies from "./GetMovies";
import GetTheaters from "./GetTheaters";
import MyTickets from "./MyTickets";

export default function UserDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeComponent, setActiveComponent] = useState("Dashboard");

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const navItems = [
    {
      label: "Theaters",
      icon: <FaTheaterMasks />,
      component: <GetTheaters />,
    },
    { label: "Movies", icon: <FaFilm />, component: <GetMovies /> },
    { label: "My Tickets", icon: <FaTicketAlt />, component: <MyTickets /> },
  ];

  const currentComponent =
    navItems.find((item) => item.label === activeComponent)?.component || null;

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed z-20 inset-y-0 left-0 transform bg-white w-64 border-r shadow-xl p-5 space-y-6 transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:block ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-6 md:hidden">
          <h2 className="text-2xl font-bold text-blue-700">User Panel</h2>
          <FaTimes
            className="text-gray-600 text-2xl cursor-pointer"
            onClick={toggleSidebar}
          />
        </div>

        <nav className="space-y-4">
          {navItems.map(({ label, icon }) => (
            <button
              key={label}
              onClick={() => {
                setActiveComponent(label);
                setSidebarOpen(false);
              }}
              className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-md font-medium ${
                activeComponent === label
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              {icon} {label}
            </button>
          ))}
        </nav>
      </div>

      <button
        className="absolute top-4 left-4 z-30 text-gray-700 md:hidden"
        onClick={toggleSidebar}
      >
        <FaBars size={24} />
      </button>

      <main className="flex-1 p-6 ml-0 md:ml-64 transition-all duration-300">
        {currentComponent}
      </main>
    </div>
  );
}
