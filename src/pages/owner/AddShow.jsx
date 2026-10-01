import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
  FaCalendarAlt,
  FaClock,
  FaFilm,
  FaTheaterMasks,
  FaPlus,
  FaSpinner,
  FaRupeeSign,
  FaTicketAlt,
} from "react-icons/fa";

export function AddShow() {
  const [form, setForm] = useState({
    movie: "",
    theater: "",
    date: "",
    start_time: "",
    end_time: "",
    vip_price: "280",
    premium_price: "200",
    standard_price: "140",
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
        if (theaterRes.data.length > 0) {
          setForm((prev) => ({ ...prev, theater: theaterRes.data[0].id }));
        }

        const movieRes = await axios.get("movies/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMovies(movieRes.data);
        if (movieRes.data.length > 0) {
          setForm((prev) => ({ ...prev, movie: movieRes.data[0].id }));
        }
      } catch (err) {
        toast.error("Failed to fetch theaters or movies for scheduling.");
      }
    };

    fetchTheatersAndMovies();
  }, [token]);

  const validate = () => {
    const newErrors = {};
    if (!form.movie) newErrors.movie = "Movie is required.";
    if (!form.theater) newErrors.theater = "Theater is required.";
    if (!form.date) newErrors.date = "Screening date is required.";
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
      await axios.post("shows/", {
        ...form,
        owner: ownerId,
        movie: parseInt(form.movie),
        theater: parseInt(form.theater),
      });
      toast.success("🎭 Show scheduled successfully! Seats auto-initialized.");
      setForm((prev) => ({
        ...prev,
        date: "",
        start_time: "",
        end_time: "",
      }));
      setErrors({});
    } catch (err) {
      toast.error(err.response?.data?.error || "Error scheduling show. Please check timings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-4 max-w-2xl mx-auto" data-aos="fade-up">
      <div className="mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
          <FaCalendarAlt /> Showtime Programming
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Schedule Cinema Screening
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Publish a theatrical showtime for real-time online audience bookings
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-slate-900/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-4"
      >
        {/* Movie Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Feature Film
          </label>
          <div className="relative">
            <FaFilm className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs pointer-events-none" />
            <select
              value={form.movie}
              onChange={(e) => setForm({ ...form, movie: e.target.value })}
              className={`w-full bg-slate-950/80 border ${
                errors.movie ? "border-red-500" : "border-slate-800 focus:border-amber-400"
              } text-slate-100 pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition`}
            >
              <option value="">-- Choose Movie --</option>
              {movies.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title} ({m.language || "English"})
                </option>
              ))}
            </select>
          </div>
          {errors.movie && (
            <p className="text-xs text-red-400 mt-1 font-medium">{errors.movie}</p>
          )}
        </div>

        {/* Theater Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Cinema Auditorium
          </label>
          <div className="relative">
            <FaTheaterMasks className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs pointer-events-none" />
            <select
              value={form.theater}
              onChange={(e) => setForm({ ...form, theater: e.target.value })}
              className={`w-full bg-slate-950/80 border ${
                errors.theater ? "border-red-500" : "border-slate-800 focus:border-amber-400"
              } text-slate-100 pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition`}
            >
              <option value="">-- Choose Theater Hall --</option>
              {theaters.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.location})
                </option>
              ))}
            </select>
          </div>
          {errors.theater && (
            <p className="text-xs text-red-400 mt-1 font-medium">{errors.theater}</p>
          )}
        </div>

        {/* Screening Date */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Screening Date
          </label>
          <div className="relative">
            <FaCalendarAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs pointer-events-none" />
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className={`w-full bg-slate-950/80 border ${
                errors.date ? "border-red-500" : "border-slate-800 focus:border-amber-400"
              } text-slate-100 pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition`}
            />
          </div>
          {errors.date && (
            <p className="text-xs text-red-400 mt-1 font-medium">{errors.date}</p>
          )}
        </div>

        {/* Times Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Start Time
            </label>
            <div className="relative">
              <FaClock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs pointer-events-none" />
              <input
                type="time"
                value={form.start_time}
                onChange={(e) => setForm({ ...form, start_time: e.target.value })}
                className={`w-full bg-slate-950/80 border ${
                  errors.start_time ? "border-red-500" : "border-slate-800 focus:border-amber-400"
                } text-slate-100 pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition`}
              />
            </div>
            {errors.start_time && (
              <p className="text-xs text-red-400 mt-1 font-medium">{errors.start_time}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              End Time
            </label>
            <div className="relative">
              <FaClock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs pointer-events-none" />
              <input
                type="time"
                value={form.end_time}
                onChange={(e) => setForm({ ...form, end_time: e.target.value })}
                className={`w-full bg-slate-950/80 border ${
                  errors.end_time ? "border-red-500" : "border-slate-800 focus:border-amber-400"
                } text-slate-100 pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition`}
              />
            </div>
            {errors.end_time && (
              <p className="text-xs text-red-400 mt-1 font-medium">{errors.end_time}</p>
            )}
          </div>
        </div>

        {/* Pricing Tiers Row */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Tier Pricing (₹ INR)
          </label>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <span className="text-[10px] text-amber-400 font-bold block mb-1">
                VIP Recliner
              </span>
              <input
                type="number"
                value={form.vip_price}
                onChange={(e) => setForm({ ...form, vip_price: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 text-slate-100 px-3 py-2 rounded-xl text-xs"
              />
            </div>
            <div>
              <span className="text-[10px] text-sky-400 font-bold block mb-1">
                Premium Club
              </span>
              <input
                type="number"
                value={form.premium_price}
                onChange={(e) => setForm({ ...form, premium_price: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 text-slate-100 px-3 py-2 rounded-xl text-xs"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-300 font-bold block mb-1">
                Classic
              </span>
              <input
                type="number"
                value={form.standard_price}
                onChange={(e) => setForm({ ...form, standard_price: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 text-slate-100 px-3 py-2 rounded-xl text-xs"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold py-3.5 rounded-xl shadow-lg shadow-amber-500/20 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer text-sm disabled:opacity-50"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin text-base" />
              <span>Initializing Seats & Show...</span>
            </>
          ) : (
            <>
              <FaPlus />
              <span>Schedule Cinema Show</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
