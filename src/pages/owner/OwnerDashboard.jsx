import React, { useState } from "react";
import {
  FaPlus,
  FaTicketAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

import { AddTheater } from "./AddTheater";
import { AddMovie } from "./AddMovie";
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
    <div className="flex min-h-screen bg-gray-100">
      <div
        className={`fixed md:sticky top-0 left-0 z-30 h-full md:h-screen bg-white w-64 border-r shadow-md p-5 space-y-6 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex items-center justify-between mb-4 md:hidden">
          <h2 className="text-xl font-bold text-blue-700">Owner Panel</h2>
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
              className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium w-full transition ${
                activeComponent === label
                  ? "bg-blue-100 text-blue-600 cursor-pointer"
                  : "text-gray-700 hover:text-blue-600 cursor-pointer hover:bg-blue-50"
              }`}
            >
              {icon} {label}
            </button>
          ))}
        </nav>
      </div>

      
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
