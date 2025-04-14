// import React, { useEffect, useState } from "react";
// import {  fetchUserTokenDetails } from "../components/services/userTokenService";
// import TokenRequestForm from "../components/User/TokenRequestForm";
// import TokenInfoCard from "../components/User/TokenInfoCard";
// import Navbar from "../components/Navbar"

// const UserPage = () => {
//   const [tokenDetails, setTokenDetails] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const loadTokenDetails = async () => {
//     setLoading(true);
//     try {
//       const data = await fetchUserTokenDetails();
//       setTokenDetails(data);
//     } catch (error) {
//       console.error("Error fetching token details:", error);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     loadTokenDetails();
//   }, []);

//   return (
//     <div className="min-h-screen flex flex-col bg-white text-black">
//       <Navbar/>

//       <div className="flex flex-col md:flex-row md:items-start gap-6">
  
//         {/* Left side: Token Request Form */}
//         <div className="w-full md:w-1/2">
//           <div className="bg-white rounded-2xl shadow p-6 w-2/3">
//             <TokenRequestForm tokenDetails={tokenDetails} onRefresh={loadTokenDetails} />
//           </div>
//         </div>
  
//         {/* Right side: Token Details Card */}
//         {tokenDetails && (
//           <TokenInfoCard/>
//         )}
//       </div>
  
//       {/* No token message */}
//       {!tokenDetails && !loading && (
//         <div className="text-center text-gray-500 mt-4">
//           You have not requested a token yet.
//         </div>
//       )}
//     </div>
//   );
  
// };

// export default UserPage;

// import React, { useEffect, useState } from "react";
// import { fetchUserTokenDetails } from "../components/services/userTokenService";
// import TokenRequestForm from "../components/User/TokenRequestForm";
// import TokenInfoCard from "../components/User/TokenInfoCard";
// import Navbar from "../components/Navbar";
// import { toast, ToastContainer } from "react-toastify";
// import Cookies from "js-cookie";
// import {jwtDecode} from "jwt-decode";
// import { subscribeToNotifications } from "../components/services/NotificationsService"; // Adjust based on your import path

// const UserPage = () => {
//   const [tokenDetails, setTokenDetails] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [unreadCount, setUnreadCount] = useState(0); // Track unread notifications

//   const loadTokenDetails = async () => {
//     setLoading(true);
//     try {
//       const data = await fetchUserTokenDetails();
//       setTokenDetails(data);
//     } catch (error) {
//       console.error("Error fetching token details:", error);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     loadTokenDetails();
//   }, []);

//   // SSE subscription for real-time notifications
//   useEffect(() => {
//     const token = Cookies.get("token"); // Get the token from cookies
//     if (token) {
//       try {
//         const decoded = jwt_decode(token); // Decode the JWT token to extract userId
//         const userId = decoded.userId; // Assuming your token contains userId as 'userId'

//         const source = subscribeToNotifications(
//           userId,
//           (data) => {
//             // Show toast popup for new notifications
//             toast.info(data.message, {
//               position: "top-right",
//               autoClose: 5000,
//             });

//             // Update unread notifications count
//             setUnreadCount((prev) => prev + 1);
//           },
//           (err) => {
//             console.error("Notification SSE error:", err);
//           }
//         );

//         return () => source?.close();
//       } catch (error) {
//         console.error("Error decoding token:", error);
//       }
//     }
//   }, []);

//   return (
//     <div className="min-h-screen flex flex-col bg-white text-black">
//       <Navbar />

//       <div className="flex flex-col md:flex-row md:items-start gap-6">
//         {/* Left side: Token Request Form */}
//         <div className="w-full md:w-1/2">
//           <div className="bg-white rounded-2xl shadow p-6 w-2/3">
//             <TokenRequestForm tokenDetails={tokenDetails} onRefresh={loadTokenDetails} />
//             <ToastContainer/>
//           </div>
//         </div>

//         {/* Right side: Token Details Card */}
//         {tokenDetails && <TokenInfoCard tokenDetails={tokenDetails} />}
//       </div>

//       {/* No token message */}
//       {!tokenDetails && !loading && (
//         <div className="text-center text-gray-500 mt-4">
//           You have not requested a token yet.
//         </div>
//       )}

//       {/* Notification Badge (Optional, to show unread notifications count) */}
//       {unreadCount > 0 && (
//         <div className="absolute top-5 right-5 bg-red-500 text-white rounded-full text-xs px-2 py-1">
//           {unreadCount}
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserPage;

import React, { useEffect, useState } from "react";
import { fetchUserTokenDetails } from "../components/services/UserTokenService";
import TokenRequestForm from "../components/User/TokenRequestForm";
import TokenInfoCard from "../components/User/TokenInfoCard";
import Navbar from "../components/Navbar";
import { toast, ToastContainer } from "react-toastify"; // Import ToastContainer and toast
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { subscribeToNotifications } from "../components/services/NotificationsService"; // Adjust based on your import path

const UserPage = () => {
  const [tokenDetails, setTokenDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0); // Track unread notifications

  // Load token details
  const loadTokenDetails = async () => {
    setLoading(true);
    try {
      const data = await fetchUserTokenDetails();
      setTokenDetails(data);
    } catch (error) {
      console.error("Error fetching token details:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadTokenDetails();
  }, []);

  // Establish SSE connection to listen for real-time notifications
  useEffect(() => {
    const token = Cookies.get("token"); // Get the token from cookies
    if (token) {
      try {
        const decoded = jwtDecode(token); // Decode the JWT token to extract userId
        const userId = decoded.userId; // Assuming your token contains userId as 'userId'

        // Subscribe to notifications
        const source = subscribeToNotifications(
          userId,
          (data) => {
            // Show toast notification for new notifications
            toast.info(data.message, {
              position: "top-right",
              autoClose: 5000,
            });

            // Update unread notification count
            setUnreadCount((prev) => prev + 1);
          },
          (err) => {
            console.error("Notification SSE error:", err);
          }
        );

        // Return cleanup function to close the SSE connection when component unmounts
        return () => source?.close();
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Navbar />

      <div className="flex flex-col md:flex-row md:items-start gap-6">
        {/* Left side: Token Request Form */}
        <div className="w-full md:w-1/2">
          <div className="bg-white rounded-2xl shadow p-6 w-2/3">
            <TokenRequestForm tokenDetails={tokenDetails} onRefresh={loadTokenDetails} />
          </div>
        </div>

        {/* Right side: Token Details Card */}
        {tokenDetails && <TokenInfoCard tokenDetails={tokenDetails} />}
      </div>

      {/* No token message */}
      {!tokenDetails && !loading && (
        <div className="text-center text-gray-500 mt-4">
          You have not requested a token yet.
        </div>
      )}

      {/* Notification Badge (Optional, to show unread notifications count) */}
      {unreadCount > 0 && (
        <div className="absolute top-5 right-5 bg-red-500 text-white rounded-full text-xs px-2 py-1">
          {unreadCount}
        </div>
      )}

      {/* ToastContainer for handling toasts */}
      <ToastContainer />
    </div>
  );
};

export default UserPage;
