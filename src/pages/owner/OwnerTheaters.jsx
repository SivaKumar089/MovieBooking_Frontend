import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaSearch, FaMapMarkerAlt, FaTheaterMasks } from "react-icons/fa";

export function OwnerTheaters() {
  const [theaters, setTheaters] = useState([]);
  const [search, setSearch] = useState("");

  const  ownerId = useSelector((state) => state.auth.user?.user_id);

  useEffect(() => {
    axios
      .get("theaters/")
      .then((res) => {
        setTheaters(res.data); 
      })
      .catch((err) => {
        toast.error("Failed to load your theaters");
      });
  }, [ownerId]);

  const filteredTheaters =
    search.trim() === ""
      ? theaters
      : theaters.filter((t) =>
          t.name.toLowerCase().includes(search.toLowerCase()) ||
          t.location.toLowerCase().includes(search.toLowerCase())
        );

  return (
    <div className="p-6" data-aos="fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold mb-6 text-indigo-700 flex items-center gap-2">
          <FaTheaterMasks className="text-indigo-600" /> My Theaters
        </h1>

        <div className="relative mb-6">
          <FaSearch className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search theaters..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
      </div>

      {filteredTheaters.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTheaters.map((theater) => (
            <div
              key={theater.id}
              className="p-5 bg-white border border-indigo-100 rounded-xl shadow hover:shadow-lg transition duration-300"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <FaTheaterMasks className="text-indigo-500" /> {theater.name}
              </h2>
              <p className="text-gray-600 flex items-center gap-2">
                <FaMapMarkerAlt className="text-pink-500" /> {theater.location}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-4">No theaters found.</p>
      )}
    </div>
  );
}
