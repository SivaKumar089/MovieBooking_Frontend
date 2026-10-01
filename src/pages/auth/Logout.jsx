import { useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaSignOutAlt, FaSpinner, FaArrowLeft, FaFilm, FaLock } from "react-icons/fa";

export default function Logout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = () => {
    setLoggingOut(true);

    setTimeout(() => {
      dispatch(logout());
      toast.success("Signed out of SeatLock Cinema. See you at the movies! 🎬", {
        position: "top-right",
        autoClose: 2000,
      });
      navigate("/auth/login");
    }, 1200);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-slate-950 text-slate-100 px-4 relative overflow-hidden">
      {/* Ambient glowing spotlight */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-red-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div
        data-aos="zoom-in"
        className="bg-slate-900/90 backdrop-blur-2xl p-8 sm:p-10 rounded-3xl shadow-2xl w-full max-w-md text-center border border-slate-800 relative z-10"
      >
        {loggingOut ? (
          <div className="py-6">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <FaSpinner className="animate-spin text-amber-400 text-3xl" />
            </div>
            <h1 className="text-xl font-bold mb-2 text-white">
              Concluding Your Session...
            </h1>
            <p className="text-xs text-slate-400 font-light">
              Safely clearing credentials and releasing temporary holds.
            </p>
          </div>
        ) : (
          <div>
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center">
              <FaSignOutAlt className="text-red-400 text-2xl" />
            </div>

            <h1 className="text-xl sm:text-2xl font-bold mb-2 text-white">
              Sign Out from SeatLock?
            </h1>
            <p className="text-xs text-slate-400 mb-8 font-light max-w-xs mx-auto">
              You will need to sign in again to view your tickets or reserve seats.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={handleBack}
                className="w-full sm:w-1/2 flex items-center justify-center gap-2 px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition border border-slate-700 cursor-pointer"
              >
                <FaArrowLeft size={11} />
                Stay Signed In
              </button>
              <button
                onClick={handleLogout}
                className="w-full sm:w-1/2 flex items-center justify-center gap-2 px-5 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-red-600/20 cursor-pointer"
              >
                <FaSignOutAlt size={12} />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
