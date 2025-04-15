import { useState, useEffect } from "react";
import { rescheduleToken } from "../services/userTokenService";

const RescheduleTokenModal = ({ token, onClose, onUpdate }) => {
  const [newTime, setNewTime] = useState("");
  const [newDate, setNewDate] = useState("");
  const [minDate, setMinDate] = useState("");
  const [minTime, setMinTime] = useState(""); 


  useEffect(() => {
    // Disable background scroll
    document.body.style.overflow = "hidden";

    const now = new Date();


    const isoDate = now.toISOString().split("T")[0]; // "2025-04-15"
    const isoTime = now.toTimeString().slice(0, 5);   // "15:43"

    setMinDate(isoDate);
    setMinTime(isoTime);
    setNewDate(isoDate); // default to today


    return () => {
      document.body.style.overflow = "auto"; // Restore scroll
    };
  }, []);

  const handleReschedule = async () => {
    if (!newDate || !newTime) {
      alert("Please select a new date and time.");
      return;
    }

    
  // Combine selected date and time into a Date object
  const selectedDateTime = new Date(`${newDate}T${newTime}`);
  const now = new Date();

  if (selectedDateTime <= now) {
    alert("You cannot select a past date or time.");
    return;
  }

    try {
      await rescheduleToken(token.id, newTime, newDate);
      alert("Token rescheduled successfully!");
      onUpdate();
      onClose();
    } catch (error) {
      alert(error.response?.data || "Failed to reschedule token.");
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-gray-300 bg-opacity-100 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-full">
        <h2 className="text-xl font-bold mb-4">Reschedule Token</h2>
        <p><strong>Current Date & Time:</strong>{new Date().toLocaleString()}</p>

        <div className="mt-4">
          <label className="block text-sm mb-1">New Date:</label>
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="border p-2 rounded w-full"
            min={minDate}  // Prevent selecting past dates
          />
        </div>

        <div className="mt-2">
          <label className="block text-sm mb-1">New Time:</label>
          <input
            type="time"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            className="border p-2 rounded w-full"
            min={newDate === minDate ? minTime : undefined}
          />
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={handleReschedule}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Confirm
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default RescheduleTokenModal;
