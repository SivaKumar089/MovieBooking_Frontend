import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { FaEnvelope, FaUserShield, FaSearch, FaUser } from "react-icons/fa";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get("signup/?role=user")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Failed to fetch users", err));
  }, []);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-8" data-aos="fade-up">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-gray-800">👤 Admin - Users</h1>
        <div className="relative mt-4 sm:mt-0 w-full sm:w-1/2">
          <FaSearch className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search users by email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {users
          .filter((u) => u.email.toLowerCase().includes(search.toLowerCase()))
          .map((user) => (
            <div
              key={user.id}
              className="bg-gradient-to-br from-white via-blue-50 to-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 p-6"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <FaUser className="text-blue-700 text-xl" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {user.username}
                  </h2>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-600">
                <FaUserShield className="text-green-600" />
                <span className="capitalize">
                  Role:{" "}
                  <span className="font-medium text-gray-800">{user.role}</span>
                </span>
              </div>
            </div>
          ))}
      </div>
      {users.length === 0 && (
        <p className="text-center text-gray-500">No users found.</p>
      )}
    </div>
  );
}
