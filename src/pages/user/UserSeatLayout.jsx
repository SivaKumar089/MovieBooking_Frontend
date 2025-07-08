import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import { toast } from "react-toastify";
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

      <label className="block mb-2 font-semibold flex items-center gap-2 text-gray-700">
        <FaHashtag className="text-indigo-500" /> How many tickets?
      </label>

      <input
        type="number"
        value={ticketCount}
        min={1}
        max={5}
        onChange={(e) => {
          setTicketCount(Number(e.target.value));
          setSelected([]);
        }}
        className="mb-6 border px-3 py-2 rounded w-28 shadow focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />

      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 mb-6">
        {seats.map((seat) => {
          const isMine = myTickets.includes(seat.id);
          const isSelected = selected.includes(seat.id);

          const seatColor = seat.is_booked
            ? isMine
              ? "bg-blue-600 text-white cursor-not-allowed"
              : "bg-red-600 text-white cursor-not-allowed"
            : isSelected
            ? "bg-yellow-400 text-black"
            : "bg-green-500 text-white hover:bg-green-600";

          return (
            <div
              key={seat.id}
              onClick={() => handleSelect(seat)}
              className={`flex flex-col items-center justify-center py-2 rounded shadow font-bold transition duration-200 cursor-pointer text-xs ${seatColor}`}
            >
              <FaChair className="text-lg" />
              {seat.row}
              {seat.column}
            </div>
          );
        })}
      </div>

      <div className="mt-4 text-lg font-semibold flex items-center gap-2 text-gray-800">
        <FaRupeeSign className="text-green-600" /> Total: ₹{selected.length * ticketPrice}
      </div>

      <button
        onClick={handleProceedToPay}
        className="mt-6 flex items-center gap-2 bg-indigo-700 hover:bg-indigo-800 text-white py-2 px-6 rounded shadow transition"
      >
        <FaMoneyCheckAlt /> Proceed to Pay
      </button>
    </div>
  );
}
