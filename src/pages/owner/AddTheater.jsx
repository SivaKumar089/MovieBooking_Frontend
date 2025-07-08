import React, { useState } from "react";
import axios from "../../utils/axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

export function AddTheater() {
  const [form, setForm] = useState({ name: "", location: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  
 const ownerId = useSelector((state) => state.auth.user?.user_id);


  // console.log(
  //   "Redux User:",
  //   useSelector((state) => state.auth.user.user_id)
  // );

  

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.location.trim()) newErrors.location = "Location is required.";
    return newErrors;
  };

  if (!ownerId) {
    toast.error("You must be logged in as an owner to add a theater.");
    return;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      await axios.post("theaters/", { ...form, owner: ownerId });
      toast.success("🏢 Theater added successfully!");
      setForm({ name: "", location: "" });
      setErrors({});
    } catch (err) {
      toast.error("Failed to add theater. Try again.");
    } finally {
      setLoading(false);
      console.log(ownerId)
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6 space-y-5"
      data-aos="fade-up"
    >
      <h1 className="text-3xl font-bold text-green-700">➕ Add Theater</h1>

      {/* Name Field */}
      <div>
        <label className="block text-gray-700 font-semibold mb-1">Name</label>
        <input
          type="text"
          placeholder="Theater Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className={`w-full px-4 py-2 border ${
            errors.name ? "border-red-500" : "border-gray-300"
          } rounded focus:outline-none focus:ring-2 focus:ring-green-400`}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      {/* Location Field */}
      <div>
        <label className="block text-gray-700 font-semibold mb-1">
          Location
        </label>
        <input
          type="text"
          placeholder="Theater Location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          className={`w-full px-4 py-2 border ${
            errors.location ? "border-red-500" : "border-gray-300"
          } rounded focus:outline-none focus:ring-2 focus:ring-green-400`}
        />
        {errors.location && (
          <p className="text-red-500 text-sm mt-1">{errors.location}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add Theater"}
      </button>
    </form>
  );
}
