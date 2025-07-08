import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "../../utils/axios";
import { toast } from "react-toastify";
import {
  FaChair,   
  FaArrowLeft,
} from "react-icons/fa";

export function ShowSeats() {
  const location = useLocation();

  const [seats, setSeats] = useState([]);
  const showId = location.state?.showId;
  
  useEffect(() => {
    // fetch seats
    axios
      .get(`shows/${showId}/seats/`)
      .then((res) => setSeats(res.data))
      .catch(() => toast.error("Failed to load seats"));

   
  }, [showId]);

  return (
    <div className="p-6" data-aos="fade-up">
      <button
        onClick={() => window.history.back()}
        className="flex items-center gap-2 text-gray-600 mb-4"
      >
        <FaArrowLeft /> Back
      </button>

      <h1 className="text-3xl font-bold mb-4 text-gray-800 flex items-center gap-2">
        <FaChair className="text-indigo-600" /> Show booked Seat
      </h1>

      {/* Seats Grid */}
      <div className="border rounded-lg p-4 bg-white shadow-inner">
        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-1">
          {seats.map((seat) => (
            <div
              key={seat.id}
              title={seat.is_booked ? `Booked by: ${seat.booked_by}` : ""}
              className={`flex flex-col items-center justify-center rounded shadow-sm font-medium text-[8px] sm:text-xs transition cursor-pointer ${
                seat.is_booked
                  ? "bg-red-500 text-white cursor-not-allowed"
                  : "bg-green-500 text-white hover:bg-green-600"
              }`}
            >
              <FaChair className="text-[10px] sm:text-sm mb-1" />
              {seat.row}
              {seat.column}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
