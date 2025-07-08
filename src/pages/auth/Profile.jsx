import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { toast } from "react-toastify";

export default function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    axios
      .get("/profile/")
      .then((res) => setProfile(res.data))
      .catch(() => toast.error("Error loading profile"));
  }, []);

  return (
    <div
      data-aos="fade-in"
      className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md"
    >
      <h1 className="text-2xl font-semibold text-center mb-4">Profile</h1>
      {profile ? (
        <pre className="bg-gray-100 p-4 rounded text-sm">
          {JSON.stringify(profile, null, 2)}
        </pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
