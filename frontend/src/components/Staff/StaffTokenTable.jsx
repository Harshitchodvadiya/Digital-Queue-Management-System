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
  const [disabledStatus, setDisabledStatus] = useState({});
  const [startedTokens, setStartedTokens] = useState(new Set()); // Tracks started tokens
  const [activeTokenId, setActiveTokenId] = useState(null); // Tracks the active token
  const token = Cookies.get("jwtToken");

  // Extract Staff ID from JWT
  useEffect(() => {
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

  // Format Date
  const formatDateTime = (isoString) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  // Fetch Today's Tokens
  useEffect(() => {
    if (!staffId) return;

    axios
      .get(`http://localhost:8081/api/v1/token/getTodayTokensByStaffId/${staffId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      })
      .then((response) => {
        setTokens(response.data);
        setActiveTokenId(response.data.find((token) => token.status === "ACTIVE")?.id || null);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load today's token data. Please check permissions.");
        setLoading(false);
      });
  }, [staffId]);

  // Handle Token Actions
  const handleActionClick = async (tokenId, action) => {
    if (!tokenId) return;

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

        if (action === "next") {
          setStartedTokens((prevStartedTokens) => new Set([...prevStartedTokens, tokenId]));
          setActiveTokenId(tokenId);
        } else if (action === "complete" || action === "skip") {
          setActiveTokenId(null); // Clear active token after completion or skip
        }
      }
    } catch (error) {
      console.error(`Error ${action} token:`, error);
      setError(`Failed to ${action} token. Please try again.`);
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
              </tr>
            </thead>
            <tbody>
              {tokens.length > 0 ? (
                tokens.map((token, index) => {
                  const isFirstToken = index === 0;
                  const isPreviousTokenCompletedOrSkipped =
                    isFirstToken || tokens[index - 1].status === "COMPLETED" || tokens[index - 1].status === "SKIPPED";
                  const isActive = token.id === activeTokenId;
                  const isAlreadyStarted = startedTokens.has(token.id);

                  return (
                    <tr key={token.id} className="border-b hover:bg-gray-100 text-gray-700">
                      <td className="py-2 px-4 text-center">{token?.id || "N/A"}</td>
                      <td className="py-2 px-4 text-center">{token.staffId?.service?.serviceName || "N/A"}</td>
                      <td className="py-2 px-4 text-center font-bold">{token.status}</td>
                      <td className="py-2 px-4 text-center font-bold">{formatDateTime(token.issuedTime)}</td>

                      <div className="flex justify-center space-x-2 mt-1.5">
                        <button
                          className="bg-gray-500 text-white px-4 py-1 rounded hover:bg-gray-700"
                          onClick={() => handleActionClick(token.id, "skip")}
                          disabled={!isActive}
                        >
                          Skip
                        </button>

                        <button
                          className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-700"
                          onClick={() => handleActionClick(token.id, "complete")}
                          disabled={!isActive}
                        >
                          Complete
                        </button>

                        <button
                          className="bg-blue-400 text-white px-4 py-1 rounded hover:bg-blue-700"
                          onClick={() => handleActionClick(token.id, "next")}
                          disabled={
                            isAlreadyStarted ||
                            activeTokenId !== null ||
                            !isPreviousTokenCompletedOrSkipped
                          }
                        >
                          START
                        </button>
                      </div>
                    </tr>
                  );
                })
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
