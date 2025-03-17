// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Cookies from "js-cookie";
// import { jwtDecode } from "jwt-decode";
// import StaffNavbar from "./StaffNavbar";

// const StaffTokenTable = () => {
//   const [tokens, setTokens] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [staffId, setStaffId] = useState(null);
//   const token = Cookies.get("jwtToken");

//   /**
//    * Extracts the staff ID from the stored JWT token and sets it in state.
//    * If the token is missing or invalid, an error message is displayed.
//    */
//   useEffect(() => {
//     const token = Cookies.get("jwtToken");

//     if (!token) {
//       console.error("Error: JWT token is missing!");
//       setError("Authentication error. Please log in again.");
//       setLoading(false);
//       return;
//     }

//     try {
//       const decodedToken = jwtDecode(token);
//       console.log("Decoded Token:", decodedToken);

//       const subParts = decodedToken.sub.split("/");
//       if (subParts.length > 1) {
//         const extractedId = parseInt(subParts[1].split(":")[0], 10);
//         setStaffId(extractedId);
//         console.log("Extracted Staff ID:", extractedId);
//       } else {
//         console.error("Error: Invalid token format.");
//         setError("Invalid token format. Please log in again.");
//         setLoading(false);
//       }
//     } catch (error) {
//       console.error("Error decoding JWT:", error);
//       setError("Failed to decode authentication token.");
//       setLoading(false);
//     }
//   }, []);

//   //admin@gmail.com/1:ADMIN

//   /**
//    * Fetches the list of tokens assigned to the logged-in staff member.
//    * Runs when staffId changes (dependency [staffId]).
//    */
//   useEffect(() => {
//     if (!staffId) return;

//     console.log(`Fetching tokens for staffId: ${staffId}`);

//     const token = Cookies.get("jwtToken");

//     axios
//       .get(`http://localhost:8081/api/v1/token/getRequestedTokenByStaffId/${staffId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//         withCredentials: true,
//       })
//       .then((response) => {
//         console.log("Token data received:", response.data);
//         setTokens(response.data);
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error("Error fetching tokens:", error);
//         setError("Failed to load token data. Please check permissions.");
//         setLoading(false);
//       });
//   }, [staffId]);

//  /**
//    * Handles skipping a token by calling the backend API.
//    * @param {number} tokenId - The ID of the token to be skipped.
//    */
//  const handleSkipClick = async (tokenId) => {
//   if (!tokenId) return;
//   console.log(`Skipping token with ID: ${tokenId}`);

//   try {
//     await axios.put(`http://localhost:8081/api/v1/token/skipToken/${tokenId}`, null, {
//       headers: { Authorization: `Bearer ${token}` },
//       withCredentials: true,
//     });

//     // Update UI after skipping the token
//     setTokens((prevTokens) =>
//       prevTokens.map((token) =>
//         token.id === tokenId ? { ...token, status: "SKIPPED" } : token
//       )
//     );
//   } catch (error) {
//     console.error("Error skipping token:", error);
//     setError("Failed to skip token. Please try again.");
//   }
// };

// /**
//    * Handles skipping a token by calling the backend API.
//    * @param {number} tokenId - The ID of the token to be skipped.
//    */
// const handleCompleteClick = async (tokenId) => {
//   if (!tokenId) return;
//   console.log(`Completing token with ID: ${tokenId}`);

//   try {
//     await axios.put(`http://localhost:8081/api/v1/token/completeToken/${tokenId}`, null, {
//       headers: { Authorization: `Bearer ${token}` },
//       withCredentials: true,
//     });

//     // Update UI after skipping the token
//     setTokens((prevTokens) =>
//       prevTokens.map((token) =>
//         token.id === tokenId ? { ...token, status: "COMPLETED" } : token
//       )
//     );
//   } catch (error) {
//     console.error("Error completing token:", error);
//     setError("Failed to complete token. Please try again.");
//   }
// };

// /**
//    * Handles skipping a token by calling the backend API.
//    * @param {number} tokenId - The ID of the token to be skipped.
//    */
// const handleNextClick = async (currentTokenId) => {
//   if (!currentTokenId) return;
//   console.log(`Processing next token after ID: ${currentTokenId}`);

//   try {
//     const response = await axios.put(
//       `http://localhost:8081/api/v1/token/nextToken/${currentTokenId}`,
//       null,
//       {
//         headers: { Authorization: `Bearer ${token}` },
//         withCredentials: true,
//       }
//     );

//     if (response.status === 200) {
//       const updatedTokens = response.data; // Assuming API returns updated tokens

//       setTokens((prevTokens) =>
//         prevTokens.map((token) =>
//           token.id === updatedTokens.nextTokenId
//             ? { ...token, status: "ACTIVE", appointedTime: new Date().toISOString() }
//             : token
//         )
//       );
//     }
//   } catch (error) {
//     console.error("Error activating next token:", error);
//     setError("Failed to activate the next token. Please try again.");
//   }
// };

  

//   if (loading) return <p className="text-center">Loading tokens...</p>;
//   if (error) return <p className="text-red-500 text-center">{error}</p>;

