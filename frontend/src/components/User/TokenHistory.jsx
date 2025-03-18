import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import Navbar from "../Navbar";

const TokenHistory = () => {
  const [tokenHistory, setTokenHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate(); // Initialize navigate hook
  const token = Cookies.get("jwtToken");

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const parts = decodedToken.sub.split("/");
        if (parts.length > 1) {
          const userIdPart = parts[1].split(":")[0];
          setUserId(parseInt(userIdPart, 10));
        }
      } catch (error) {
        console.error("Error decoding JWT:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchTokenHistory();
    }
  }, [userId]);

  /**
   * Fetch user's token history.
   */
  const fetchTokenHistory = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8081/api/v1/token/getRequestedTokenByUserId/${userId}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });

      setTokenHistory(response.data);
    } catch (err) {
      setError("Failed to fetch token history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
    //   second: "2-digit",
      hour12: false,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Navbar />

      <div className="p-6">
        {/* Back Button */}
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4"
          onClick={() => navigate("/user")} // Redirects back to User Home Page
        >
          ← Back to Dashboard
        </button>

        <h2 className="text-2xl font-bold mb-4">Token History</h2>

        {loading ? (
          <p>Loading history...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : tokenHistory.length === 0 ? (
          <p className="text-gray-500">No token history found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="py-2 px-4">Token ID</th>
                  <th className="py-2 px-4">Service</th>
                  <th className="py-2 px-4">Status</th>
                  <th className="py-2 px-4">Issued Date</th>
                  <th className="py-2 px-4">Completed Date</th>
                </tr>
              </thead>
              <tbody>
                {tokenHistory.map((token) => (
                  <tr key={token.id} className="border-b hover:bg-gray-100 text-gray-700">
                    <td className="py-2 px-4 text-center">{token.id}</td>
                    <td className="py-2 px-4 text-center">{token.staffId?.service?.serviceName || "N/A"}</td>
                    <td className="py-2 px-4 text-center">{token.status}</td>
                    <td className="py-2 px-4 text-center">{formatDateTime(token.issuedTime)}</td>
                    <td className="py-2 px-4 text-center">{formatDateTime(token.completedTime)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenHistory;
