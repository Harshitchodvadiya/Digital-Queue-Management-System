// import { useState, useEffect } from "react";
// import axios from "axios";
// import Cookies from "js-cookie"; 
// import {jwtDecode} from "jwt-decode"; 
// import Navbar from "../Navbar";

// const UserHomePage = () => {
//   const [tokenModal, setTokenModal] = useState(false);
//   const [staffList, setStaffList] = useState([]);
//   const [selectedStaff, setSelectedStaff] = useState(null);
//   const [selectedDate, setSelectedDate] = useState("");
//   const [selectedTime, setSelectedTime] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [userId, setUserId] = useState(null);
//   const token = Cookies.get("jwtToken");
//   const [tokens, setTokens] = useState([]);

//   // Decode JWT token to extract user ID
//   useEffect(() => {
//     if (token) {
//       try {
//         const decodedToken = jwtDecode(token);
//         const parts = decodedToken.sub.split("/");
//         if (parts.length > 1) {
//           const userIdPart = parts[1].split(":")[0];
//           setUserId(parseInt(userIdPart, 10));
//         }
//       } catch (error) {
//         console.error("Error decoding JWT:", error);
//       }
//     }
//   }, []);

//   // Fetch staff list
//   useEffect(() => {
//     fetchStaff(),
//     fetchTokensList();
//   }, []);

//   const fetchStaff = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get("http://localhost:8081/api/v1/user/userList", {
//         withCredentials: true,
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const staffData = response.data.filter((user) => user.role === "STAFF");
//       setStaffList(staffData);
//     } catch (err) {
//       setError("Failed to fetch staff members. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchTokensList = async () => {
//         setLoading(true);
//         try {
//           const response = await axios.get(`http://localhost:8081/api/v1/token/getRequestedTokenByUserId/${userId}`, {
//             withCredentials: true,
//             headers: { Authorization: `Bearer ${token}` },
//           });
//         } catch (err) {
//           setError("Failed to fetch tokens. Please try again.");
//         } finally {
//           setLoading(false);
//         }
//      };

//   // Handle token request
//   const requestToken = async () => {
//     if (!selectedStaff || !selectedDate || !selectedTime) {
//       alert("Please select a service, date, and time.");
//       return;
//     }

//     if (!userId) {
//       alert("User ID not found. Please log in again.");
//       return;
//     }

//     const issuedTime = `${selectedDate}T${selectedTime}:00`; // Combine date & time

//     const requestBody = {
//       user: { id: userId },
//       staffId: { id: selectedStaff.id },
//       issuedTime,
//     };

//     try {
//       await axios.post("http://localhost:8081/api/v1/token/requestToken", requestBody, {
//         headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
//       });
//       alert("Token requested successfully!");
//       setTokenModal(false);
//     } catch (error) {
//       alert(error.response?.data || "Failed to request token.");
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white">
//       <Navbar />

//       <div className="flex flex-col items-center justify-center flex-grow p-6">
//         {/* Request Token Button */}
//         <div className="absolute inset-20 w-35 items-end justify-end ml-280">
//           <button
//             className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white py-3 rounded-lg font-semibold text-md transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
//             onClick={() => setTokenModal(true)}
//           >
//             + Request Token
//           </button>
//         </div>

       
//           {/* user token list */}
//           <div className="p-6">
//         <div className="overflow-x-auto">
//           <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
//             <thead className="bg-gray-800 text-white">
//               <tr>
//                 <th className="py-2 px-4">Token ID</th>
//                 <th className="py-2 px-4">User Name</th>
//                 <th className="py-2 px-4">Service</th>
//                 <th className="py-2 px-4">Status</th>
//                 <th className="py-2 px-4">Issued Date and Time</th>
                
//               </tr>
//             </thead>
//             <tbody>
//               {tokens.length > 0 ? (
//                 tokens.map((token) => (
//                   <tr key={token.id} className="border-b hover:bg-gray-100 text-gray-700">
//                     <td className="py-2 px-4 text-center">{token?.id || "N/A"}</td>
//                     <td className="py-2 px-4 text-center">{token.user?.firstname || "N/A"}</td>
//                     <td className="py-2 px-4 text-center">{token.staffId?.service?.serviceName || "N/A"}</td>
//                     <td className="py-2 px-4 text-center font-bold">{token.status}</td>
//                     <td className="py-2 px-4 text-center font-bold">{formatDateTime(token.issuedTime)}</td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="6" className="text-center text-gray-500 py-4">
//                     No tokens found for this service.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

       

//         {/* Modal for selecting service, date, and time */}
//         {tokenModal && (
//           <div className="absolute top-0 left-0 w-full h-full bg-gray-300 bg-opacity-90 flex justify-center items-center">
//             <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//               <h2 className="text-lg font-bold text-gray-800 mb-4">Select a Service & Time</h2>

//               {loading ? (
//                 <p>Loading services...</p>
//               ) : error ? (
//                 <p className="text-red-500">{error}</p>
//               ) : (
//                 <>
//                   <select
//                     className="w-full border p-2 rounded-md text-gray-900"
//                     onChange={(e) => setSelectedStaff(staffList.find(staff => staff.id == e.target.value))}
//                   >
//                     <option value="">-- Select Service --</option>
//                     {staffList.map((staff) => (
//                       <option key={staff.id} value={staff.id}>
//                         {staff.service?.serviceName || "N/A"} - {staff.firstname}
//                       </option>
//                     ))}
//                   </select>

