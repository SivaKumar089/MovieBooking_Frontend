import React, { useState } from "react";
import axios from "../../utils/axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { FaTheaterMasks, FaMapMarkerAlt, FaPlus, FaSpinner, FaTv, FaVolumeUp } from "react-icons/fa";

export function AddTheater() {
  const [form, setForm] = useState({ name: "", location: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const ownerId = useSelector((state) => state.auth.user?.user_id);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Theater hall name is required.";
    if (!form.location.trim()) newErrors.location = "City and area location is required.";
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
      await axios.post("theaters/", { ...form, owner: ownerId });
      toast.success("🏢 Cinema Theater Auditorium registered successfully!");
      setForm({ name: "", location: "" });
      setErrors({});
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to register theater. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-4 max-w-2xl mx-auto" data-aos="fade-up">
      <div className="mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
          <FaTheaterMasks /> Property Registration
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Register New Cinema Hall
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Add an auditorium to your multiplex fleet with Dolby Atmos & IMAX support
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-slate-900/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-5"
      >
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Multiplex / Theater Name
          </label>
          <div className="relative">
            <FaTheaterMasks className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs pointer-events-none" />
            <input
              type="text"
              placeholder="e.g. PVR Forum Rex Walk, IMAX Screen 1"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={`w-full bg-slate-950/80 border ${
                errors.name ? "border-red-500" : "border-slate-800 focus:border-amber-400"
              } text-slate-100 pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition placeholder:text-slate-500`}
            />
          </div>
          {errors.name && (
            <p className="text-xs text-red-400 mt-1 font-medium">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Full Address & Area
          </label>
          <div className="relative">
            <FaMapMarkerAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs pointer-events-none" />
            <input
              type="text"
              placeholder="e.g. Brigade Road, Ashok Nagar, Bengaluru"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className={`w-full bg-slate-950/80 border ${
                errors.location ? "border-red-500" : "border-slate-800 focus:border-amber-400"
              } text-slate-100 pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition placeholder:text-slate-500`}
            />
          </div>
          {errors.location && (
            <p className="text-xs text-red-400 mt-1 font-medium">{errors.location}</p>
          )}
        </div>

        {/* Feature Highlights Note */}
        <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-2xl text-xs text-slate-400 space-y-1.5">
          <div className="font-semibold text-slate-200">Default Configuration Applied:</div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            <span>Standard 100-Seat Auto Grid Generation (Rows A through J)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
            <span>VIP Recliners (Rows A-B), Premium Club (Rows C-F), Classic (Rows G-J)</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold py-3.5 rounded-xl shadow-lg shadow-amber-500/20 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer text-sm disabled:opacity-50"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin text-base" />
              <span>Configuring Venue...</span>
            </>
          ) : (
            <>
              <FaPlus />
              <span>Register Cinema Hall</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
