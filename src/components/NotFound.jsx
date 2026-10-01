import React from "react";
import { FaFilm, FaArrowLeft, FaCompass, FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-100 px-4 relative overflow-hidden">
      {/* Ambient Cinema Projector Beam */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-b from-amber-500/15 via-sky-500/10 to-transparent blur-3xl pointer-events-none rounded-full"></div>

      <div data-aos="fade-down" className="relative mb-6">
        <div className="w-24 h-24 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-2xl shadow-amber-500/10">
          <FaFilm className="text-amber-400 text-4xl animate-pulse" />
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-slate-950">
          !
        </div>
      </div>

      <h1
        data-aos="zoom-in"
        className="text-8xl sm:text-9xl font-black tracking-tight bg-gradient-to-r from-amber-400 via-orange-400 to-red-500 bg-clip-text text-transparent drop-shadow-2xl"
      >
        404
      </h1>

      <h2
        data-aos="fade-up"
        data-aos-delay="100"
        className="text-2xl sm:text-3xl font-extrabold text-white mt-2 text-center"
      >
        Scene Missing From The Reel
      </h2>

      <p
        data-aos="fade-up"
        data-aos-delay="200"
        className="mt-3 text-sm sm:text-base text-slate-400 text-center max-w-md font-light leading-relaxed"
      >
        The page you are looking for has been cut from the final release or moved to a different theater screen.
      </p>

      <div
        data-aos="fade-up"
        data-aos-delay="300"
        className="mt-8 flex flex-wrap items-center justify-center gap-4"
      >
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold px-6 py-3 rounded-xl shadow-lg shadow-amber-500/20 transition transform hover:-translate-y-0.5 cursor-pointer text-sm"
        >
          <FaHome /> Back to Premiere (Home)
        </button>
        <button
          onClick={() => navigate("/user/movies")}
          className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-semibold px-6 py-3 rounded-xl transition cursor-pointer text-sm"
        >
          <FaFilm /> Browse Now Showing
        </button>
      </div>

      <div className="mt-16 text-xs text-slate-600 font-mono tracking-wider uppercase">
        SeatLock Cinema • HTTP 404 Not Found
      </div>
    </div>
  );
}
