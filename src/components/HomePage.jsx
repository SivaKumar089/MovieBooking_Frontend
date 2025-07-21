import React from "react";
import { Link } from "react-router-dom";
import { FaFilm, FaTicketAlt, FaTheaterMasks } from "react-icons/fa";

export default function HomePage() {
  return (
    <div
      className="min-h-screen bg-gradient-to-r from-blue-200 via-purple-100 to-pink-200 flex flex-col justify-center items-center p-8 text-center"
      data-aos="fade-in"
    >
      <div className="flex items-center gap-4 mb-6">
        <img
          src="/website_icon.png"
          alt="BookIt Logo"
          className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-md"
        />
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-indigo-800">
          Book<span className="text-red-600">It</span> App
        </h1>
      </div>

      <p className="text-lg md:text-xl text-gray-700 max-w-xl mb-8">
        Book your favorite movie tickets with ease! Explore theaters, shows, and
        seats—all in one place.
      </p>

      <div className="flex flex-wrap justify-center gap-4">
        <Link
          to="/auth/signup"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full text-lg shadow-md transition-all duration-300"
        >
          Get Started
        </Link>
        <Link
          to="/auth/login"
          className="bg-white hover:bg-gray-100 text-indigo-700 px-6 py-3 rounded-full text-lg border border-indigo-600 transition-all duration-300"
        >
          Browse Theaters
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16">
        <div
          className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
          data-aos="zoom-in"
        >
          <FaTheaterMasks className="text-4xl text-indigo-600 mx-auto mb-2" />
          <h3 className="font-semibold text-lg">Choose Theater</h3>
        </div>
        <div
          className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
          data-aos="zoom-in"
          data-aos-delay="100"
        >
          <FaFilm className="text-4xl text-indigo-600 mx-auto mb-2" />
          <h3 className="font-semibold text-lg">Select Movie</h3>
        </div>
        <div
          className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
          data-aos="zoom-in"
          data-aos-delay="200"
        >
          <FaTicketAlt className="text-4xl text-indigo-600 mx-auto mb-2" />
          <h3 className="font-semibold text-lg">Book Tickets</h3>
        </div>
      </div>
    </div>
  );
}
