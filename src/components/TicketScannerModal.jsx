import React, { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import axios from "../utils/axios";
import { toast } from "react-toastify";
import {
  FaTimes,
  FaCamera,
  FaUpload,
  FaKeyboard,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaSpinner,
  FaShieldAlt,
  FaTicketAlt,
  FaUserCheck,
  FaSyncAlt,
} from "react-icons/fa";

export default function TicketScannerModal({ isOpen, onClose, initialTicketId = null }) {
  const [activeTab, setActiveTab] = useState("camera"); // 'camera' | 'upload' | 'manual'
  const [isScanning, setIsScanning] = useState(false);
  const [scannerError, setScannerError] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [manualInput, setManualInput] = useState(initialTicketId ? String(initialTicketId) : "");
  const [admitting, setAdmitting] = useState(false);

  const qrRegionId = "qr-reader-viewport";
  const html5QrCodeRef = useRef(null);
  const isStoppingRef = useRef(false);

  // If initialTicketId changes, populate manualInput
  useEffect(() => {
    if (initialTicketId) {
      setManualInput(String(initialTicketId));
      handleVerify(initialTicketId);
    }
  }, [initialTicketId]);

  // Clean stop scanner helper
  const stopScanner = async () => {
    if (html5QrCodeRef.current && isScanning && !isStoppingRef.current) {
      try {
        isStoppingRef.current = true;
        await html5QrCodeRef.current.stop();
        await html5QrCodeRef.current.clear();
      } catch (err) {
        console.warn("Scanner stop issue:", err);
      } finally {
        isStoppingRef.current = false;
        setIsScanning(false);
      }
    }
  };

  // Start scanner helper
  const startScanner = async () => {
    setScannerError(null);
    try {
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode(qrRegionId);
      }
      const cameras = await Html5Qrcode.getCameras();
      if (!cameras || cameras.length === 0) {
        setScannerError("No camera detected on this device. Please use Image Upload or Manual Entry.");
        return;
      }

      await html5QrCodeRef.current.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 240, height: 240 } },
        (decodedText) => {
          handleScanSuccess(decodedText);
        },
        () => {
          // ignore per-frame decode misses
        }
      );
      setIsScanning(true);
    } catch (err) {
      console.warn("Failed to start camera:", err);
      setScannerError("Camera access denied or unavailable. Please use Image Upload or Manual Input.");
      setIsScanning(false);
    }
  };

  useEffect(() => {
    if (isOpen && activeTab === "camera" && !verificationResult) {
      const timer = setTimeout(() => {
        startScanner();
      }, 300);
      return () => clearTimeout(timer);
    } else {
      stopScanner();
    }
    return () => {
      stopScanner();
    };
  }, [isOpen, activeTab, verificationResult]);

  const handleScanSuccess = async (decodedText) => {
    await stopScanner();
    handleVerify(decodedText);
  };

  // Image Upload handler
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setVerifying(true);
      const scanner = html5QrCodeRef.current || new Html5Qrcode(qrRegionId);
      html5QrCodeRef.current = scanner;
      const decoded = await scanner.scanFile(file, true);
      handleVerify(decoded);
    } catch (err) {
      toast.error("Could not decode a valid QR code from this image. Please ensure the QR is clear.");
      setVerifying(false);
    }
  };

  // Call verification backend API
  const handleVerify = async (ticketIdentifier, action = "inspect") => {
    if (!ticketIdentifier) {
      toast.warning("Please enter or scan a ticket identifier.");
      return;
    }

    setVerifying(true);
    setScannerError(null);

    try {
      const payload = {
        ticket_id: ticketIdentifier,
        action: action,
      };

      const res = await axios.post("bookings/verify/", payload);
      setVerificationResult(res.data);
      if (action === "admit" && res.data.valid) {
        toast.success(`Entry Confirmed! User admitted: ${res.data.id_name}`);
      }
    } catch (err) {
      console.error("Verification error:", err);
      const errMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Ticket verification failed. Please try again.";
      setVerificationResult({
        valid: false,
        status: "INVALID",
        message: errMsg,
        ticket_id: String(ticketIdentifier),
        id_name: null,
      });
    } finally {
      setVerifying(false);
      setAdmitting(false);
    }
  };

  // Confirm admission action
  const handleConfirmAdmission = async () => {
    if (!verificationResult?.ticket_id) return;
    setAdmitting(true);
    await handleVerify(verificationResult.ticket_id, "admit");
  };

  const handleReset = () => {
    setVerificationResult(null);
    setManualInput("");
    if (activeTab === "camera") {
      setTimeout(startScanner, 200);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden transition-all duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <FaShieldAlt size={16} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Gate Pass Verification
              </h2>
              <p className="text-[11px] text-slate-400">
                Official Cinema Ticket QR Scanner & Validation
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopScanner();
              onClose();
            }}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <FaTimes size={16} />
          </button>
        </div>

        {/* Tab Selection */}
        {!verificationResult && (
          <div className="grid grid-cols-3 border-b border-slate-800 text-xs font-semibold bg-slate-950/30">
            <button
              onClick={() => setActiveTab("camera")}
              className={`py-3 flex items-center justify-center gap-2 border-b-2 transition cursor-pointer ${
                activeTab === "camera"
                  ? "border-amber-400 text-amber-400 bg-slate-800/40"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <FaCamera /> Live Camera
            </button>
            <button
              onClick={() => setActiveTab("upload")}
              className={`py-3 flex items-center justify-center gap-2 border-b-2 transition cursor-pointer ${
                activeTab === "upload"
                  ? "border-amber-400 text-amber-400 bg-slate-800/40"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <FaUpload /> Upload QR
            </button>
            <button
              onClick={() => setActiveTab("manual")}
              className={`py-3 flex items-center justify-center gap-2 border-b-2 transition cursor-pointer ${
                activeTab === "manual"
                  ? "border-amber-400 text-amber-400 bg-slate-800/40"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <FaKeyboard /> Ticket ID
            </button>
          </div>
        )}

        {/* Body Content */}
        <div className="p-6">
          {verifying ? (
            <div className="py-16 text-center text-slate-400">
              <FaSpinner className="animate-spin text-3xl mx-auto text-amber-400 mb-3" />
              <p className="text-sm font-semibold text-slate-200">
                Validating ticket against database...
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Checking atomic booking records & pass status
              </p>
            </div>
          ) : verificationResult ? (
            /* Results Screen — Displaying ONLY Ticket ID and Associated ID Name */
            <div className="space-y-5 animate-fadeIn">
              {/* Status Header Banner */}
              <div
                className={`p-4 rounded-2xl border text-center ${
                  verificationResult.status === "VALID" || verificationResult.status === "ADMITTED"
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                    : verificationResult.status === "ALREADY_USED"
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                    : "bg-red-500/10 border-red-500/30 text-red-300"
                }`}
              >
                <div className="flex items-center justify-center gap-2 text-base font-extrabold uppercase tracking-wider mb-1">
                  {verificationResult.status === "VALID" && (
                    <>
                      <FaCheckCircle className="text-emerald-400 text-lg" />
                      <span>Valid Pass — Ready for Entry</span>
                    </>
                  )}
                  {verificationResult.status === "ADMITTED" && (
                    <>
                      <FaUserCheck className="text-emerald-400 text-lg" />
                      <span>Admission Confirmed</span>
                    </>
                  )}
                  {verificationResult.status === "ALREADY_USED" && (
                    <>
                      <FaExclamationTriangle className="text-amber-400 text-lg" />
                      <span>Already Used Ticket</span>
                    </>
                  )}
                  {verificationResult.status === "CANCELLED" && (
                    <>
                      <FaTimesCircle className="text-red-400 text-lg" />
                      <span>Ticket Cancelled</span>
                    </>
                  )}
                  {verificationResult.status === "EXPIRED" && (
                    <>
                      <FaTimesCircle className="text-slate-400 text-lg" />
                      <span>Pass Expired</span>
                    </>
                  )}
                  {verificationResult.status === "INVALID" && (
                    <>
                      <FaTimesCircle className="text-red-400 text-lg" />
                      <span>Invalid Ticket</span>
                    </>
                  )}
                </div>
                <p className="text-xs text-slate-300 font-medium">
                  {verificationResult.message}
                </p>
              </div>

              {/* Strict Privacy Card: Displaying ONLY Ticket ID and ID Name */}
              <div className="bg-slate-950/80 rounded-2xl border border-slate-800 p-5 divide-y divide-slate-800/80">
                <div className="pb-3 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                    <FaTicketAlt size={12} className="text-amber-400" /> Ticket ID
                  </span>
                  <span className="font-mono text-sm font-bold text-white tracking-wider">
                    {verificationResult.ticket_id || "N/A"}
                  </span>
                </div>

                <div className="pt-3 pb-3 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                    <FaUserCheck size={12} className="text-amber-400" /> Associated ID Name
                  </span>
                  <span className="text-sm font-bold text-amber-300">
                    {verificationResult.id_name || "Unverified / Not Found"}
                  </span>
                </div>

                <div className="pt-3 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Database Status</span>
                  <span
                    className={`font-bold uppercase tracking-wider ${
                      verificationResult.valid ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {verificationResult.status}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2.5 pt-2">
                {verificationResult.status === "VALID" && (
                  <button
                    onClick={handleConfirmAdmission}
                    disabled={admitting}
                    className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/15 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {admitting ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      <FaUserCheck />
                    )}
                    <span>Confirm Admission (Admit User)</span>
                  </button>
                )}

                <button
                  onClick={handleReset}
                  className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FaSyncAlt size={11} /> Scan Another Ticket
                </button>
              </div>

              <div className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1">
                <FaShieldAlt size={10} className="text-slate-400" />
                <span>Privacy Safe: Unnecessary personal information is never exposed.</span>
              </div>
            </div>
          ) : activeTab === "camera" ? (
            /* Live Camera View */
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-square max-w-[280px] mx-auto border border-slate-800 shadow-inner flex items-center justify-center">
                <div id={qrRegionId} className="w-full h-full"></div>
                {!isScanning && !scannerError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 p-4 text-center">
                    <FaCamera size={32} className="mb-2 text-slate-600 animate-pulse" />
                    <span className="text-xs">Initializing camera feed...</span>
                  </div>
                )}
              </div>

              {scannerError && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs text-center">
                  <p>{scannerError}</p>
                  <button
                    onClick={() => setActiveTab("manual")}
                    className="mt-2 text-xs font-bold text-amber-400 underline cursor-pointer"
                  >
                    Switch to Manual ID Input
                  </button>
                </div>
              )}

              <p className="text-center text-[11px] text-slate-400">
                Point your camera directly at the digital or printed ticket QR code
              </p>
            </div>
          ) : activeTab === "upload" ? (
            /* Image Upload View */
            <div className="space-y-4">
              <label className="border-2 border-dashed border-slate-700 hover:border-amber-400/60 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition bg-slate-950/40">
                <FaUpload className="text-3xl text-slate-500 mb-3" />
                <span className="text-sm font-semibold text-white mb-1">
                  Click or drag ticket QR code image
                </span>
                <span className="text-xs text-slate-500">
                  Supports PNG, JPG, WEBP screenshots of tickets
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <div className="text-center text-xs text-slate-400">
                Tip: You can screenshot any ticket pass in My Tickets and upload it here!
              </div>
            </div>
          ) : (
            /* Manual Input View */
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleVerify(manualInput);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Ticket ID or Booking Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1, TKT-1, or BK-A1B2C3D4"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-400/30"
                />
              </div>

              <button
                type="submit"
                disabled={!manualInput.trim()}
                className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/15 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
              >
                <FaShieldAlt /> Verify Ticket in Database
              </button>

              <div className="pt-2 border-t border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-2 font-semibold">
                  Quick Simulation Tests:
                </span>
                <div className="flex flex-wrap gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setManualInput("1");
                      handleVerify("1");
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition"
                  >
                    Test Ticket #1
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setManualInput("INVALID-TICKET-999");
                      handleVerify("INVALID-TICKET-999");
                    }}
                    className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-[11px] transition"
                  >
                    Test Invalid Ticket
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
