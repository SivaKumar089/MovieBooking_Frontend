import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
  FaCreditCard,
  FaMoneyBillWave,
  FaChair,
  FaArrowLeft,
  FaCheckCircle,
  FaSpinner,
} from "react-icons/fa";

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { showId, selectedSeats, totalAmount, count } = location.state;
  const token = useSelector((state) => state.auth.access);
  const [balance, setBalance] = useState(100000);
  const [show, setShow] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!showId) return;
    axios.get(`shows/${showId}/`).then((res) => setShow(res.data));
  }, [showId]);

  const handlePayment = async () => {
    if (totalAmount > balance) {
      toast.error("Insufficient balance!");
      return;
    }
    setLoading(true);
    try {
      toast.success("Payment Successful!");

      for (let seat of selectedSeats) {
        await axios.post(
          "bookings/",
          {
            movie_id: show.movie,
            theater_id: show.theater,
            show_id: showId,
            row: seat.row,
            column: seat.column,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        await axios.patch(
          `seats/${seat.id}/`,
          { is_booked: true },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      setBalance((prev) => prev - totalAmount);
      toast.success("Seats booked successfully!");
      navigate("/user/my-tickets");
    } catch (err) {
      toast.error("Booking failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-gradient-to-br from-indigo-50 to-white">
      <div className="bg-white shadow-2xl rounded-xl p-6 w-full max-w-md text-center border border-indigo-100">
        <h2 className="text-2xl font-bold mb-4 text-indigo-700 flex justify-center items-center gap-2">
          <FaCreditCard /> Payment page
        </h2>

        <div className="mb-2 text-gray-700 text-sm flex justify-center items-center gap-2">
          <FaChair className="text-indigo-500" />
          Booking <strong className="text-indigo-700">{count}</strong> seat(s)
        </div>

        <div className="text-lg font-semibold mb-2 flex items-center justify-center text-green-600 gap-2">
          <FaMoneyBillWave /> Total: ₹{totalAmount}
        </div>

        <p className="text-gray-700 text-sm mb-4">
          Selected Seats:
          <span className="ml-1 font-semibold text-indigo-600">
            {selectedSeats.map((s) => `${s.row}${s.column}`).join(", ")}
          </span>
        </p>

        <div className="flex justify-between mt-6 gap-4">
          <button
            onClick={() => navigate(-1)}
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition w-1/2 text-sm font-medium cursor-pointer"
          >
            <FaArrowLeft /> Back
          </button>

          <button
            onClick={handlePayment}
            disabled={loading}
            className={`flex items-center justify-center gap-2  ${
              loading
                ? "bg-indigo-400 cursor-wait cursor-not-allowed"
                : "bg-indigo-700 hover:bg-indigo-800 cursor-pointer"
            } text-white px-4 py-2 rounded transition w-1/2 text-sm font-medium`}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" /> Processing...
              </>
            ) : (
              <>
                <FaCheckCircle /> Pay Now
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
