import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const BASE_URL = "http://localhost:8081/api/v1/notifications";

  const getToken = () => Cookies.get("jwtToken");


  const getUserId = () => {
      const token = getToken();
      const decoded = jwtDecode(token);
      const idPart = decoded.sub.split("/")[1].split(":")[0];
      return parseInt(idPart, 10);
    };
  
// const extractUserIdFromJWT = () => {
//     try {
//       const token = localStorage.getItem("jwtToken");
//       if (!token) return null;
  
//       const payload = JSON.parse(atob(token.split(".")[1]));
//       const sub = payload.sub;
//       const userId = sub.split("/")[1].split(":")[0];
  
//       return userId;
//     } catch (error) {
//       console.error("Failed to extract userId from JWT:", error);
//       return null;
//     }
//   };


// ✅ Fetch past notification history from backend
export const fetchNotificationHistory = async () => {
  const token = getToken();
  const userId = getUserId();

  const response = await axios.get(`${BASE_URL}/history/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      withCredentials: true,

    },
  });
  console.log(response.data);
  return response.data;
};

// ✅ Subscribe to SSE and receive real-time notifications
export const subscribeToNotifications = (userId, onMessage, onError) => {
  const eventSource = new EventSource(`${BASE_URL}/subscribe/${userId}`);

  eventSource.onmessage = (event) => {
    let data;
    try {
      data = JSON.parse(event.data);
    } catch {
      data = { message: event.data, isRead: false };
    }
    onMessage(data);
  };

  eventSource.onerror = (error) => {
    console.error("SSE Error:", error);
    eventSource.close();
    if (onError) onError(error);
  };

  return eventSource; // ✅ return so caller can manually close if needed
};

// // ⛔ Optional: markAsRead is only needed on frontend; here for reference
// export const markAsReadLocal = (notificationId) => {
//   const stored = localStorage.getItem("notifications");
//   if (!stored) return;

//   const parsed = JSON.parse(stored);
//   const updated = parsed.map((notif) =>
//     notif.id === notificationId ? { ...notif, isRead: true } : notif
//   );

//   localStorage.setItem("notifications", JSON.stringify(updated));
// };
