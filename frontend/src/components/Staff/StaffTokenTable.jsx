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

  /**
   * Extracts the staff ID from the stored JWT token and sets it in state.
   * If the token is missing or invalid, an error message is displayed.
   */
  useEffect(() => {
    const token = Cookies.get("jwtToken");

    if (!token) {
      console.error("Error: JWT token is missing!");
      setError("Authentication error. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      console.log("Decoded Token:", decodedToken);

      const subParts = decodedToken.sub.split("/");
      if (subParts.length > 1) {
        const extractedId = parseInt(subParts[1].split(":")[0], 10);
        setStaffId(extractedId);
        console.log("Extracted Staff ID:", extractedId);
      } else {
        console.error("Error: Invalid token format.");
        setError("Invalid token format. Please log in again.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error decoding JWT:", error);
      setError("Failed to decode authentication token.");
      setLoading(false);
    }
  }, []);

  /**
   * Fetches the list of tokens assigned to the logged-in staff member.
   */
  useEffect(() => {
    if (!staffId) return;

    console.log(`Fetching tokens for staffId: ${staffId}`);

    const token = Cookies.get("jwtToken");

    axios
      .get(`http://localhost:8081/api/v1/token/getRequestedTokenByStaffId/${staffId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      })
      .then((response) => {
        console.log("Token data received:", response.data);
        setTokens(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching tokens:", error);
        setError("Failed to load token data. Please check permissions.");
        setLoading(false);
      });
  }, [staffId]);

  if (loading) return <p className="text-center">Loading tokens...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <StaffNavbar title="Token List" />

      {/* Token List Table */}
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-2 px-4">Token ID</th>
                <th className="py-2 px-4">User ID</th>
                <th className="py-2 px-4">User Name</th>
                <th className="py-2 px-4">Staff ID</th>
                <th className="py-2 px-4">Staff Name</th>
                <th className="py-2 px-4">Service</th>
                <th className="py-2 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {tokens.length > 0 ? (
                tokens.map((token) => (
                  <tr key={token.id} className="border-b hover:bg-gray-100 text-gray-700">
                    <td className="py-2 px-4 text-center">{token?.id || "N/A"}</td>
                    <td className="py-2 px-4 text-center">{token.user?.id || "N/A"}</td>
                    <td className="py-2 px-4 text-center">{token.user?.firstname || "N/A"}</td>
                    <td className="py-2 px-4 text-center">{token.staffId?.id || "N/A"}</td>
                    <td className="py-2 px-4 text-center">{token.staffId?.firstname || "N/A"}</td>
                    <td className="py-2 px-4 text-center">{token.staffId?.service?.serviceName || "N/A"}</td>
                    <td className="py-2 px-4 text-center font-bold">{token.status}</td>
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
