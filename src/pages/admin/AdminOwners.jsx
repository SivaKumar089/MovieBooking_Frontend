import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import {
  FaEnvelope,
  FaUserTie,
  FaSearch,
  FaTheaterMasks,
  FaSpinner,
  FaBuilding,
} from "react-icons/fa";

export default function AdminOwners() {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    axios
      .get("signup/?role=owner")
      .then((res) => setOwners(res.data))
      .catch((err) => console.error("Failed to load owners", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredOwners = owners.filter(
    (o) =>
      (o.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (o.username || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6" data-aos="fade-up">
      {/* Top Banner & Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 backdrop-blur-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FaUserTie className="text-amber-400" /> Cinema Owners & Operators
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Franchise holders and independent theater operator accounts
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-72">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
            <input
              type="text"
              placeholder="Search by operator or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs pl-9 pr-3.5 py-2.5 rounded-xl focus:outline-none focus:border-amber-400/80 placeholder:text-slate-600 transition"
            />
          </div>
          <span className="hidden sm:inline-flex items-center px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-amber-400 font-mono">
            {filteredOwners.length} Partners
          </span>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
          <FaSpinner className="animate-spin text-amber-400 text-3xl mb-3" />
          <p className="text-sm">Loading theater operators...</p>
        </div>
      ) : filteredOwners.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-slate-850 p-8">
          <FaUserTie className="text-slate-600 text-4xl mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-300">No Operators Found</h3>
          <p className="text-xs text-slate-500 mt-1">
            {search ? `No operators match "${search}"` : "No theater owners registered yet."}
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredOwners.map((owner) => {
            const initials = (owner.username || owner.email || "O")
              .slice(0, 2)
              .toUpperCase();

            return (
              <div
                key={owner.id}
                className="bg-slate-900/90 rounded-2xl border border-slate-800 hover:border-amber-500/40 p-5 shadow-xl transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500/20 to-amber-300/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-sm">
                    {initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition truncate">
                        {owner.username}
                      </h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase">
                        Partner
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate flex items-center gap-1.5 mt-0.5">
                      <FaEnvelope className="text-slate-500 text-[10px]" />
                      <span className="truncate">{owner.email}</span>
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                    <FaBuilding className="text-amber-400" />
                    <span>Theaters Managed:</span>
                    <span className="font-mono text-amber-400 font-bold">
                      {owner.theater_count || 1}
                    </span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">ID #{owner.id}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
