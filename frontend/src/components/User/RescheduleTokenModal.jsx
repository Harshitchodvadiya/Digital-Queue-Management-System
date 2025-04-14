import { useState, useEffect } from "react";
import { rescheduleToken } from "../services/UserTokenService";

const RescheduleTokenModal = ({ token, onClose, onUpdate }) => {
  const [newTime, setNewTime] = useState("");
  const [newDate, setNewDate] = useState("");
  const [currentDateTime, setCurrentDateTime] = useState("");

  useEffect(() => {
    // Disable background scroll
    document.body.style.overflow = "hidden";

    const now = new Date();
    const date = now.toLocaleDateString("en-GB"); // e.g., "14/04/2025"
    const time = now.toTimeString().slice(0, 5);  // e.g., "15:43"
    setCurrentDateTime(`${date.replace(/\//g, "-")} ${time}`);

    return () => {
      document.body.style.overflow = "auto"; // Restore scroll
    };
  }, []);

  const handleReschedule = async () => {
    if (!newDate || !newTime) {
      alert("Please select a new date and time.");
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
        <p><strong>Current Date & Time:</strong> {currentDateTime}</p>

        <div className="mt-4">
          <label className="block text-sm mb-1">New Date:</label>
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="border p-2 rounded w-full"
            min={new Date().toISOString().split("T")[0]}  // Prevent selecting past dates
          />
        </div>

        <div className="mt-2">
          <label className="block text-sm mb-1">New Time:</label>
          <input
            type="time"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            className="border p-2 rounded w-full"
            min={
              newDate === new Date().toISOString().split("T")[0]
                ? new Date().toTimeString().slice(0, 5)
                : "00:00"
            }
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
