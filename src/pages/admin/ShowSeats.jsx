import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
export function ShowSeats() {
  const { showId } = useParams();
  const [seats, setSeats] = useState([]);

  useEffect(() => {
    axios.get(`/shows/${showId}/seats/`).then((res) => setSeats(res.data));
  }, [showId]);

  return (
    <div className="p-6" data-aos="fade-up">
      <h1 className="text-2xl font-bold mb-6">🎫 Show Seat Layout</h1>
      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
        {seats.map((seat) => (
          <div
            key={seat.id}
            className={`text-center py-2 px-4 rounded shadow-sm text-sm font-medium transition-all duration-300 cursor-pointer ${
              seat.is_booked
                ? "bg-red-500 text-white cursor-not-allowed"
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            {seat.row}
            {seat.number}
          </div>
        ))}
      </div>
    </div>
  );
}
