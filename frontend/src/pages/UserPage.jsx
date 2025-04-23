
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

  const token = Cookies.get("jwtToken");
  let userId = null;

  if (token) {
    const decoded = jwtDecode(token);
    userId = decoded?.sub?.split("/")[1]?.split(":")[0];
  }

  const handleTokenCreated = (newToken) => {
    setTokenDetails(newToken);
    setRefreshTrigger((prev) => prev + 1); //  trigger refresh
  };

  const loadTokenDetails = async () => {
    setLoading(true);
    try {
      const data = await fetchUserTokenDetails(userId);
      console.log("Updated token details",data);
      setTokenDetails(data);
      setRefreshTrigger((prev) => prev + 1); //  trigger refresh
    } catch (error) {
      console.error("Error fetching token details:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadTokenDetails();
  }, []);

  useEffect(() => {
    if (userId) {
        const source = subscribeToNotifications(
          userId,
          (data) => {
            console.log("SSE Message Received:", data);

            toast.info(data.message || "You have a new notification" );
            console.log(toast);

            setUnreadCount((prev) => prev + 1);

              // This ensures token details refresh when status changes
              if (
                /turn now|called|active|skipped|completed|cancelled|pending/i.test(data.message)
              ) {
                console.log("Refreshing token details..."); // Debug log here
                setRefreshTrigger((prev) => prev + 1); // 🌀 This re-triggers TokenInfoCard
                loadTokenDetails();
              }
          },
          (err) => console.error("Notification SSE error:", err)
        );
        return () => source?.close();
      }
  }, [userId]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Navbar />
      <ToastContainer />

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
          <TokenInfoCard 
          key={refreshTrigger} // 🔑 re-create on refresh
          userId={userId} 
          // tokenDetails={tokenDetails} 
          refreshTrigger={refreshTrigger} />
        )}
      </div>

      {!tokenDetails && !loading && (
        <div className="text-center text-gray-500 mt-4">
          You have not requested a token yet.
        </div>
      )}
 
    </div>
  );
};

export default UserPage;
