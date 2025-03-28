//   import React, { useEffect, useState } from "react";
//   import axios from "axios";
//   import Cookies from "js-cookie";
//   import { jwtDecode } from "jwt-decode";
//   import StaffNavbar from "./StaffNavbar";
//   import { Users, CheckCircle, SkipForward, Bell } from "lucide-react";
//   import { GoClock } from "react-icons/go";

//   function StaffPage() {
//     const [staffId, setStaffId] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [tokens, setTokens] = useState([]);
//     const [activeToken, setActiveToken] = useState(null);
//     const [notification, setNotification] = useState(null);

//     const token = Cookies.get("jwtToken");

//     // Extract Staff ID from JWT
//     useEffect(() => {
//       if (!token) {
//         setError("Authentication error. Please log in again.");
//         setLoading(false);
//         return;
//       }

//       try {
//         const decodedToken = jwtDecode(token);
//         const subParts = decodedToken.sub.split("/");
//         if (subParts.length > 1) {
//           const extractedId = parseInt(subParts[1].split(":")[0], 10);
//           setStaffId(extractedId);
//         } else {
//           setError("Invalid token format. Please log in again.");
//           setLoading(false);
//         }
//       } catch (error) {
//         setError("Failed to decode authentication token.");
//         setLoading(false);
//       }
//     }, []);

//     // Fetch Today's Tokens
//     useEffect(() => {
//       if (!staffId) return;

//       axios
//         .get(`http://localhost:8081/api/v1/token/getTodayTokensByStaffId/${staffId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//           withCredentials: true,
//         })
//         .then((response) => {
//           const filteredTokens = response.data.filter(token => token.status === "PENDING"); // ✅ Filter only pending tokens
//           console.log("Filtered Tokens:", filteredTokens); // ✅ Debug
//           setTokens(filteredTokens);
//           setActiveToken(response.data.find((token) => token.status === "ACTIVE") || null); // ✅ Keep active token
//           setLoading(false);
//         })
//         .catch(() => {
//           setError("Failed to load today's token data. Please check permissions.");
//           setLoading(false);
//         });
//     }, [staffId]);

//     // Handle "Call Next Customer" Click
//     const handleCallNext = async () => {
//       const nextToken = tokens.find((token) => token.status === "PENDING");
    
//       if (!nextToken || !nextToken.id) {
//         console.error("No valid waiting token found!", nextToken);
//         return;
//       }
    
//       console.log(`Calling next token: ${nextToken.id}`); // ✅ Debug log
//       console.log("Authorization Header:", token); // ✅ Debug JWT Token
    
//       try {
//         const response = await axios.put(
//           `http://localhost:8081/api/v1/token/nextToken/${nextToken.id}`,
//           null,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//             withCredentials: true,
//           }
//         );
    
//         if (response.status === 200) {
//           console.log("Next token activated:", response.data); // ✅ Debug success response
//           setActiveToken(response.data); // ✅ Use the updated token from API response
//           setNotification(`Now serving token ${response.data.tokenNumber} - ${response.data.user?.firstname}`);
    
//           // ✅ Remove the served token from the queue
//           setTokens((prevTokens) => prevTokens.filter((t) => t.id !== nextToken.id));
//         }
//       } catch (error) {
//         console.error("Error calling next customer:", error);
//         setError("Failed to call the next customer.");
//       }
//     };
    

//     // Handle Token Actions (Complete, Skip, Call Again)
//     const handleAction = async (action) => {
//       if (!activeToken) return;

//       let apiUrl = "";
//       let updatedStatus = "";

//       switch (action) {
//         case "skip":
//           apiUrl = `http://localhost:8081/api/v1/token/skipToken/${activeToken.id}`;
//           updatedStatus = "SKIPPED";
//           break;
//         case "complete":
//           apiUrl = `http://localhost:8081/api/v1/token/completeToken/${activeToken.id}`;
//           updatedStatus = "COMPLETED";
//           break;
//         default:
//           return;
//       }

//       try {
//         const response = await axios.put(apiUrl, null, {
//           headers: { Authorization: `Bearer ${token}` },
//           withCredentials: true,
//         });

//         if (response.status === 200) {
//           console.log(`${action} action successful:`, response.data);

          
//           // **Update tokens list and remove completed/skipped tokens**
//             setTokens((prevTokens) =>
//               prevTokens.filter((token) => token.id !== activeToken.id) // ✅ Removes completed/skipped token
//             );

//             setActiveToken(null); // ✅ Clear active token after completion or skip
                
//           if (action === "complete" || action === "skip") {
//             setActiveToken(null); // Clear active token after completion or skip
//           }
//         }
//       } catch (error) {
//         console.error(`Error ${action} token:`, error);
//         setError(`Failed to ${action} token. Please try again.`);
//       }
//     };

