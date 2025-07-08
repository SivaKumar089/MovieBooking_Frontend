import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { FaMapMarkerAlt, FaWarehouse, FaSearch } from "react-icons/fa";

export default function AdminTheaters() {
  const [theaters, setTheaters] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get("theaters/")
      .then((res) => setTheaters(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6" data-aos="fade-up">
      <h1 className="text-3xl font-bold text-center sm:text-left">
        🏢 Admin - Theaters
      </h1>

      {/* Search Input */}
      <div className="relative">
        <FaSearch className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search theaters..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Theater List */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {theaters
          .filter((t) => t.name.toLowerCase().includes(search.toLowerCase()))
          .map((theater) => (
            <div
              key={theater.id}
              className="bg-white p-5 rounded-xl shadow hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-2 mb-2 text-blue-600 font-semibold text-lg">
                <FaWarehouse />
                {theater.name}
              </div>
              <div className="flex items-center gap-2 text-gray-700 text-sm">
                <FaMapMarkerAlt className="text-red-500" />
                {theater.location}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
