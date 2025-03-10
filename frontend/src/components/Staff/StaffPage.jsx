import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode"; // Import jwtDecode
import StaffTokenTable from "./StaffTokenTable";
import StaffNavbar from "./StaffNavbar";

function StaffPage() {
  const [staffId, setStaffId] = useState(null);

  useEffect(() => {
    // Retrieve JWT token from cookies
    const token = Cookies.get("jwtToken");
    console.log("JWT Token from Cookies:", token);

    if (token) {
      try {
        // Decode the JWT
        const decodedToken = jwtDecode(token);
        console.log("Decoded Token:", decodedToken);

        // Extract 'sub' field: "staff2@gmail.com/15:STAFF"
        const subValue = decodedToken.sub;
        const parts = subValue.split("/"); // Splitting by '/'
        
        if (parts.length > 1) {
          const staffIdPart = parts[1].split(":")[0]; // Extract number before ':'
          console.log("Extracted Staff ID:", staffIdPart);
          setStaffId(parseInt(staffIdPart, 10)); // Convert to integer
        }
      } catch (error) {
        console.error("Error decoding JWT:", error);
      }
    }
  }, []);

  if (!staffId) {
    return (
      <div className="flex justify-center items-center min-h-screen text-white">
        <p>Loading staff information... Please wait.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white">
      {/* Navbar */}
      <StaffNavbar/>

      {/* Page Content */}
      <div className="flex flex-col items-center justify-center flex-grow p-6">
        <div className="text-center p-6 bg-white shadow-lg rounded-lg text-gray-900 w-full max-w-4xl">
          <h2 className="text-3xl font-bold">Welcome to the Staff Dashboard!</h2>
          <p className="text-gray-700 mt-2">Here are the token requests assigned to your service.</p>
        </div>

        {/* Token Table Section */}
        {/* <div className="mt-6 w-full max-w-5xl">
          <StaffTokenTable staffId={staffId} />
        </div> */}
      </div>
    </div>
  );
}

export default StaffPage;

