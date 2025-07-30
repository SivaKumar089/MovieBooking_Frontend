import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaClock,
  FaLanguage,
  FaCalendarAlt,
  FaTheaterMasks,
} from "react-icons/fa";
export default function GetMovies() {
  const location = useLocation();
  const theaterId = location.state?.theaterId;
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();
 

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const url = theaterId ? `movies/?theater=${theaterId}` : "movies/";
        const res = await axios.get(url);
        setMovies(res.data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, [theaterId]);
  
    const handleViewShows = (movieId) => {
      navigate("/user/shows", { state: { movieId } });
    };

  return (
    <div className="p-6" data-aos="fade-up">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">🎬 Movies</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {movies.map((m) => (
          <div
            key={m.id}
            className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition duration-300 border border-gray-200"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {m.title}
            </h2>
            <p className="text-gray-600 mb-4 italic">{m.description}</p>

            <ul className="text-sm text-gray-700 mb-4 space-y-2">
              <li className="flex items-center gap-2">
                <FaClock className="text-blue-500" />
                <span className="font-medium">Duration:</span>{" "}
                {m.duration_minutes} mins
              </li>
              <li className="flex items-center gap-2">
                <FaLanguage className="text-green-500" />
                <span className="font-medium">Language:</span> {m.language}
              </li>
              <li className="flex items-center gap-2">
                <FaCalendarAlt className="text-purple-500" />
                <span className="font-medium">Release:</span>{" "}
                {new Date(m.release_date).toLocaleDateString()}
              </li>
            </ul>

            <button
              onClick={() => handleViewShows(m.id)}
              className="mt-2 inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded hover:bg-blue-700 transition cursor-pointer"
            >
              <FaTheaterMasks />
              View Shows
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
