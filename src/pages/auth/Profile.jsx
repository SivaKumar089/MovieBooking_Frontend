import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { toast } from "react-toastify";
import { FaUserCircle, FaEnvelope, FaUserTag } from "react-icons/fa";

export default function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    axios
      .get("profile/")
      .then((res) => setProfile(res.data))
      .catch(() => toast.error("Error loading profile"));
  }, []);

  return profile ? (
    <div className="min-h-screen bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 flex items-center justify-center px-4 py-12">
      <div className="bg-white/30 backdrop-blur-md border border-white/40 shadow-2xl rounded-3xl p-8 w-full max-w-lg">
        <div className="flex flex-col items-center text-center space-y-4">
          <FaUserCircle className="text-[80px] text-indigo-600" />
          <h1 className="text-3xl font-extrabold text-gray-800">
            {profile.username}
          </h1>
        </div>

        <div className="mt-8 space-y-5 text-left text-gray-700">
          <div className="flex items-center gap-3">
            <FaEnvelope className="text-indigo-600" />
            <span className="text-md break-all">{profile.email}</span>
          </div>

          <div className="flex items-center gap-3">
            <FaUserTag className="text-indigo-600" />
            <span className="text-md capitalize">Role: {profile.role}</span>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <p className="text-gray-400 text-xl">Loading profile...</p>
    </div>
  );
}
