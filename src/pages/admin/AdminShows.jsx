import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { toast } from "react-toastify";
import { Film, MapPin, CalendarDays, Clock, Users } from "lucide-react";

export default function AdminShows() {
  const [shows, setShows] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get("shows/")
      .then((res) => setShows(res.data))
      .catch(() => toast.error("Error loading shows"));
  }, []);

  const filteredShows = shows.filter(
    (show) =>
      show.movie_name.toLowerCase().includes(search.toLowerCase()) ||
      show.theater_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6" data-aos="fade-up">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        🎟️ Manage Shows
      </h1>

      <input
        type="text"
        placeholder="🔍 Search by movie or theater name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredShows.length === 0 ? (
          <p className="text-center text-gray-500 col-span-full">
            No shows found.
          </p>
        ) : (
          filteredShows.map((show) => (
            <div
              key={show.id}
              className="bg-white rounded-2xl shadow-md p-5 space-y-2 hover:shadow-lg transition"
            >
              <div className="flex items-center gap-2 text-xl font-semibold">
                <Film className="w-5 h-5 text-blue-500" />
                {show.movie_name}
              </div>

              <div className="text-sm flex items-center gap-2 text-gray-700">
                <MapPin className="w-4 h-4 text-green-500" />
                {show.theater_name}
              </div>

              <div className="text-sm flex items-center gap-2 text-gray-600">
                <CalendarDays className="w-4 h-4 text-purple-500" />
                {show.date}
              </div>

              <div className="text-sm flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4 text-yellow-500" />
                {show.start_time} - {show.end_time}
              </div>

              <div className="text-sm flex items-center gap-2 text-gray-600">
                <Users className="w-4 h-4 text-red-500" />
                <span>
                  {show.booked_seats} booked / {show.total_seats} seats
                </span>
              </div>

              <div className="mt-2">
                <span
                  className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                    show.available_seats > 0
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {show.available_seats} seats available
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
