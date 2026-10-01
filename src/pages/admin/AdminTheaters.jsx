import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { FaMapMarkerAlt, FaWarehouse, FaSearch, FaFilm, FaCheckCircle, FaSpinner } from "react-icons/fa";

export default function AdminTheaters() {
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    axios
      .get("theaters/")
      .then((res) => setTheaters(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredTheaters = theaters.filter((t) =>
    t.name?.toLowerCase().includes(search.toLowerCase()) ||
    t.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6" data-aos="fade-up">
      {/* Top Banner & Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 backdrop-blur-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FaWarehouse className="text-amber-400" /> Cinema Venues & Halls
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Overview of all theater partners enrolled in the SeatLock circuit
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-72">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
            <input
              type="text"
              placeholder="Search by venue or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs pl-9 pr-3.5 py-2.5 rounded-xl focus:outline-none focus:border-amber-400/80 placeholder:text-slate-600 transition"
            />
          </div>
          <span className="hidden sm:inline-flex items-center px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-amber-400 font-mono">
            {filteredTheaters.length} Halls
          </span>
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
          <FaSpinner className="animate-spin text-amber-400 text-3xl mb-3" />
          <p className="text-sm">Loading registered theaters...</p>
        </div>
      ) : filteredTheaters.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-slate-850 p-8">
          <FaWarehouse className="text-slate-600 text-4xl mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-300">No Theaters Found</h3>
          <p className="text-xs text-slate-500 mt-1">
            {search ? `No venues match "${search}"` : "No theaters registered yet in the system."}
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTheaters.map((theater) => (
            <div
              key={theater.id}
              className="bg-slate-900/90 rounded-2xl border border-slate-800 hover:border-amber-500/40 p-5 shadow-xl transition-all duration-300 group hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition">
                    <FaWarehouse size={18} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition">
                      {theater.name}
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <FaMapMarkerAlt className="text-rose-400 text-[10px]" />
                      <span>{theater.location}</span>
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  ACTIVE
                </span>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <FaFilm className="text-amber-400/70" /> Multiplex Class
                </span>
                <span className="font-mono text-slate-500">ID: #{theater.id}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
