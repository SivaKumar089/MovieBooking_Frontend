import { useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaSignOutAlt, FaSpinner, FaArrowLeft } from "react-icons/fa";

export default function Logout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = () => {
    setLoggingOut(true);

    setTimeout(() => {
      dispatch(logout());
      toast.success("Logout successful! 👋", {
        position: "top-right",
        autoClose: 2000,
      });
      navigate("/auth/login");
    }, 1500);
  };

  const handleBack = () => {
    navigate(-1); // Go back one page
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm text-center border border-gray-200">
        {loggingOut ? (
          <>
            <FaSpinner className="animate-spin text-yellow-500 text-4xl mx-auto mb-4" />
            <h1 className="text-xl font-semibold mb-2 text-gray-800">
              Logging you out...
            </h1>
            <p className="text-gray-500">Please wait a moment</p>
          </>
        ) : (
          <>
            <FaSignOutAlt className="text-red-500 text-4xl mx-auto mb-4" />
            <h1 className="text-xl font-semibold mb-4 text-gray-800">
              Are you sure you want to logout?
            </h1>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md text-sm font-medium transition"
              >
                <FaArrowLeft size={14} />
                Back
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm font-medium transition"
              >
                <FaSignOutAlt size={14} />
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
