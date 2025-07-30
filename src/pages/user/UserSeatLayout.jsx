import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import { toast } from "react-toastify";
import { HiTicket } from "react-icons/hi";
import { useSelector } from "react-redux";
import {
  FaTicketAlt,
  FaHashtag,
  FaChair,
  FaRupeeSign,
  FaMoneyCheckAlt,
} from "react-icons/fa";

export default function UserSeatLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const showId = location.state?.showId;

  const [seats, setSeats] = useState([]);
  const [myTickets, setMyTickets] = useState([]);
  const [selected, setSelected] = useState([]);
  const [ticketCount, setTicketCount] = useState(1);
  const ticketPrice = 100;
  const token = useSelector((state) => state.auth.access);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const value = Number(e.target.value);

    if (value < 1 || value > 10) {
      setError("Please select between 1 and 10 tickets");
    } else {
      setError("");
    }

    setTicketCount(value);
    setSelected([]);
  };

  useEffect(() => {
    if (!showId || !token) return;

    axios.get(`shows/${showId}/seats/`).then((res) => setSeats(res.data));

    axios
      .get(`my-tickets/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const myBookedSeats = res.data
          .filter((ticket) => !ticket.is_cancelled)
          .map((ticket) => ticket.seat.id);
        setMyTickets(myBookedSeats);
      })
      .catch((err) => console.error("Error loading my tickets:", err));
  }, [showId, token]);

  const handleSelect = (seat) => {
    if (error === "") {
      if (seat.is_booked || myTickets.includes(seat.id)) return;

      if (selected.includes(seat.id)) {
        setSelected((prev) => prev.filter((s) => s !== seat.id));
      } else {
        if (selected.length >= ticketCount) {
          const [, ...rest] = selected;
          setSelected([...rest, seat.id]);
        } else {
          setSelected((prev) => [...prev, seat.id]);
        }
      }
    }
  };

  const handleProceedToPay = () => {
    if (selected.length !== ticketCount) {
      toast.error(`Please select exactly ${ticketCount} seats.`);
      return;
    }

    const selectedSeatDetails = seats.filter((seat) =>
      selected.includes(seat.id)
    );

    navigate("/user/payment", {
      state: {
        showId,
        selectedSeats: selectedSeatDetails,
        totalAmount: selected.length * ticketPrice,
        count: selected.length,
      },
    });
  };

  return (
    <div className="p-6" data-aos="fade-up">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700 flex items-center gap-2">
        <FaTicketAlt /> Select Seats
      </h1>

      <div className="mb-6 w-72">
        <label className="flex items-center text-sm font-medium text-gray-700 mb-1 gap-1">
          <HiTicket className="text-indigo-600 text-lg" />
          Number of Tickets
        </label>

        <input
          type="number"
          value={ticketCount}
          min={1}
          max={10}
          onChange={handleChange}
          className={`border px-4 py-2 rounded w-full shadow-sm text-sm focus:outline-none focus:ring-2 ${
            error
              ? "border-red-500 focus:ring-red-300"
              : "focus:ring-indigo-400"
          }`}
        />

        {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
      </div>
      <div className="flex gap-6 mb-6 text-sm sm:text-base">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-green-500"></div>
          <span className="text-gray-700">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-red-600"></div>
          <span className="text-gray-700">Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-blue-600"></div>
          <span className="text-gray-700">My Ticket</span>
        </div>
      </div>
      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 mb-6">
        {seats.map((seat) => {
          const isMine = myTickets.includes(seat.id);
          const isSelected = selected.includes(seat.id);

          const seatColor = seat.is_booked
            ? isMine
              ? "bg-blue-600 text-white cursor-not-allowed"
              : "bg-red-600 text-white cursor-not-allowed"
            : isSelected
            ? "bg-yellow-400 text-black cursor-pointer"
            : "bg-green-500 text-white hover:bg-green-600 cursor-pointer";

          return (
            <div
              key={seat.id}
              onClick={() => handleSelect(seat)}
              className={`flex flex-col items-center justify-center py-2 rounded shadow font-bold transition duration-200  text-xs ${seatColor}`}
            >
              <FaChair className="text-lg" />
              {seat.row}
              {seat.column}
            </div>
          );
        })}
      </div>

      <div className="mt-4 text-lg font-semibold flex items-center gap-2 text-gray-800">
        <FaRupeeSign className="text-green-600" /> Total: ₹
        {selected.length * ticketPrice}
      </div>

      <button
        onClick={handleProceedToPay}
        className="mt-6 flex items-center gap-2 bg-indigo-700 hover:bg-indigo-800 text-white py-2 px-6 rounded shadow transition cursor-pointer"
      >
        <FaMoneyCheckAlt /> Proceed to Pay
      </button>
    </div>
  );
}
