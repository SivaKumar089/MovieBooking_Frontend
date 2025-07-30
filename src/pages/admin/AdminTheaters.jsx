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
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-8" data-aos="fade-up">
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-gray-800">
           Admin - Theaters
        </h1>

        <div className="relative mt-4 sm:mt-0 w-full sm:w-1/2">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search theaters..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
      </div>

      
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {theaters
          .filter((t) => t.name.toLowerCase().includes(search.toLowerCase()))
          .map((theater) => (
            <div
              key={theater.id}
              className="bg-gradient-to-br from-white via-blue-50 to-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 p-6"
            >
              <div className="flex items-center gap-3 text-blue-800 mb-4">
                <FaWarehouse className="text-2xl" />
                <h2 className="text-xl font-bold">{theater.name}</h2>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaMapMarkerAlt className="text-red-500" />
                <span>{theater.location}</span>
              </div>
            </div>
          ))}
      </div>

      {theaters.length === 0 && (
        <p className="text-center text-gray-500">No theaters found.</p>
      )}
    </div>
  );
}
