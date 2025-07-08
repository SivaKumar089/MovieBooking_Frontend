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
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6" data-aos="fade-up">
      <h1 className="text-3xl font-bold text-center sm:text-left">
        👤 Admin - Users
      </h1>

      {/* Search Input */}
      <div className="relative">
        <FaSearch className="absolute top-3 left-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search users by email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* User Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {users
          .filter((u) => u.email.toLowerCase().includes(search.toLowerCase()))
          .map((user) => (
            <div
              key={user.id}
              className="bg-white p-5 rounded-xl shadow hover:shadow-md transition-all duration-200"
            >
              <div className="space-y-2 text-gray-700 text-sm">
                <p className="flex items-center gap-2 font-medium text-blue-700">
                  <FaUser className="text-blue-600" />
                  Username: {user.username}
                </p>
                <p className="flex items-center gap-2">
                  <FaEnvelope className="text-blue-500" />
                  Email: {user.email}
                </p>
                <p className="flex items-center gap-2">
                  <FaUserShield className="text-green-600" />
                  Role: {user.role}
                </p>
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
