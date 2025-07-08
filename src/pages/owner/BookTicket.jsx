import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
export function BookTicket() {
  const [showId, setShowId] = useState("");
  const [seat, setSeat] = useState("");

  const handleBook = async (e) => {
    e.preventDefault();
    await axios.post(`shows/${showId}/seats/`, { seat_number: seat });
    toast.success("Ticket booked. Notification sent to owner.");
  };

  return (
    <form onSubmit={handleBook} className="p-6" data-aos="fade-up">
      <h1 className="text-2xl font-bold mb-4">🎟 Book Ticket</h1>
      <input
        placeholder="Show ID"
        value={showId}
        onChange={(e) => setShowId(e.target.value)}
        className="block w-full p-2 mb-4 border rounded"
        required
      />
      <input
        placeholder="Seat Number"
        value={seat}
        onChange={(e) => setSeat(e.target.value)}
        className="block w-full p-2 mb-4 border rounded"
        required
      />
      <button
        type="submit"
        className="bg-indigo-600 text-white py-2 px-4 rounded"
      >
        Book
      </button>
    </form>
  );
}
