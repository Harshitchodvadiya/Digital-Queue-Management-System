import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie"; 
import {jwtDecode} from "jwt-decode"; // Import JWT decoding library
import Navbar from "../Navbar";

const UserHomePage = () => {
  const [tokenModal, setTokenModal] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);
  const token = Cookies.get("jwtToken");

  // Decode JWT token to extract user ID
  useEffect(() => {
    // Retrieve JWT token from cookies
    const token = Cookies.get("jwtToken");
    console.log("JWT Token from Cookies:", token);

    if (token) {
      try {
        // Decode the JWT
        const decodedToken = jwtDecode(token);
        console.log("Decoded Token:", decodedToken);

        // Extract 'sub' field: "user@gmail.com/15:USER"
        const subValue = decodedToken.sub;
        const parts = subValue.split("/"); // Splitting by '/'
        
        if (parts.length > 1) {
          const userIdPart = parts[1].split(":")[0]; // Extract number before ':'
          console.log("Extracted User ID:", userIdPart);
          setUserId(parseInt(userIdPart, 10)); // Convert to integer
        }
      } catch (error) {
        console.error("Error decoding JWT:", error);
      }
    }
  }, []);

  // Fetch staff list on component mount
  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8081/api/v1/user/userList", {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });

      // Filter only staff members
      const staffData = response.data.filter((user) => user.role === "STAFF");
      setStaffList(staffData);
    } catch (err) {
      setError("Failed to fetch staff members. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle token request
  const requestToken = async () => {
    if (!selectedStaff) {
      alert("Please select a service first.");
      return;
    }

    if (!userId) {
      alert("User ID not found. Please log in again.");
      return;
    }

    const requestBody = {
      user: { id: userId },
      staffId: { id: selectedStaff.id },
      issuedTime: new Date().toISOString(),
    };

    try {
      const response = await axios.post("http://localhost:8081/api/v1/token/requestToken", requestBody, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      alert("Token requested successfully!");
      setTokenModal(false);
    } catch (error) {
      alert(error.response?.data || "Failed to request token.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white">
      <Navbar />

      {/* Page Content */}
      <div className="flex flex-col items-center justify-center flex-grow p-6">
        <div className="text-center p-6 bg-white shadow-lg rounded-lg text-gray-900 w-full max-w-4xl">
          <h2 className="text-3xl font-bold">Welcome to the User Dashboard!</h2>
        </div>

        {/* Request Token Button */}
        <div className="absolute inset-20  w-35 items-end justify-end ml-280">
          <button
            className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white py-3 rounded-lg font-semibold text-md transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            onClick={() => setTokenModal(true)}
          >
           + Request Token
          </button>
        </div>

        {/* Modal for selecting service */}
        {tokenModal && (
          <div className="absolute top-0 left-0 w-full h-full bg-gray-300 bg-opacity-90 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Select a Service</h2>

              {loading ? (
                <p>Loading services...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <select
                  className="w-full border p-2 rounded-md text-gray-900"
                  onChange={(e) => setSelectedStaff(staffList.find(staff => staff.id == e.target.value))}
                >
                  <option value="">-- Select Service --</option>
                  {staffList.map((staff) => (
                    <option key={staff.id} value={staff.id}>
                      {staff.service?.serviceName || "N/A"} - {staff.firstname}
                    </option>
                  ))}
                </select>
              )}

              <div className="flex justify-end mt-4">
                <button
                  className="bg-gray-400 px-4 py-2 rounded-md mr-2"
                  onClick={() => setTokenModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-500 px-4 py-2 text-white rounded-md"
                  onClick={requestToken}
                >
                  Request
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default UserHomePage;
