import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../../utils/axios";
import { useSelector } from "react-redux";

export default function CancelTicket() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.access);

  // Get ticket details passed from previous page
  const { ticketId } = location.state;
  const ticketPrice = 100;
  const cancelFee = ticketPrice * 0.25;
  const refundAmount = ticketPrice - cancelFee;

  const handleCancel = async () => {
    try {
      await axios.patch(
        `bookings/${ticketId}/cancel/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Ticket cancelled successfully!");
      navigate("/user/my-tickets");
    } catch (err) {
      console.error(err);
      toast.error("Cancellation failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Cancel Ticket</h2>
      
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => navigate(-1)}
            className="w-1/2 bg-gray-300 text-black py-2 rounded hover:bg-gray-400"
          >
            ⬅ Back
          </button>
          <button
            onClick={handleCancel}
            className="w-1/2 bg-red-600 text-white py-2 rounded hover:bg-red-700"
          >
            Confirm Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
