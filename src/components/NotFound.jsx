import React from "react";
import { AiOutlineCompass } from "react-icons/ai"; 
import { BiArrowBack } from "react-icons/bi"; 
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-pink-100 px-4">
      <h1
        data-aos="zoom-in"
        className="text-9xl font-extrabold text-blue-600 drop-shadow-lg"
      >
        404
      </h1>

      <p
        data-aos="fade-up"
        data-aos-delay="200"
        className="mt-4 text-2xl text-gray-700 text-center max-w-xl"
      >
        Page not found. The page you are looking for might have been moved or
        deleted.
      </p>

     
      <div
        data-aos="fade-up"
        data-aos-delay="400"
        className="mt-8 w-28 h-28 rounded-full bg-blue-50 shadow-xl flex items-center justify-center"
      >
        <AiOutlineCompass className="text-blue-500 text-5xl animate-bounce" />
      </div>

      <button
        onClick={() => navigate("/")}
        data-aos="fade-up"
        data-aos-delay="600"
        className="mt-10 inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-full shadow-md transition hover:-translate-y-1 duration-200"
      >
        <BiArrowBack className="mr-2 text-lg" />
        Back to Home
      </button>
    </div>
  );
}
