import React, { useState } from "react";
import {
  FaTheaterMasks,
  FaFilm,
  FaTicketAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

import GetTheaters from "./GetTheaters";
import GetMovies from "./GetMovies";
import MyTickets from "./MyTickets";

export default function UserDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeComponent, setActiveComponent] = useState("Theaters");

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const navItems = [
    { label: "Theaters", icon: <FaTheaterMasks />, component: <GetTheaters /> },
    { label: "Movies", icon: <FaFilm />, component: <GetMovies /> },
    { label: "My Tickets", icon: <FaTicketAlt />, component: <MyTickets /> },
  ];

  const currentComponent =
    navItems.find((item) => item.label === activeComponent)?.component || null;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside
        className={`fixed md:sticky top-0 left-0 z-30 h-full md:h-screen bg-white w-64 border-r shadow-md p-5 space-y-6 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex items-center justify-between mb-4 md:hidden">
          <h2 className="text-xl font-bold text-blue-700">User Panel</h2>
          <FaTimes
            className="text-gray-600 text-2xl cursor-pointer"
            onClick={toggleSidebar}
          />
        </div>

        <nav className="flex flex-col gap-2">
          {navItems.map(({ label, icon }) => (
            <button
              key={label}
              onClick={() => {
                setActiveComponent(label);
                setSidebarOpen(false);
              }}
              className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer font-medium transition w-full ${
                activeComponent === label
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-700 hover:text-blue-600 hover:bg-blue-50 "
              }`}
            >
              {icon} {label}
            </button>
          ))}
        </nav>
      </aside>
      <button
        className="fixed top-4 left-4 z-40 text-gray-700 md:hidden cursor-pointer"
        onClick={toggleSidebar}
      >
        <FaBars size={24} />
      </button>
      <main className="flex-1 p-4 md:p-6 w-full overflow-x-auto transition-all duration-300">
        <div className="w-full max-w-full">{currentComponent}</div>
      </main>
    </div>
  );
}