//                   {/* Date Input */}
//                   <label className="block text-gray-800 mt-4">Select Date:</label>
//                   <input
//                     type="date"
//                     className="w-full border p-2 rounded-md text-gray-900"
//                     value={selectedDate}
//                     onChange={(e) => setSelectedDate(e.target.value)}
//                   />

//                   {/* Time Input */}
//                   <label className="block text-gray-800 mt-4">Select Time:</label>
//                   <input
//                     type="time"
//                     className="w-full border p-2 rounded-md text-gray-900"
//                     value={selectedTime}
//                     onChange={(e) => setSelectedTime(e.target.value)}
//                   />
//                 </>
//               )}

//               <div className="flex justify-end mt-4">
//                 <button
//                   className="bg-gray-400 px-4 py-2 rounded-md mr-2"
//                   onClick={() => setTokenModal(false)}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className="bg-blue-500 px-4 py-2 text-white rounded-md"
//                   onClick={requestToken}
//                 >
//                   Request
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UserHomePage;

import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie"; 
import { jwtDecode } from "jwt-decode"; 
import Navbar from "../Navbar";

const UserHomePage = () => {
  const [tokenModal, setTokenModal] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);
  const [tokens, setTokens] = useState([]);
  const token = Cookies.get("jwtToken");

  /**
   * Decode JWT token to extract user ID.
   */
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

  /**
   * Fetch staff list after userId is set.
   */
  useEffect(() => {
    if (userId) {
      fetchStaff();
      fetchTokensList();
    }
  }, [userId]); // Run only when userId is set.

  /**
   * Fetch staff members.
   */
  const fetchStaff = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8081/api/v1/user/userList", {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });

      const staffData = response.data.filter((user) => user.role === "STAFF");
      setStaffList(staffData);
    } catch (err) {
      setError("Failed to fetch staff members. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch tokens assigned to the user.
   */
  const fetchTokensList = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8081/api/v1/token/getRequestedTokenByUserId/${userId}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });

      setTokens(response.data); // Set the received tokens in state
    } catch (err) {
      setError("Failed to fetch tokens. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle requesting a token.
   */
  const requestToken = async () => {
    if (!selectedStaff || !selectedDate || !selectedTime) {
      alert("Please select a service, date, and time.");
      return;
    }

    if (!userId) {
      alert("User ID not found. Please log in again.");
      return;
    }

    const issuedTime = `${selectedDate}T${selectedTime}:00`;

    const requestBody = {
      user: { id: userId },
      staffId: { id: selectedStaff.id },
      issuedTime,
    };

    try {
      await axios.post("http://localhost:8081/api/v1/token/requestToken", requestBody, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });

      alert("Token requested successfully!");
      setTokenModal(false);
      fetchTokensList(); // Refresh token list after requesting
    } catch (error) {
      alert(error.response?.data || "Failed to request token.");
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
      second: "2-digit",
      hour12: false,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white">
      <Navbar />

      <div className="flex flex-col items-center justify-center flex-grow p-6">
        {/* Request Token Button */}
        <div className="absolute inset-20 w-35 items-end justify-end ml-280">
          <button
            className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white py-3 rounded-lg font-semibold text-md transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            onClick={() => setTokenModal(true)}
          >
            + Request Token
          </button>
        </div>

        {/* User Token List */}
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="py-2 px-4">Token ID</th>
                  <th className="py-2 px-4">User Name</th>
                  <th className="py-2 px-4">Service</th>
                  <th className="py-2 px-4">Status</th>
                  <th className="py-2 px-4">Issued Date and Time</th>
                </tr>
              </thead>
              <tbody>
                {tokens.length > 0 ? (
                  tokens.map((token) => (
                    <tr key={token.id} className="border-b hover:bg-gray-100 text-gray-700">
                      <td className="py-2 px-4 text-center">{token?.id || "N/A"}</td>
                      <td className="py-2 px-4 text-center">{token.user?.firstname || "N/A"}</td>
                      <td className="py-2 px-4 text-center">{token.staffId?.service?.serviceName || "N/A"}</td>
                      <td className="py-2 px-4 text-center font-bold">{token.status}</td>
                      <td className="py-2 px-4 text-center font-bold">{formatDateTime(token.issuedTime)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center text-gray-500 py-4">
                      No tokens found for this service.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal for selecting service, date, and time */}
        {tokenModal && (
          <div className="absolute top-0 left-0 w-full h-full bg-gray-300 bg-opacity-90 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Select a Service & Time</h2>

              {loading ? (
                <p>Loading services...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <>
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

                  {/* Date Input */}
                  <label className="block text-gray-800 mt-4">Select Date:</label>
                  <input
                    type="date"
                    className="w-full border p-2 rounded-md text-gray-900"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />

                  {/* Time Input */}
                  <label className="block text-gray-800 mt-4">Select Time:</label>
                  <input
                    type="time"
                    className="w-full border p-2 rounded-md text-gray-900"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                  />
                </>
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
