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

// mark one notification as read
export const markNotificationAsRead = async (userId, notificationId) => {
  const token = getToken();
  await axios.put(
    `${BASE_URL}/mark-read/${userId}/${notificationId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
        withCredentials: true, // Send cookies and authorization headers with the request, 
      },
    }
  );
};

//  mark all notifications as read
export const markAllNotificationsAsRead = async (userId) => {
  const token = getToken();
  await axios.put(
    `${BASE_URL}/mark-all-read/${userId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
        withCredentials: true,
      },
    }
  );
};

