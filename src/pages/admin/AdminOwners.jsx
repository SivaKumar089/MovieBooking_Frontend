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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-center sm:text-left">
           Admin - Owners
        </h1>
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
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {owners
          .filter((o) => o.email.toLowerCase().includes(search.toLowerCase()))
          .map((owner) => (
            <div
              key={owner.id}
              className="bg-gradient-to-br from-white via-blue-50 to-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 p-6"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <FaUserTie className="text-blue-700 text-xl" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {owner.username}
                  </h2>
                  <p className="text-xs text-gray-500 capitalize">
                    {owner.role}
                  </p>
                </div>
              </div>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <FaEnvelope className="text-blue-400" />
                  <span>{owner.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaTheaterMasks className="text-purple-500" />
                  <span className="font-medium">
                    Theaters: {owner.theater_count || 0}
                  </span>
                </div>
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
