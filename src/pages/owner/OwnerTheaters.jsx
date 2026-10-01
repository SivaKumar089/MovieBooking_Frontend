import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaMapMarkerAlt, FaTheaterMasks, FaPlus, FaTv, FaVolumeUp } from "react-icons/fa";

export function OwnerTheaters() {
  const [theaters, setTheaters] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const ownerId = useSelector((state) => state.auth.user?.user_id);

  useEffect(() => {
    setLoading(true);
    axios
      .get("theaters/")
      .then((res) => {
        setTheaters(res.data);
      })
      .catch((err) => {
        toast.error("Failed to load your theaters");
      })
      .finally(() => setLoading(false));
  }, [ownerId]);

  const filteredTheaters =
    search.trim() === ""
      ? theaters
      : theaters.filter(
          (t) =>
            t.name.toLowerCase().includes(search.toLowerCase()) ||
            t.location.toLowerCase().includes(search.toLowerCase())
        );

  return (
    <div className="py-4" data-aos="fade-up">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <FaTheaterMasks /> Property Management
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            My Cinema Auditoriums
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Overseeing {theaters.length} registered venues and screen configurations
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
          <input
            type="text"
            placeholder="Search theaters by name or area..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 text-slate-200 text-sm pl-9 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-amber-400 placeholder:text-slate-500 transition"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center text-slate-500">
          <div className="w-10 h-10 border-2 border-amber-500/20 border-t-amber-400 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm">Loading auditorium data...</p>
        </div>
      ) : filteredTheaters.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTheaters.map((theater) => (
            <div
              key={theater.id}
              className="bg-slate-900/85 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl hover:border-amber-500/40 transition duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                    Active Multiplex
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    ID: #{theater.id}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <FaTheaterMasks className="text-amber-400 flex-shrink-0" />
                  <span>{theater.name}</span>
                </h2>

                <p className="text-slate-400 text-xs sm:text-sm flex items-start gap-2 mb-4 font-light">
                  <FaMapMarkerAlt className="text-red-400 flex-shrink-0 mt-0.5" />
                  <span>{theater.location}</span>
                </p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  <span className="text-[10px] font-semibold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20 flex items-center gap-1">
                    <FaVolumeUp size={9} /> Dolby Atmos
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                    <FaTv size={9} /> 4K Laser
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Auditorium: Screen 1</span>
                <span className="text-amber-400 font-semibold">100 Seats Active</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-slate-500">
          <FaTheaterMasks className="text-5xl mx-auto mb-3 text-slate-700" />
          <p className="text-lg font-medium text-slate-400">No auditoriums found</p>
          <p className="text-xs mt-1">Register your first cinema property using the sidebar</p>
        </div>
      )}
    </div>
  );
}
