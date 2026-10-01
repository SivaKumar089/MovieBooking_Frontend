import React, { useState, useEffect } from "react";
import axios from "../../utils/axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { FaFilm, FaImage, FaStar, FaLink, FaCalendarAlt, FaClock, FaCheckCircle, FaTheaterMasks } from "react-icons/fa";

export function AddMovie() {
  const ownerId = useSelector((state) => state.auth.user?.user_id);
  const token = useSelector((state) => state.auth.access);

  const [form, setForm] = useState({
    title: "",
    description: "",
    duration_minutes: "120",
    language: "English",
    release_date: new Date().toISOString().split("T")[0],
    theater: "",
    genre: "Action / Sci-Fi",
    rating: "8.5",
    poster_url: "",
    banner_url: "",
    trailer_url: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [theaters, setTheaters] = useState([]);

  useEffect(() => {
    const fetchTheaters = async () => {
      try {
        const res = await axios.get("theaters/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTheaters(res.data);
        if (res.data.length > 0) {
          setForm((prev) => ({ ...prev, theater: res.data[0].id }));
        }
      } catch (err) {
        toast.error("Failed to fetch theaters.");
      }
    };
    fetchTheaters();
  }, [token]);

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required.";
    if (!form.theater) newErrors.theater = "Please select a theater.";
    if (!form.duration_minutes) newErrors.duration_minutes = "Duration is required.";
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
      await axios.post("movies/", { ...form, owner: ownerId });
      toast.success("🎬 Movie registered with poster successfully!");
      setForm({
        title: "",
        description: "",
        duration_minutes: "120",
        language: "English",
        release_date: new Date().toISOString().split("T")[0],
        theater: theaters.length > 0 ? theaters[0].id : "",
        genre: "Action / Sci-Fi",
        rating: "8.5",
        poster_url: "",
        banner_url: "",
        trailer_url: "",
      });
      setErrors({});
    } catch (error) {
      toast.error("Failed to register movie. Check inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-4 max-w-4xl mx-auto" data-aos="fade-up">
      <div className="mb-6 pb-4 border-b border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
          <FaFilm className="text-amber-400" /> Register Cinema Movie
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Add new cinematic titles, posters, and metadata to your theater portfolio
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left 2 Cols: Form */}
        <form
          onSubmit={handleSubmit}
          className="md:col-span-2 bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-2xl space-y-4"
        >
          {/* Theater Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Target Theater Hall
            </label>
            <select
              value={form.theater}
              onChange={(e) => setForm({ ...form, theater: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-amber-400"
            >
              <option value="">-- Choose Theater --</option>
              {theaters.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.location})
                </option>
              ))}
            </select>
            {errors.theater && <p className="text-red-400 text-xs mt-1">{errors.theater}</p>}
          </div>

          {/* Title & Genre */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Movie Title
              </label>
              <input
                type="text"
                placeholder="e.g. Dune: Part Two"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-amber-400"
              />
              {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Genre
              </label>
              <input
                type="text"
                placeholder="e.g. Sci-Fi / Adventure"
                value={form.genre}
                onChange={(e) => setForm({ ...form, genre: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Duration, Language, Rating */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Duration (min)
              </label>
              <input
                type="number"
                value={form.duration_minutes}
                onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm px-3 py-2.5 rounded-xl focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Language
              </label>
              <input
                type="text"
                value={form.language}
                onChange={(e) => setForm({ ...form, language: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm px-3 py-2.5 rounded-xl focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                IMDb Rating
              </label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="10"
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm px-3 py-2.5 rounded-xl focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Poster URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Poster Image URL
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/... or poster CDN link"
              value={form.poster_url}
              onChange={(e) => setForm({ ...form, poster_url: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Release Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Release Date
            </label>
            <input
              type="date"
              value={form.release_date}
              onChange={(e) => setForm({ ...form, release_date: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Synopsis / Description
            </label>
            <textarea
              rows={3}
              placeholder="Movie synopsis for audience display..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-amber-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <FaCheckCircle /> {loading ? "Registering Movie..." : "Publish Movie to Catalog"}
          </button>
        </form>

        {/* Right 1 Col: Live Poster Preview Card */}
        <div className="space-y-4">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Live Poster Preview
          </label>
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-xl text-center">
            <div className="aspect-[2/3] w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center relative mb-4">
              {form.poster_url ? (
                <img
                  src={form.poster_url}
                  alt="Poster Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600";
                  }}
                />
              ) : (
                <div className="text-slate-600 flex flex-col items-center gap-2 p-4">
                  <FaImage size={36} />
                  <span className="text-xs">Paste a Poster URL on the left to preview</span>
                </div>
              )}
              {form.rating && (
                <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-amber-400 text-xs font-bold flex items-center gap-1 border border-amber-500/30">
                  <FaStar size={10} /> {form.rating}
                </div>
              )}
            </div>

            <h3 className="font-bold text-white text-sm truncate">
              {form.title || "Untitled Movie"}
            </h3>
            <p className="text-[11px] text-amber-400">{form.genre || "Genre"}</p>
            <p className="text-[10px] text-slate-500 mt-1">
              {form.duration_minutes || "120"}m • {form.language || "English"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