//   return (
//     <div className="min-h-screen bg-gray-100">
//       {/* Navbar */}
//       <StaffNavbar title="Token List" />

//       {/* Token List Table */}
//       <div className="p-6">
//         <div className="overflow-x-auto">
//           <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
//             <thead className="bg-gray-800 text-white">
//               <tr>
//                 <th className="py-2 px-4">Token ID</th>
//                 <th className="py-2 px-4">User Name</th>
//                 <th className="py-2 px-4">Service</th>
//                 <th className="py-2 px-4">Status</th>
//                 <th className="py-2 px-4">Issued Date and Time</th>
//                 <th className="py-2 px-4">Actions</th>
//                 {/* 
//                 <th className="py-2 px-4">User ID</th>
//                 <th className="py-2 px-4">Staff ID</th>
//                 <th className="py-2 px-4">Staff Name</th>
//                 */}
               
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
//                     <td className="py-2 px-4 text-center font-bold">{token.issuedTime}</td>

//                     {/* <td className="py-2 px-4 text-center">{token.staffId?.id || "N/A"}</td>
//                     <td className="py-2 px-4 text-center">{token.staffId?.firstname || "N/A"}</td>
//                     <td className="py-2 px-4 text-center">{token.user?.id || "N/A"}</td> */}
//                     <div className="flex justify-center space-x-2 mt-1.5">
//                       <button
//                        className="bg-gray-500 text-white px-4 py-1 rounded hover:bg-gray-700"
//                        onClick={() => handleSkipClick(token.id)}
//                       >
//                         Skip</button>
//                       <button
//                        className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-700"
//                        onClick={() => handleCompleteClick(token.id)}>
//                         Complete</button>                      
//                       <button  className="bg-blue-400 text-white px-4 py-1 rounded hover:bg-blue-700"
//                             onClick={() => handleNextClick(token.id)}>
//                         Next
//                         </button>                      

//                       </div>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="8" className="text-center text-gray-500 py-4">
//                     No tokens found for this service.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StaffTokenTable;


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
  const token = Cookies.get("jwtToken");

  /**
   * Extracts the staff ID from the stored JWT token and sets it in state.
   */
  useEffect(() => {
    if (!token) {
      console.error("Error: JWT token is missing!");
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

    axios
      .get(`http://localhost:8081/api/v1/token/getRequestedTokenByStaffId/${staffId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      })
      .then((response) => {
        setTokens(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching tokens:", error);
        setError("Failed to load token data. Please check permissions.");
        setLoading(false);
      });
  }, [staffId]);

  /**
   * Utility function to format date and time.
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
      hour12: false, // 24-hour format
    });
  };

  /**
   * Handles skipping a token by calling the backend API.
   */
  const handleSkipClick = async (tokenId) => {
    if (!tokenId) return;
    try {
      await axios.put(`http://localhost:8081/api/v1/token/skipToken/${tokenId}`, null, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      // Update UI after skipping the token
      setTokens((prevTokens) =>
        prevTokens.map((token) => (token.id === tokenId ? { ...token, status: "SKIPPED" } : token))
      );
    } catch (error) {
      console.error("Error skipping token:", error);
      setError("Failed to skip token. Please try again.");
    }
  };

  /**
   * Handles completing a token.
   */
  const handleCompleteClick = async (tokenId) => {
    if (!tokenId) return;
    try {
      await axios.put(`http://localhost:8081/api/v1/token/completeToken/${tokenId}`, null, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      // Update UI after completing the token
      setTokens((prevTokens) =>
        prevTokens.map((token) => (token.id === tokenId ? { ...token, status: "COMPLETED" } : token))
      );
    } catch (error) {
      console.error("Error completing token:", error);
      setError("Failed to complete token. Please try again.");
    }
  };

  /**
   * Handles activating the next token.
   */
  const handleNextClick = async (currentTokenId) => {
    if (!currentTokenId) return;
    try {
      const response = await axios.put(
        `http://localhost:8081/api/v1/token/nextToken/${currentTokenId}`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        const updatedToken = response.data; // Assuming API returns updated token

        setTokens((prevTokens) =>
          prevTokens.map((token) =>
            token.id === updatedToken.id
              ? { ...token, status: "ACTIVE", appointedTime: new Date().toISOString() }
              : token
          )
        );
      }
    } catch (error) {
      console.error("Error activating next token:", error);
      setError("Failed to activate the next token. Please try again.");
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
                <th className="py-2 px-4">User Name</th>
                <th className="py-2 px-4">Service</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Issued Date and Time</th>
                <th className="py-2 px-4">Actions</th>
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

                    <td className="flex justify-center space-x-2 mt-1.5">
                      <button className="bg-gray-500 text-white px-4 py-1 rounded hover:bg-gray-700"
                        onClick={() => handleSkipClick(token.id)}>Skip</button>
                      <button className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-700"
                        onClick={() => handleCompleteClick(token.id)}>Complete</button>                      
                      <button className="bg-blue-400 text-white px-4 py-1 rounded hover:bg-blue-700"
                        onClick={() => handleNextClick(token.id)}>Next</button>                      
                    </td>
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
    </div>
  );
};

export default StaffTokenTable;

