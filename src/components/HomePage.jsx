import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaFilm,
  FaTicketAlt,
  FaTheaterMasks,
  FaShieldAlt,
  FaSearch,
  FaFire,
  FaClock,
  FaStar,
  FaArrowRight,
  FaCheckCircle,
  FaBrain,
  FaEye,
  FaLock,
  FaQrcode,
} from "react-icons/fa";
import axios from "../utils/axios";
import { useSelector } from "react-redux";
import TicketScannerModal from "./TicketScannerModal";

export default function HomePage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [scannerOpen, setScannerOpen] = useState(false);
  const role = useSelector((state) => state.auth.user?.role);

  useEffect(() => {
    axios
      .get("movies/")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setFeaturedMovies(res.data.slice(0, 4));
        }
      })
      .catch((err) => console.log("Failed to fetch featured movies", err));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate("/user/movies", { state: { search: searchTerm } });
    } else {
      navigate("/user/movies");
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col justify-between -m-4 sm:-mx-8 -my-6 overflow-hidden">
      {/* Hero Section with Cinematic Calibrated Lighting */}
      <section className="relative px-6 py-20 lg:py-24 flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Soft Ambient Spotlight (subtle warm illumination, gentle ocular ergonomics) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[540px] h-[320px] bg-gradient-to-b from-amber-500/8 via-amber-900/3 to-transparent blur-3xl pointer-events-none -z-10 rounded-full" />

        {/* Floating pill badge */}
        <div
          data-aos="fade-down"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-800/80 text-amber-400/90 text-xs font-semibold uppercase tracking-wider mb-6 shadow-sm"
        >
          <FaShieldAlt className="text-amber-400/90" size={12} />
          <span>Zero Double-Booking Concurrency Guaranteed</span>
        </div>

        {/* Hero Headline — Refined Typographic Scale */}
        <h1
          data-aos="fade-up"
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl text-white mb-6 leading-tight"
        >
          Book Your Next <br />
          <span className="bg-gradient-to-r from-amber-100 via-amber-300 to-amber-400 bg-clip-text text-transparent">
            Cinematic Experience
          </span>
        </h1>

        <p
          data-aos="fade-up"
          data-aos-delay="100"
          className="text-base sm:text-lg text-slate-400 max-w-2xl mb-10 leading-relaxed font-normal"
        >
          Reserve luxury VIP recliners, IMAX screens, and standard seats in
          real-time. High-concurrency architecture that guarantees your seat stays yours.
        </p>

        {/* Interactive Search Bar */}
        <form
          onSubmit={handleSearch}
          data-aos="fade-up"
          data-aos-delay="150"
          className="w-full max-w-xl relative flex items-center mb-6 shadow-lg shadow-black/40"
        >
          <div className="absolute left-4 text-slate-500 pointer-events-none">
            <FaSearch />
          </div>
          <input
            type="text"
            placeholder="Search movies, genres, or theaters in Bengaluru..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-800/90 hover:border-slate-700 focus:border-amber-400/70 text-slate-100 pl-11 pr-32 py-4 rounded-2xl text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-amber-400/20 backdrop-blur-md transition placeholder:text-slate-500"
          />
          <button
            type="submit"
            className="absolute right-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-sm transition duration-200 shadow-sm shadow-amber-500/15 flex items-center gap-1.5 cursor-pointer"
          >
            Find Shows
          </button>
        </form>

        {/* Fast Category Filter Chips */}
        <div
          data-aos="fade-up"
          data-aos-delay="200"
          className="flex flex-wrap items-center justify-center gap-2 text-xs font-medium text-slate-400 mb-12"
        >
          <span className="text-slate-500 font-semibold mr-1">Trending:</span>
          {["All Movies", "Sci-Fi", "Action", "IMAX 3D", "English", "Bengaluru Theaters"].map(
            (chip, i) => (
              <button
                key={i}
                onClick={() => navigate("/user/movies")}
                className="px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800/80 hover:border-slate-700 hover:text-slate-200 transition cursor-pointer"
              >
                {chip}
              </button>
            )
          )}
        </div>

        {/* CTA Buttons */}
        <div data-aos="fade-up" data-aos-delay="250" className="flex flex-wrap gap-4 justify-center">
          <Link
            to="/user/movies"
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-7 py-3.5 rounded-xl shadow-md shadow-amber-500/15 flex items-center gap-2 text-sm sm:text-base transition transform hover:-translate-y-0.5"
          >
            <FaFilm /> Browse Now Showing
          </Link>
          <Link
            to="/user/theaters"
            className="bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 font-semibold px-7 py-3.5 rounded-xl text-sm sm:text-base transition flex items-center gap-2"
          >
            <FaTheaterMasks /> View Theaters
          </Link>
          {(role === "owner" || role === "admin") && (
            <button
              onClick={() => setScannerOpen(true)}
              className="bg-slate-900/90 hover:bg-slate-800 text-amber-400/90 hover:text-amber-300 border border-amber-500/25 hover:border-amber-500/40 font-semibold px-6 py-3.5 rounded-xl text-sm sm:text-base transition flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <FaQrcode /> Gate Pass Scanner
            </button>
          )}
        </div>
      </section>

      {/* Engineering & Reliability Proof Bar — Balanced Subtle Contrast */}
      <section className="border-y border-slate-800/60 bg-slate-900/30 py-8 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div data-aos="zoom-in" className="p-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 mb-1">0%</div>
            <div className="text-xs sm:text-sm text-slate-400 font-medium">Double-Bookings</div>
          </div>
          <div data-aos="zoom-in" data-aos-delay="100" className="p-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-100 mb-1">100 Seats</div>
            <div className="text-xs sm:text-sm text-slate-400 font-medium">Auto Grid Generation</div>
          </div>
          <div data-aos="zoom-in" data-aos-delay="200" className="p-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 mb-1">3 Tiers</div>
            <div className="text-xs sm:text-sm text-slate-400 font-medium">VIP, Premium & Standard</div>
          </div>
          <div data-aos="zoom-in" data-aos-delay="300" className="p-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-100 mb-1">Atomic</div>
            <div className="text-xs sm:text-sm text-slate-400 font-medium">ACID Row-Level Locks</div>
          </div>
        </div>
      </section>

      {/* HUMAN PSYCHOLOGY & COGNITIVE DESIGN SECTION */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full" id="human-psychology">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div
            data-aos="fade-down"
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4"
          >
            <FaBrain size={12} className="text-amber-400" />
            <span>Human Psychology & Cinema Ergonomics</span>
          </div>
          <h2
            data-aos="fade-up"
            className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4"
          >
            Engineered for Calm Minds & Confident Choices
          </h2>
          <p
            data-aos="fade-up"
            data-aos-delay="100"
            className="text-sm sm:text-base text-slate-400 leading-relaxed font-normal"
          >
            We analyzed how human decision-making, visual perception, and anxiety patterns behave during cinema booking.
            Every screen is intentionally structured to reduce cognitive friction, eliminate booking fatigue, and provide complete peace of mind.
          </p>
        </div>

        {/* 4 Core Human Psychology Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pillar 1: Cognitive Load Reduction */}
          <div
            data-aos="fade-up"
            data-aos-delay="100"
            className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between shadow-lg"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-center text-amber-400 mb-4">
                <FaBrain size={18} />
              </div>
              <span className="text-[11px] font-bold text-amber-400/90 uppercase tracking-wider block mb-1">
                Miller’s & Hick’s Law
              </span>
              <h3 className="text-lg font-bold text-white mb-2">
                Cognitive Load Reduction
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                Traditional platforms overwhelm moviegoers with countdown timers and popups.
                We reduce mental bandwidth to a calm 3-step progressive flow: discover, choose seat, and confirm.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-medium">Design Heuristic</span>
              <span className="text-slate-300 font-bold bg-slate-800 px-2 py-0.5 rounded">
                Zero Sensory Clutter
              </span>
            </div>
          </div>

          {/* Pillar 2: Visual Ergonomics & Calm Lighting */}
          <div
            data-aos="fade-up"
            data-aos-delay="150"
            className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between shadow-lg"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-center text-amber-400 mb-4">
                <FaEye size={18} />
              </div>
              <span className="text-[11px] font-bold text-amber-400/90 uppercase tracking-wider block mb-1">
                Photopic Adaptation
              </span>
              <h3 className="text-lg font-bold text-white mb-2">
                Visual Comfort & Restraint
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                Calibrated dark theme designed for dim ambient cinema lighting.
                We replace aggressive contrast and blinding white backgrounds with balanced slate neutrals and gentle warm gold accents to prevent ocular fatigue.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-medium">Palette Balance</span>
              <span className="text-slate-300 font-bold bg-slate-800 px-2 py-0.5 rounded">
                60-30-10 Dark Slate
              </span>
            </div>
          </div>

          {/* Pillar 3: Psychological Safety & Trust */}
          <div
            data-aos="fade-up"
            data-aos-delay="200"
            className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between shadow-lg"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-center text-amber-400 mb-4">
                <FaShieldAlt size={18} />
              </div>
              <span className="text-[11px] font-bold text-amber-400/90 uppercase tracking-wider block mb-1">
                Loss Aversion Defense
              </span>
              <h3 className="text-lg font-bold text-white mb-2">
                Zero-Anxiety Concurrency
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                The greatest frustration during popular releases is race condition seat loss.
                Our ACID row-level locking provides instant psychological safety: your chosen seat is mathematically locked to you the instant you tap.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-medium">Confidence Guarantee</span>
              <span className="text-slate-300 font-bold bg-slate-800 px-2 py-0.5 rounded">
                Atomic DB Locks
              </span>
            </div>
          </div>

          {/* Pillar 4: Clear Feedback & Privacy Gate Pass */}
          <div
            data-aos="fade-up"
            data-aos-delay="250"
            className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between shadow-lg"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-center text-amber-400 mb-4">
                <FaCheckCircle size={18} />
              </div>
              <span className="text-[11px] font-bold text-amber-400/90 uppercase tracking-wider block mb-1">
                Predictable Mental Models
              </span>
              <h3 className="text-lg font-bold text-white mb-2">
                Instant Verification Pass
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                Every booking generates a verified, privacy-safe QR code.
                At the cinema gate, authorized verification checks the ticket against the database and reveals strictly the Ticket ID and ID Name without exposing personal data.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-medium">Gate Security</span>
              <span className="text-slate-300 font-bold bg-slate-800 px-2 py-0.5 rounded">
                Privacy-First QR
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Movies Showcase */}
      {Array.isArray(featuredMovies) && featuredMovies.length > 0 && (
        <section className="py-16 px-6 max-w-7xl mx-auto w-full">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
                <FaFire /> In Cinemas Now
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Featured Releases
              </h2>
            </div>
            <Link
              to="/user/movies"
              className="text-amber-400 hover:text-amber-300 text-sm font-semibold flex items-center gap-1.5 transition"
            >
              View All <FaArrowRight size={12} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredMovies.map((movie) => (
              <div
                key={movie.id}
                onClick={() => navigate("/user/shows", { state: { movieId: movie.id } })}
                className="group bg-slate-900/80 rounded-2xl overflow-hidden border border-slate-800 hover:border-slate-700 transition duration-300 cursor-pointer shadow-lg flex flex-col"
              >
                <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-800">
                  <img
                    src={
                      movie.poster_url ||
                      "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600"
                    }
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-amber-400 text-xs font-bold flex items-center gap-1 border border-slate-800">
                    <FaStar size={11} /> {movie.rating || "8.5"}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      {movie.genre || "Action / Drama"}
                    </span>
                    <h3 className="font-bold text-base text-white group-hover:text-amber-400 transition truncate">
                      {movie.title}
                    </h3>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <FaClock size={11} className="text-slate-500" />
                      {movie.duration_minutes}m
                    </span>
                    <span className="text-amber-400 font-semibold group-hover:underline">
                      Book Seats →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 px-6 text-center text-xs text-slate-500">
        <p className="mb-2">
          Designed with Psychology & Engineering Excellence by{" "}
          <span className="font-bold text-slate-300">Siva Kumar</span>
        </p>
        <p className="text-[11px] text-slate-600">
          Bookit Cinema System • ACID Concurrency • Cognitive Ergonomics • SQLite/PostgreSQL • React 19
        </p>
      </footer>

      {/* Ticket Scanner Modal */}
      <TicketScannerModal isOpen={scannerOpen} onClose={() => setScannerOpen(false)} />
    </div>
  );
}
