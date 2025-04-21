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

import React, { useEffect, useState } from "react";
import { fetchUserTokenDetails } from "../components/services/userTokenService";
import TokenRequestForm from "../components/User/TokenRequestForm";
import TokenInfoCard from "../components/User/TokenInfoCard";
import Navbar from "../components/Navbar";
import { toast, ToastContainer } from "react-toastify";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { subscribeToNotifications } from "../components/services/NotificationsService";

const UserPage = ({ user }) => {
  const [tokenDetails, setTokenDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const token = Cookies.get("token");

  const handleTokenCreated = (newToken) => {
    setTokenDetails(newToken);
    setRefreshTrigger((prev) => prev + 1); //  trigger refresh
  };

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

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const userId = decoded.userId;

        const source = subscribeToNotifications(
          userId,
          (data) => {
            toast.info(data.message, {
              position: "top-right",
              autoClose: 5000,
            });
            setUnreadCount((prev) => prev + 1);
          },
          (err) => {
            console.error("Notification SSE error:", err);
          }
        );

        return () => source?.close();
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [token]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Navbar />

      <div className="flex flex-col md:flex-row md:items-start gap-6">
        <div className="w-full md:w-1/2">
          <div className="bg-white rounded-2xl shadow p-6 w-2/3">
            <TokenRequestForm
              tokenDetails={tokenDetails}
              onRefresh={loadTokenDetails}
              onTokenCreated={handleTokenCreated}
            />
          </div>
        </div>

        {tokenDetails && (
          <TokenInfoCard tokenDetails={tokenDetails} refreshTrigger={refreshTrigger} />
        )}
      </div>

      {!tokenDetails && !loading && (
        <div className="text-center text-gray-500 mt-4">
          You have not requested a token yet.
        </div>
      )}

      {unreadCount > 0 && (
        <div className="absolute top-5 right-5 bg-red-500 text-white rounded-full text-xs px-2 py-1">
          {unreadCount}
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default UserPage;
