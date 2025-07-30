import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "../../utils/axios";
import { toast } from "react-toastify";
import { FaChair, FaArrowLeft } from "react-icons/fa";

export function ShowSeats() {
  const location = useLocation();
  const [seats, setSeats] = useState([]);
  const showId = location.state?.showId;

  useEffect(() => {
    axios
      .get(`shows/${showId}/seats/`)
      .then((res) => setSeats(res.data))
      .catch(() => toast.error("Failed to load seats"));
  }, [showId]);

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto" data-aos="fade-up">
    
      <button
        onClick={() => window.history.back()}
        className="flex items-center gap-2 text-blue-600 font-semibold hover:underline mb-6"
      >
        <FaArrowLeft /> Back
      </button>

 
      <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3 mb-6">
        <FaChair className="text-indigo-600 text-4xl" /> Booked Seats Overview
      </h1>

   
      <div className="flex gap-6 mb-6 text-sm sm:text-base">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-green-500"></div>
          <span className="text-gray-700">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-red-500"></div>
          <span className="text-gray-700">Booked</span>
        </div>
      </div>

      <div className="w-full p-6 bg-white shadow-lg">
        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-3">
          {seats.map((seat) => (
            <div
              key={seat.id}
              title={
                seat.is_booked
                  ? `Booked by: ${seat.booked_by}`
                  : `Seat: ${seat.row}${seat.column}`
              }
              className={`flex flex-col items-center justify-center px-2 py-2 rounded-md font-semibold text-xs sm:text-sm transition duration-300 ${
                seat.is_booked
                  ? "bg-red-500 text-white cursor-not-allowed shadow-md"
                  : "bg-green-500 text-white hover:bg-green-600 cursor-pointer shadow-sm"
              }`}
            >
              <FaChair className="text-lg sm:text-xl mb-1" />
              {seat.row}
              {seat.column}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