//     if (loading) return <p className="text-center">Loading tokens...</p>;
//     if (error) return <p className="text-red-500 text-center">{error}</p>;

//     return (
//       <div className="min-h-screen bg-gray-100 flex flex-col">
//         <StaffNavbar />

//         <div className="container mx-auto px-6 py-6">
//           <div className="mb-4">
//             <h1 className="text-3xl font-bold text-gray-900">Staff Portal</h1>
//             <p className="text-gray-600">Manage customer queue and service delivery</p>
//           </div>

//           {/* Call Next Customer Section */}
//           {!activeToken ? (
//             <div className="bg-white shadow-lg rounded-lg p-8 text-center w-220 h-100">
            
//               <div className="flex flex-col items-center mt-15">
//                 <Users className="h-20 w-20 text-gray-400" />
//                 <h1 className="text-xl font-semibold mt-4 text-gray-800">
//                   No Customer Currently Being Served
//                 </h1>
//                 <h2 className="text-xl  mt-4 text-gray-500 items-center">
//                   Click the "Call Next Customer" button to serve the next person in the queue.
//                 </h2>
               
//                 <button
//                   className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2"
//                   onClick={handleCallNext}
//                 >
//                   <Users className="h-6 w-6" /> Call Next Customer
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <div className="bg-white shadow-lg rounded-lg p-6 w-220 h-54">
//               <div className="flex justify-between items-center">
//                 <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-sm">Now Serving</span>
//                 <span className="text-gray-500">Started {new Date().toLocaleTimeString()}</span>
//               </div>

//               <h2 className="text-2xl font-bold mt-3">{activeToken.id}</h2>

//               {/* Customer Name & Service Name in the same row, but service name aligned to the right */}
//               <div className="flex justify-between items-center mt-1">
//                 <p className="text-gray-700">{activeToken.user?.firstname || "Customer Name"}</p>
//                 <span className="text-blue-600 text-sm font-medium bg-blue-100 px-2 py-1 rounded-lg">
//                   {activeToken.staffId?.service?.serviceName || "Service Name"}
//                 </span>
//               </div>

//               <div className="mt-4 flex space-x-4">
//                 <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2" onClick={() => handleAction("complete")}>
//                   <CheckCircle className="h-5 w-5" /> Complete Service
//                 </button>
//                 <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2" onClick={() => handleAction("skip")}>
//                   <SkipForward className="h-5 w-5" /> Skip Customer
//                 </button>
//               </div>
//             </div>
//           )}

//         {/* /table */}
//         {/* <div className="w-250 mx-auto bg-white shadow-md rounded-lg p-6"> */}
//         <div className="bg-white shadow-lg rounded-lg p-8 text-center w-220 mt-8 h-150">

//           {/* Header */}
//             <div className="flex justify-between items-center mb-4 border-b pb-3">
//               <h2 className="text-xl font-semibold">Customer Queue</h2>
//               <button className="border border-gray-300 text-gray-700 px-4 py-1 rounded-lg hover:bg-gray-100 transition">
//                 {tokens.filter((t) => t.status === "PENDING").length} Waiting
//               </button>
//             </div>


//           {/* Customer List */}         
//           <ul className="divide-y">
//             {tokens.map((token, index) => (
//               <li key={token.id} className="flex justify-between items-center py-3">
//                 {/* Number + Customer Info */}
//                 <div className="flex gap-4 items-center">
//                   {/* Display sequential count (1, 2, 3...) */}
//                   <span className="text-sm font-semibold bg-gray-200 px-3 py-1 rounded-lg">{index + 1}</span>
//                   <div>
//                     <p className="font-medium">Token Number : {token.id} - {token.user?.firstname}</p>
//                     <span className="text-blue-600 text-sm font-medium bg-blue-100 px-2 py-1 rounded-lg">
//                       {token.staffId?.service?.serviceName}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Wait Time  */}
//                 <div className="flex items-center gap-1 text-sm text-gray-500">
//                   <GoClock className="h-4 w-4" />
//                   <span>{token.additionalWaitTime} min</span>
//                 </div>
//               </li>
//             ))}
//           </ul>
//           </div>
//         </div>
//       </div>
//     );
//   }
// export default StaffPage;

import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import StaffNavbar from "./StaffNavbar";
import { Users, CheckCircle, SkipForward, Bell } from "lucide-react";
import { GoClock } from "react-icons/go";

