import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import { IoMdArrowRoundForward,IoMdArrowRoundBack } from "react-icons/io";

const TokenHistory = () => {
  const [tokenHistory, setTokenHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const tokensPerPage = 5;

  // Filter states
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedService, setSelectedService] = useState("");

  const navigate = useNavigate();
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

  useEffect(() => {
    applyFilters();
  }, [selectedDate, selectedStatus, selectedService, tokenHistory]);

  const fetchTokenHistory = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8081/api/v1/token/tokenHistory/${userId}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTokenHistory(response.data);
      setFilteredHistory(response.data); // Set initial filtered data
    } catch (err) {
      setError("Failed to fetch token history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filteredData = tokenHistory.filter(
      (token) => token.status !== "ACTIVE" && token.status !== "PENDING"
    );

    if (selectedDate) {
      filteredData = filteredData.filter((token) =>
        token.issuedTime.startsWith(selectedDate)
      );
    }
    if (selectedStatus) {
      filteredData = filteredData.filter((token) => token.status === selectedStatus);
    }
    if (selectedService) {
      filteredData = filteredData.filter((token) =>
        token.staffId?.service?.serviceName
          ?.toLowerCase()
          .includes(selectedService.toLowerCase())
      );
    }
    setFilteredHistory(filteredData);
    setCurrentPage(1); // Reset to first page after filtering
  };

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

  // Pagination Logic
  const totalPages = Math.ceil(filteredHistory.length / tokensPerPage);
  const indexOfLastToken = currentPage * tokensPerPage;
  const indexOfFirstToken = indexOfLastToken - tokensPerPage;
  const currentTokens = filteredHistory.slice(indexOfFirstToken, indexOfLastToken);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Navbar />

      <div className="p-6">
        {/* Back Button */}
        <button
          className="bg-blue-500 text-white px-3 py-2 rounded-md mb-4"
          onClick={() => navigate("/user")}
        >
          <IoMdArrowRoundBack />
        </button>

        {/* Heading + Filters */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Token History</h2>
          {/* Filters */}
          <div className="flex gap-4">
            <input
              type="date"
              className="border p-2 rounded-md"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            <select
              className="border p-2 rounded-md"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="COMPLETED">Completed</option>
              <option value="SKIPPED">Skipped</option>
            </select>
            <input
              type="text"
              className="border p-2 rounded-md"
              placeholder="Search by Service Name"
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
            />
          </div>
        </div>

        {/* Data Display Section */}
        {loading ? (
          <p>Loading history...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : currentTokens.length === 0 ? (
          <p className="text-gray-500">No token history found.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="py-4 px-6 text-left">Token ID</th>
                    <th className="py-4 px-6 text-left">Service</th>
                    <th className="py-4 px-6 text-left">Status</th>
                    <th className="py-4 px-6 text-left">Issued Date</th>
                    <th className="py-4 px-6 text-left">Completed Date</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTokens.map((token) => (
                    <tr key={token.id} className="border-b hover:bg-gray-100 text-gray-700">
                      <td className="py-4 px-6 font-medium text-gray-800">{token.id}</td>
                      <td className="py-4 px-6">{token.staffId?.service?.serviceName || "N/A"}</td>
                      <td className="py-4 px-6">{token.status}</td>
                      <td className="py-4 px-6">{formatDateTime(token.issuedTime)}</td>
                      <td className="py-4 px-6">{formatDateTime(token.completedTime)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-4 gap-2">
                <button onClick={handlePrevPage} disabled={currentPage === 1} className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-md disabled:opacity-50">
                <IoMdArrowRoundBack />
                </button>
                <span className="font-bold bg-blue-400 px-3 py-1 rounded-md ">{currentPage}</span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages} className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-md disabled:opacity-50">
                <IoMdArrowRoundForward />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TokenHistory;
