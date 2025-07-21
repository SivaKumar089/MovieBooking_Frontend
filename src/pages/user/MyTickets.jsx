import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import {
  FaFilm,
  FaTheaterMasks,
  FaChair,
  FaCalendarAlt,
  FaUser,
  FaCheckCircle,
  FaTicketAlt,
} from "react-icons/fa";
export default function MyTickets() {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    axios.get("my-tickets/").then((res) => setTickets(res.data));
  }, []);
  const CancelTicket = (ticketId) => {
    navigate("/user/cancel", { state: { ticketId } });
  };
  return (
    <div className="p-6" data-aos="fade-up">
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600">
        🎟 My Tickets
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="p-5 bg-white rounded-xl shadow-md border hover:shadow-lg transition space-y-2"
          >
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <FaFilm className="text-indigo-500" /> {ticket.movie_name}
            </h2>

            <p className="flex items-center gap-2 text-gray-600">
              <FaTheaterMasks className="text-indigo-400" />
              <span className="font-medium">Theater:</span>{" "}
              {ticket.theater_name}
            </p>

            <p className="flex items-center gap-2 text-gray-600">
              <FaChair className="text-indigo-400" />
              <span className="font-medium">Seat:</span>
              {ticket.seat.row}
              {ticket.seat.column}
            </p>

            <p className="flex items-center gap-2 text-gray-600">
              <FaTicketAlt className="text-indigo-400" />
              <span className="font-medium">Show:</span> {ticket.show}
            </p>

            <p
              className={`flex items-center gap-2 ${
                ticket.is_cancelled ? "text-red-500" : "text-green-600"
              }`}
            >
              <FaCheckCircle size={16} />
              <span className="font-medium">Status:</span>{" "}
              {ticket.is_cancelled ? "Cancelled" : "Confirmed"}
            </p>

            {!ticket.is_cancelled && (
              <button
                onClick={() => CancelTicket(ticket.id)}
                className="w-full bg-red-600 hover:bg-red-700 cursor-pointer text-white py-2 px-4 rounded transition"
              >
                Cancel Ticket
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
