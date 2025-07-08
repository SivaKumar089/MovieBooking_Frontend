import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaFilm, FaTheaterMasks } from "react-icons/fa";

export default function GetTheaters() {
  const [theaters, setTheaters] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("theaters/").then((res) => setTheaters(res.data));
  }, []);

  const handleViewMovies = (theaterId) => {
    navigate("/user/movies", { state: { theaterId } });
  };

  return (
    <div className="p-6" data-aos="fade-up">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700 flex items-center gap-3">
        <FaTheaterMasks className="text-indigo-600" /> Theaters
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {theaters.map((t) => (
          <div
            key={t.id}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300 border border-indigo-100"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <FaTheaterMasks className="text-indigo-500" /> {t.name}
            </h2>

            <p className="text-gray-600 flex items-center gap-2 mb-4">
              <FaMapMarkerAlt className="text-pink-500" /> {t.location}
            </p>

            <button
              onClick={() => handleViewMovies(t.id)}
              className="inline-flex items-center gap-2 text-sm text-white bg-indigo-600 px-4 py-2 rounded hover:bg-indigo-700 transition"
            >
              <FaFilm /> View Running Movies
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