function StaffPage() {
  const [staffId, setStaffId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tokens, setTokens] = useState([]);
  const [activeToken, setActiveToken] = useState(null);
  const [notification, setNotification] = useState(null);
  const [allTokens, setAllTokens] = useState([]);

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

  // Fetch Today's Tokens
  useEffect(() => {
    if (!staffId) return;
    console.log("Fetching all tokens for staffId:", staffId); // Debug log

    axios
      .get(`http://localhost:8081/api/v1/token/getTodayTokensByStaffId/${staffId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      })
      .then((response) => {
        const filteredTokens = response.data.filter(token => token.status === "PENDING"); // ✅ Filter only pending tokens
        console.log("Filtered Tokens:", filteredTokens); // ✅ Debug
        setTokens(filteredTokens);
        setActiveToken(response.data.find((token) => token.status === "ACTIVE") || null); // ✅ Keep active token
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load today's token data. Please check permissions.");
        setLoading(false);
      });

      // Fetch All Tokens (Pending, Completed, Skipped)
    axios
      .get(`http://localhost:8081/api/v1/token/getTodayTokensByStaffId/${staffId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      })
      .then((response) => {
        console.log("Fetched All Tokens:", response.data); // ✅ Debug Log
        setAllTokens(response.data);
      })
      .catch(() => {
        console.error("Failed to fetch all tokens.");
        if (error.response) {
          console.error("Response Data:", error.response.data);
          console.error("Response Status:", error.response.status);
        } else if (error.request) {
          console.error("No response received:", error.request);
        } else {
          console.error("Error setting up request:", error.message);
        }
      });

  }, [staffId]);

  // Handle "Call Next Customer" Click
  const handleCallNext = async () => {
    const nextToken = tokens.find((token) => token.status === "PENDING");
  
    if (!nextToken || !nextToken.id) {
      console.error("No valid waiting token found!", nextToken);
      return;
    }
  
    console.log(`Calling next token: ${nextToken.id}`); // ✅ Debug log
    console.log("Authorization Header:", token); // ✅ Debug JWT Token
  
    try {
      const response = await axios.put(
        `http://localhost:8081/api/v1/token/nextToken/${nextToken.id}`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
  
      if (response.status === 200) {
        console.log("Next token activated:", response.data); // ✅ Debug success response
        setActiveToken(response.data); // ✅ Use the updated token from API response
        setNotification(`Now serving token ${response.data.tokenNumber} - ${response.data.user?.firstname}`);
  
        // ✅ Remove the served token from the queue
        setTokens((prevTokens) => prevTokens.filter((t) => t.id !== nextToken.id));
      }
    } catch (error) {
      console.error("Error calling next customer:", error);
      setError("Failed to call the next customer.");
    }
  };
  

  // Handle Token Actions (Complete, Skip, Call Again)
  const handleAction = async (action) => {
    if (!activeToken) return;

    let apiUrl = "";
    let updatedStatus = "";

    switch (action) {
      case "skip":
        apiUrl = `http://localhost:8081/api/v1/token/skipToken/${activeToken.id}`;
        updatedStatus = "SKIPPED";
        break;
      case "complete":
        apiUrl = `http://localhost:8081/api/v1/token/completeToken/${activeToken.id}`;
        updatedStatus = "COMPLETED";
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
        console.log(`${action} action successful:`, response.data);

        
        // **Update tokens list and remove completed/skipped tokens**
          setTokens((prevTokens) =>
            prevTokens.filter((token) => token.id !== activeToken.id) // ✅ Removes completed/skipped token
          );

          setActiveToken(null); // ✅ Clear active token after completion or skip
              
        if (action === "complete" || action === "skip") {
          setActiveToken(null); // Clear active token after completion or skip
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
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <StaffNavbar />

      <div className="container mx-auto px-6 py-6">
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Staff Portal</h1>
          <p className="text-gray-600">Manage customer queue and service delivery</p>
        </div>

        {/* Call Next Customer Section */}
        {!activeToken ? (
          <div className="bg-white shadow-lg rounded-lg p-8 text-center w-200 h-100">
          
            <div className="flex flex-col items-center mt-15">
              <Users className="h-20 w-20 text-gray-400" />
              <h1 className="text-xl font-semibold mt-4 text-gray-800">
                No Customer Currently Being Served
              </h1>
              <h2 className="text-xl  mt-4 text-gray-500 items-center">
                Click the "Call Next Customer" button to serve the next person in the queue.
              </h2>
             
              <button
                className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                onClick={handleCallNext}
              >
                <Users className="h-6 w-6" /> Call Next Customer
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-lg p-6 w-200 h-54">
            <div className="flex justify-between items-center">
              <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-sm">Now Serving</span>
              <span className="text-gray-500">Started {new Date().toLocaleTimeString()}</span>
            </div>

            <h2 className="text-2xl font-bold mt-3">{activeToken.id}</h2>

            {/* Customer Name & Service Name in the same row, but service name aligned to the right */}
            <div className="flex justify-between items-center mt-1">
              <p className="text-gray-700">{activeToken.user?.firstname || "Customer Name"}</p>
              <span className="text-blue-600 text-sm font-medium bg-blue-100 px-2 py-1 rounded-lg">
                {activeToken.staffId?.service?.serviceName || "Service Name"}
              </span>
            </div>

            <div className="mt-4 flex space-x-4">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2" onClick={() => handleAction("complete")}>
                <CheckCircle className="h-5 w-5" /> Complete Service
              </button>
              <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2" onClick={() => handleAction("skip")}>
                <SkipForward className="h-5 w-5" /> Skip Customer
              </button>
            </div>
          </div>
        )}

    
      {/* for both tables */}
      <div className="flex gap-6 mt-6">
          {/* token queue */}
        <div className="bg-white shadow-lg rounded-lg p-8 text-center w-220 mt-8 h-150">

          {/* Header */}
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <h2 className="text-xl font-semibold">Customer Queue</h2>
              <button className="border border-gray-300 text-gray-700 px-4 py-1 rounded-lg hover:bg-gray-100 transition">
                {tokens.filter((t) => t.status === "PENDING").length} Waiting
              </button>
            </div>

          {/* Customer List */}         
          <ul className="divide-y">
            {tokens.map((token, index) => (
              <li key={token.id} className="flex justify-between items-center py-3">
                {/* Number + Customer Info */}
                <div className="flex gap-4 items-center">
                  {/* Display sequential count (1, 2, 3...) */}
                  <span className="text-sm font-semibold bg-gray-200 px-3 py-1 rounded-lg">{index + 1}</span>
                  <div>
                    <p className="font-medium">Token Number : {token.id} - {token.user?.firstname}</p>
                    <span className="text-blue-600 text-sm font-medium bg-blue-100 px-2 py-1 rounded-lg">
                      {token.staffId?.service?.serviceName}
                    </span>
                  </div>
                </div>

                {/* Wait Time  */}
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <GoClock className="h-4 w-4" />
                  <span>{token.additionalWaitTime} min</span>
                </div>
              </li>
            ))}
          </ul>

        </div>
        {/* Today's All Tokens
        <div className="w-100 bg-white shadow-lg rounded-lg p-6 mt-8 overflow-y-auto ">
             <h2 className="text-lg font-semibold border-b pb-2">Today's  Tokens</h2>
             <div className="mt-3 max-h-64">
              {allTokens.length > 0 ? (
                allTokens.map((token) => (
                  <div key={token.id} className="border-b py-1">
                    <h3 className="text-md font-medium">Token Number : {token.id} - {token.user?.firstname}</h3>
                    <p className="text-gray-700">{token.user?.firstname} {token.user?.lastname}</p>
                    <p className="text-sm text-gray-500">{token.staffId?.service?.serviceName}</p>
                    <div className="flex flex-col justify-end items-end">
                      <span className={`px-2 py-1 rounded text-xs  ${
                        token.status === "COMPLETED" ? "text-green-600 bg-green-100" :
                        token.status === "SKIPPED" ? "text-red-600 bg-red-100" :
                        "text-gray-600 bg-gray-100"
                      }`}>
                        {token.status}
                      </span>
                      <span className="text-gray-600 text-xs">{token.additionalWaitTime} min</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center">No tokens for today</p>
              )}
            </div>
          </div> */}
        
        {/* calculated execution time */}
        {/* Today's All Tokens */}
          <div className="w-100 bg-white shadow-lg rounded-lg p-6 mt-8 overflow-y-auto">
            <h2 className="text-lg font-semibold border-b pb-2">Today's Tokens</h2>
            <div className="mt-3 max-h-64">
              {allTokens.length > 0 ? (
                allTokens.map((token) => (
                  <div key={token.id} className="border-b py-2">
                    <h3 className="text-md font-medium">
                      Token Number : {token.id} - {token.user?.firstname}
                    </h3>
                    <p className="text-gray-700">
                      {token.user?.firstname} {token.user?.lastname}
                    </p>
                    
                    {/* Service name and status in one line */}
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-500">{token.staffId?.service?.serviceName}</p>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          token.status === "COMPLETED" ? "text-green-600 bg-green-100" :
                          token.status === "SKIPPED" ? "text-red-600 bg-red-100" :
                          "text-gray-600 bg-gray-100"
                        }`}
                      >
                        {token.status}
                      </span>
                    </div>

                    {/* Total Service Time Calculation */}
                    {/* <p className="text-gray-600 text-xs">
                      Total Time Taken:{" "}
                      {token.appointedTime && token.completedTime
                        ? Math.round((token.completedTime - token.appointedTime) / 60000) + " min"
                        : "N/A"}
                    </p> */}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center">No tokens for today</p>
              )}
            </div>
          </div>


      </div>
      </div>
    </div>
  );
}
export default StaffPage;

