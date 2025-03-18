import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import StaffNavbar from "./StaffNavbar";

const StaffTokenTable = () => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [staffId, setStaffId] = useState(null);
  const [disabledStatus, setDisabledStatus] = useState({}); // Tracks disabled state for all buttons
  const [startClicked, setStartClicked] = useState({}); // Tracks if START was clicked
  const token = Cookies.get("jwtToken");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  useEffect(() => {
    const token = Cookies.get("jwtToken");

    if (!token) {
      setError("Authentication error. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const subParts = decodedToken.sub.split("/");
      if (subParts.length > 1) {
        const extractedId = parseInt(subParts[1].split(":")[0], 10);
        setStaffId(extractedId);
      } else {
        setError("Invalid token format. Please log in again.");
        setLoading(false);
      }
    } catch (error) {
      setError("Failed to decode authentication token.");
      setLoading(false);
    }
  }, []);

    /**
   * Format date and time for better readability.
   */
  const formatDateTime = (isoString) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  useEffect(() => {
    if (!staffId) return;
  
    axios
      .get(`http://localhost:8081/api/v1/token/getTodayTokensByStaffId/${staffId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      })
      .then((response) => {
        setTokens(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load today's token data. Please check permissions.");
        setLoading(false);
      });
  }, [staffId]);
  

  const handleActionClick = async (tokenId, action, currentStatus) => {
    if (!tokenId) return;

    // Disable all buttons if 'Skip' or 'Complete' is clicked
    if (action === "skip" || action === "complete") {
      setDisabledStatus((prev) => ({ ...prev, [tokenId]: true }));
    }

    // START button logic
    if (action === "next") {
      if (currentStatus !== "PENDING") {
        setError("Start action is only allowed for pending tokens.");
        return;
      }
      setStartClicked((prev) => ({ ...prev, [tokenId]: true })); // Enable 'Complete'
    }

    // COMPLETE button logic - Only allow if START was clicked first
    if (action === "complete" && !startClicked[tokenId]) {
      setError("Complete action can only be done after starting the token.");
      return;
    }

    let apiUrl = "";
    let updatedStatus = "";

    switch (action) {
      case "skip":
        apiUrl = `http://localhost:8081/api/v1/token/skipToken/${tokenId}`;
        updatedStatus = "SKIPPED";
        break;
      case "complete":
        apiUrl = `http://localhost:8081/api/v1/token/completeToken/${tokenId}`;
        updatedStatus = "COMPLETED";
        break;
      case "next":
        apiUrl = `http://localhost:8081/api/v1/token/nextToken/${tokenId}`;
        updatedStatus = "ACTIVE";
        break;
      default:
        return;
    }

    try {
      const response = await axios.put(apiUrl, null, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      if (response.status === 200) {
        setTokens((prevTokens) =>
          prevTokens.map((token) =>
            token.id === tokenId
              ? { ...token, status: updatedStatus, appointedTime: new Date().toISOString() }
              : token
          )
        );
      }
    } catch (error) {
      console.error(`Error ${action} token:`, error);
      setError(`Failed to ${action} token. Please try again.`);
      
      // Re-enable buttons on error
      if (action === "skip" || action === "complete") {
        setDisabledStatus((prev) => ({ ...prev, [tokenId]: false }));
      }
    }
  };

  if (loading) return <p className="text-center">Loading tokens...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      <StaffNavbar title="Token List" />

      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-2 px-4">Token ID</th>
                <th className="py-2 px-4">Service</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Issued Date and Time</th>
                <th className="py-2 px-4">Actions</th>
                {/* <th className="py-2 px-4">User ID</th>
                <th className="py-2 px-4">User Name</th>
                <th className="py-2 px-4">Staff ID</th>
                <th className="py-2 px-4">Staff Name</th> */}
              </tr>
            </thead>
            <tbody>
              {tokens.length > 0 ? (
                tokens.map((token) => (
                  <tr key={token.id} className="border-b hover:bg-gray-100 text-gray-700">
                    <td className="py-2 px-4 text-center">{token?.id || "N/A"}</td>
                    <td className="py-2 px-4 text-center">{token.staffId?.service?.serviceName || "N/A"}</td>
                    <td className="py-2 px-4 text-center font-bold">{token.status}</td>
                    <td className="py-2 px-4 text-center font-bold">{formatDateTime(token.issuedTime)}</td>
{/* 
                    <td className="py-2 px-4 text-center">{token.user?.id || "N/A"}</td>
                    <td className="py-2 px-4 text-center">{token.user?.firstname || "N/A"}</td>
                    <td className="py-2 px-4 text-center">{token.staffId?.id || "N/A"}</td>
                    <td className="py-2 px-4 text-center">{token.staffId?.firstname || "N/A"}</td> */}
                    <div className="flex justify-center space-x-2 mt-1.5">
                      <button
                        className="bg-gray-500 text-white px-4 py-1 rounded hover:bg-gray-700"
                        onClick={() => handleActionClick(token.id, "skip")}
                        disabled={disabledStatus[token.id] || token.status === "COMPLETED"} 
                      >
                        Skip
                      </button>

                      <button
                        className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-700"
                        onClick={() => handleActionClick(token.id, "complete", token.status)}
                        disabled={disabledStatus[token.id] || !startClicked[token.id]} 
                      >
                        Complete
                      </button>

                      <button
                        className="bg-blue-400 text-white px-4 py-1 rounded hover:bg-blue-700"
                        onClick={() => handleActionClick(token.id, "next", token.status)}
                        disabled={disabledStatus[token.id] || token.status !== "PENDING"} 
                      >
                        START
                      </button>
                    </div>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center text-gray-500 py-4">
                    No tokens found for this service.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StaffTokenTable;
