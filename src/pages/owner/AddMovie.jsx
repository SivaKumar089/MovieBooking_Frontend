import React, { useState, useEffect } from "react";
import axios from "../../utils/axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

export function AddMovie() {
   const ownerId = useSelector((state) => state.auth.user?.user_id);
  const [form, setForm] = useState({
    title: "",
    description: "",
    duration_minutes: "",
    language: "",
    release_date: "",
    theater:0, 
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [theaters, setTheaters] = useState([]);

  const token = useSelector((state) => state.auth.access);

  
  useEffect(() => {
    const fetchTheaters = async () => {
      try {
        const res = await axios.get("theaters/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTheaters(res.data);
      } catch (err) {
        toast.error("Failed to fetch theaters.");
      }
    };
    fetchTheaters();
  }, [token]);

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required.";
    if (!form.description.trim()) newErrors.description = "Description is required.";
    if (!form.duration_minutes) newErrors.duration_minutes = "Duration is required.";
    if (!form.language.trim()) newErrors.language = "Language is required.";
    if (!form.release_date) newErrors.release_date = "Release date is required.";
    if (!form.theater) newErrors.theater = "Please select a theater.";
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
      // console.log(form)
      console.log(ownerId)
      console.log(form.theater)
      console.log(typeof form.theater)

      //console.log(typeof ownerId)
  
      await axios.post("movies/", { ...form, owner: ownerId });
      toast.success("🎬 Movie added successfully!");
      setForm({
        title: "",
        description: "",
        duration_minutes: "",
        language: "",
        release_date: "",
        theater:0,
      });
      setErrors({});
    } catch (error) {
      toast.error("Failed to add movie. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 max-w-xl mx-auto bg-white rounded-lg shadow-md space-y-5"
      data-aos="fade-up"
    >
      <h1 className="text-3xl font-bold text-green-700 mb-4">➕ Add Movie</h1>

      {/* Theater Select */}
      <div>
        <label className="block text-gray-700 font-semibold mb-1">Select Theater</label>
        <select
          value={form.theater}
          onChange={(e) => setForm({ ...form, theater: parseInt(e.target.value) })}
          className={`w-full px-4 py-2 border ${
            errors.theater ? "border-red-500" : "border-gray-300"
          } rounded focus:outline-none focus:ring-2 focus:ring-green-400`}
        >
          <option value="">-- Select a theater --</option>
          {theaters.map((theater) => (
            <option key={theater.id} value={theater.id}>
              {theater.name} - {theater.location} {theater.id}
            </option>
          ))}
        </select>
        {errors.theater && (
          <p className="text-red-500 text-sm mt-1">{errors.theater}</p>
        )}
      </div>

      {/* Title */}
      <div>
        <label className="block text-gray-700 font-semibold mb-1">Title</label>
        <input
          type="text"
          placeholder="Enter title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className={`w-full px-4 py-2 border ${
            errors.title ? "border-red-500" : "border-gray-300"
          } rounded focus:outline-none focus:ring-2 focus:ring-green-400`}
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title}</p>
        )}
      </div>

      {/* Duration */}
      <div>
        <label className="block text-gray-700 font-semibold mb-1">Duration (in minutes)</label>
        <input
          type="number"
          placeholder="120"
          min={60}
          value={form.duration_minutes}
          onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })}
          className={`w-full px-4 py-2 border ${
            errors.duration_minutes ? "border-red-500" : "border-gray-300"
          } rounded focus:outline-none focus:ring-2 focus:ring-green-400`}
        />
        {errors.duration_minutes && (
          <p className="text-red-500 text-sm mt-1">{errors.duration_minutes}</p>
        )}
      </div>

      {/* Language */}
      <div>
        <label className="block text-gray-700 font-semibold mb-1">Language</label>
        <input
          type="text"
          placeholder="Tamil"
          value={form.language}
          onChange={(e) => setForm({ ...form, language: e.target.value })}
          className={`w-full px-4 py-2 border ${
            errors.language ? "border-red-500" : "border-gray-300"
          } rounded focus:outline-none focus:ring-2 focus:ring-green-400`}
        />
        {errors.language && (
          <p className="text-red-500 text-sm mt-1">{errors.language}</p>
        )}
      </div>

      {/* Release Date */}
      <div>
        <label className="block text-gray-700 font-semibold mb-1">Release Date</label>
        <input
          type="date"
          value={form.release_date}
          onChange={(e) => setForm({ ...form, release_date: e.target.value })}
          className={`w-full px-4 py-2 border ${
            errors.release_date ? "border-red-500" : "border-gray-300"
          } rounded focus:outline-none focus:ring-2 focus:ring-green-400`}
        />
        {errors.release_date && (
          <p className="text-red-500 text-sm mt-1">{errors.release_date}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-gray-700 font-semibold mb-1">Description</label>
        <textarea
          placeholder="Enter description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className={`w-full px-4 py-2 border ${
            errors.description ? "border-red-500" : "border-gray-300"
          } rounded focus:outline-none focus:ring-2 focus:ring-green-400`}
          rows={2}
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add Movie"}
      </button>
    </form>
  );
}
