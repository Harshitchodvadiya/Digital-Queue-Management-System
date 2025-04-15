import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { IoTicketOutline } from "react-icons/io5";
import { fetchStaffList, requestToken } from "../services/userTokenService"; 

const TokenRequestForm = ({ onRefresh, onTokenCreated }) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [userId, setUserId] = useState("");
  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const token = Cookies.get("jwtToken");

  useEffect(() => {
    const init = async () => {
      if (!token) {
        setError("Authentication error. Please log in again.");
        return;
      }
      try {
        const decodedToken = jwtDecode(token);
        const subParts = decodedToken.sub.split("/");
        if (subParts.length > 1) {
          const extractedId = parseInt(subParts[1].split(":")[0], 10);
          setUserId(extractedId);
        } else {
          setError("Invalid token format. Please log in again.");
        }
      } catch (err) {
        setError("Failed to decode authentication token.");
      }
    };

    init();
  }, [token]);

  useEffect(() => {
    const loadStaff = async () => {
      setLoading(true);
      try {
        const staffData = await fetchStaffList();
        setStaffList(staffData);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch staff members. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadStaff();
  }, []);

  const handleRequest = async () => {
    if (!userId || !selectedStaff || !date || !time) {
      alert("Please fill all fields (service, date, and time).");
      return;
    }
    const issuedTime = `${date}T${time}:00`;

     // Combine selected date and time into a Date object
    const selectedDateTime = new Date(`${date}T${time}`);
    const now = new Date();

    if (selectedDateTime < now) {
      alert("You cannot select a past date or time.");
      return;
    }


    try {
      const response = await requestToken({
        userId,
        staffId: selectedStaff.id,
        issuedTime,
      });

      alert("Token requested successfully!");
      onTokenCreated(response); // <-- this updates tokenDetails state immediately
      // 🔥 Immediately update tokenDetails in parent without waiting
      if (onTokenCreated) {
        onTokenCreated(response); // assuming response is the token object
      }

      // Optionally still refresh
      if (onRefresh) {
        console.log('Token requested! Calling onRefresh...')
        onRefresh();
      }

    } catch (error) {
      console.error(error);
      alert(error.response?.data || "Failed to request token.");
    }
  };

  return (
    <div className="flex justify-start w-100">
      <div className="bg-white rounded-lg shadow-md p-6 w-full border border-gray-300">
        <h2 className="text-lg font-bold mb-4">Request a Token</h2>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        {/* Select Staff Dropdown */}
        <select
          className="w-full border p-2 rounded-md mb-3"
          value={selectedStaff?.id || ""}
          onChange={(e) =>
            setSelectedStaff(staffList.find((staff) => staff.id == e.target.value))
          }
        >
          <option value="">-- Select Service --</option>
          {staffList.map((staff) => (
            <option key={staff.id} value={staff.id}>
              {staff.service?.serviceName || "N/A"}
              {staff.service?.estimatedTime ? ` - ${staff.service.estimatedTime} mins` : ""}
            </option>
          ))}
        </select>

        {/* Date and Time Inputs */}
        <input
          type="date"
          className="w-full mb-3 p-2 border rounded focus:outline-none"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          min={new Date().toISOString().split("T")[0]}  // Prevent selecting past dates
        />

        <input
          type="time"
          className="w-full mb-4 p-2 border rounded focus:outline-none"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          min={
            date === new Date().toISOString().split("T")[0]
              ? new Date().toTimeString().slice(0, 5)
              : "00:00"
          }
        />

        {/* Request Token Button */}
        <button
          className="bg-blue-500 px-6 py-3 mt-4 w-full text-white rounded-md font-bold flex items-center justify-center gap-2"
          onClick={handleRequest}
        >
          <IoTicketOutline className="h-6 w-6" />
          Request Token
        </button>

        {/* View History Button */}
        <button
          className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded mt-2"
          onClick={() => navigate("/token-history")}
        >
          View History
        </button>
      </div>
    </div>
  );
};

export default TokenRequestForm;
