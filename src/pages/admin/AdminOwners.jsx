import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import {
  FaEnvelope,
  FaUserTie,
  FaSearch,
  FaTheaterMasks,
} from "react-icons/fa";

export default function AdminOwners() {
  const [owners, setOwners] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get("signup/?role=owner")
      .then((res) => setOwners(res.data))
      .catch((err) => console.error("Failed to load owners", err));
  }, []);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6" data-aos="fade-up">
      <h1 className="text-3xl font-bold text-center sm:text-left">
        🧑‍💼 Admin - Owners
      </h1>

      {/* Search Input */}
      <div className="relative">
        <FaSearch className="absolute top-3 left-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search owners by email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Owners Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {owners
          .filter((o) => o.email.toLowerCase().includes(search.toLowerCase()))
          .map((owner) => (
            <div
              key={owner.id}
              className="bg-white p-5 rounded-xl shadow hover:shadow-md transition-all duration-200"
            >
              <div className="space-y-2 text-gray-700 text-sm">
                <p className="flex items-center gap-2 font-medium text-blue-700">
                  <FaUserTie className="text-blue-600" />
                  Username: {owner.username}
                </p>
                <p className="flex items-center gap-2">
                  <FaEnvelope className="text-blue-400" />
                  Email: {owner.email}
                </p>
                <p className="flex items-center gap-2">
                  <FaTheaterMasks className="text-purple-500" />
                  Theaters: {owner.theaters_count || 0}
                </p>
              </div>
            </div>
          ))}
      </div>

      {owners.length === 0 && (
        <p className="text-center text-gray-500">No owners found.</p>
      )}
    </div>
  );
}
