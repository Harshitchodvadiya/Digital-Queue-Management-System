import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import StaffNavbar from "./StaffNavbar";

function StaffPage() {
  const [staffId, setStaffId] = useState(null);

  useEffect(() => {
    const token = Cookies.get("jwtToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const subValue = decodedToken.sub;
        const parts = subValue.split("/");
        if (parts.length > 1) {
          const staffIdPart = parts[1].split(":")[0];
          setStaffId(parseInt(staffIdPart, 10));
        }
      } catch (error) {
        console.error("Error decoding JWT:", error);
      }
    }
  }, []);

  if (!staffId) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-700">
        <p>Loading staff information... Please wait.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar */}
      <StaffNavbar />

      {/* Main Content Layout */}
      <div className="container mx-auto px-6 py-6">
        {/* Staff Portal Header */}
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Staff Portal</h1>
          <p className="text-gray-600">Manage customer queue and service delivery</p>
        </div>

        {/* Left-Aligned Call Next Customer Card */}
        <div className="bg-white shadow-lg rounded-lg p-8 text-center w-2/5">
          <div className="flex flex-col items-center">
            <span className="text-gray-400 text-6xl">👤</span>
            <h2 className="text-xl font-semibold mt-4 text-gray-800">
              No Customer Currently Being Served
            </h2>
            <p className="text-gray-600 mt-2">
              Click the "Call Next Customer" button to serve the next person in the queue.
            </p>
            <button className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
              🚀 Call Next Customer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StaffPage;
