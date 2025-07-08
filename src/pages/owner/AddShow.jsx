import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

export function AddShow() {
  const [form, setForm] = useState({
    movie: "",
    theater: "",
    date: "",
    start_time: "",
    end_time: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);

  const ownerId = useSelector((state) => state.auth.user?.user_id);

  const token = useSelector((state) => state.auth.access);

  useEffect(() => {
    const fetchTheatersAndMovies = async () => {
      try {
        const theaterRes = await axios.get("theaters/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTheaters(theaterRes.data);

        const movieRes = await axios.get("movies/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMovies(movieRes.data);
      } catch (err) {
        toast.error("Failed to fetch theaters or movies.");
      }
    };

    fetchTheatersAndMovies();
  }, [token]);

  const validate = () => {
    const newErrors = {};
    if (!form.movie) newErrors.movie = "Movie is required.";
    if (!form.theater) newErrors.theater = "Theater is required.";
    if (!form.date) newErrors.date = "Date is required.";
    if (!form.start_time) newErrors.start_time = "Start time is required.";
    if (!form.end_time) newErrors.end_time = "End time is required.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      await axios.post("shows/", { ...form, owner: ownerId });
      toast.success("🎭 Show added successfully!");
      setForm({
        movie: "",
        theater: "",
        date: "",
        start_time: "",
        end_time: "",
      });
      setErrors({});
    } catch (err) {
      toast.error("Error adding show.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6 space-y-5"
      data-aos="fade-up"
    >
      <h1 className="text-3xl font-bold text-purple-700">➕ Add Show</h1>

      <div>
        <label className="block text-gray-700 font-semibold mb-1">Movie</label>
        <select
          value={form.movie}
          onChange={(e) =>
            setForm({ ...form, movie: parseInt(e.target.value) })
          }
          className={`w-full px-4 py-2 border ${
            errors.movie ? "border-red-500" : "border-gray-300"
          } rounded focus:outline-none focus:ring-2 focus:ring-purple-400`}
        >
          <option value="">-- Select Movie --</option>
          {movies.map((movie) => (
            <option key={movie.id} value={movie.id}>
              {movie.title}
            </option>
          ))}
        </select>

        {errors.movie && (
          <p className="text-red-500 text-sm mt-1">{errors.movie}</p>
        )}
      </div>

      <div>
        <label className="block text-gray-700 font-semibold mb-1">
          Theater
        </label>
        <select
          value={form.theater}
          onChange={(e) => setForm({ ...form, theater: e.target.value })}
          className={`w-full px-4 py-2 border ${
            errors.theater ? "border-red-500" : "border-gray-300"
          } rounded focus:outline-none focus:ring-2 focus:ring-purple-400`}
        >
          <option value="">-- Select Theater --</option>
          {theaters.map((theater) => (
            <option key={theater.id} value={theater.id}>
              {theater.name}
            </option>
          ))}
        </select>
        {errors.theater && (
          <p className="text-red-500 text-sm mt-1">{errors.theater}</p>
        )}
      </div>

      <div>
        <label className="block text-gray-700 font-semibold mb-1">Date</label>
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className={`w-full px-4 py-2 border ${
            errors.date ? "border-red-500" : "border-gray-300"
          } rounded focus:outline-none focus:ring-2 focus:ring-purple-400`}
        />
        {errors.date && (
          <p className="text-red-500 text-sm mt-1">{errors.date}</p>
        )}
      </div>

      <div>
        <label className="block text-gray-700 font-semibold mb-1">
          Start Time
        </label>
        <input
          type="time"
          value={form.start_time}
          onChange={(e) => setForm({ ...form, start_time: e.target.value })}
          className={`w-full px-4 py-2 border ${
            errors.start_time ? "border-red-500" : "border-gray-300"
          } rounded focus:outline-none focus:ring-2 focus:ring-purple-400`}
        />
        {errors.start_time && (
          <p className="text-red-500 text-sm mt-1">{errors.start_time}</p>
        )}
      </div>

      <div>
        <label className="block text-gray-700 font-semibold mb-1">
          End Time
        </label>
        <input
          type="time"
          value={form.end_time}
          onChange={(e) => setForm({ ...form, end_time: e.target.value })}
          className={`w-full px-4 py-2 border ${
            errors.end_time ? "border-red-500" : "border-gray-300"
          } rounded focus:outline-none focus:ring-2 focus:ring-purple-400`}
        />
        {errors.end_time && (
          <p className="text-red-500 text-sm mt-1">{errors.end_time}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-6 rounded font-semibold disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add Show"}
      </button>
    </form>
  );
}
