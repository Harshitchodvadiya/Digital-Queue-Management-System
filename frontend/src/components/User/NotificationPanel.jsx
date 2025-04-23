import { Bell } from "lucide-react";
import {
  fetchNotificationHistory,
  subscribeToNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../services/NotificationsService";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const NotificationPanel = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showList, setShowList] = useState(false);

  const getUserId = () => {
    const token = Cookies.get("jwtToken");
    const decoded = jwtDecode(token);
    return decoded?.sub?.split("/")[1]?.split(":")[0];
  };

  const userId = getUserId();

  // Fetch notification history
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await fetchNotificationHistory();
        setNotifications(history);
        setUnreadCount(history.filter((n) => !n.isRead).length);
      } catch (err) {
        console.error("Failed to fetch notification history:", err);
      }
    };

    loadHistory();
  }, []);

  // SSE subscription
  useEffect(() => {
    const source = subscribeToNotifications(
      userId,
      async (data) => {
        // Reload from backend
        const updated = await fetchNotificationHistory();
        setNotifications(updated);
        setUnreadCount(updated.filter((n) => !n.isRead).length);
      },
      (err) => {
        console.error("Notification SSE error:", err);
      }
    );

    return () => source?.close();
  }, [userId]);

  // Mark single notification as read
  const handleSingleRead = async (notificationId) => {
    try {
      await markNotificationAsRead(userId, notificationId);
      const updated = await fetchNotificationHistory();
      setNotifications(updated);
      setUnreadCount(updated.filter((n) => !n.isRead).length);
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead(userId);
      const updated = await fetchNotificationHistory();
      setNotifications(updated);
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  return (
    <div className="relative">
      <button onClick={() => setShowList(!showList)} className="relative">
        <Bell className="text-yellow-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {showList && (
        <div className="absolute right-0 mt-2 w-72 bg-white border shadow-md z-50 max-h-72 overflow-auto rounded-md">
          <div className="flex justify-between items-center p-2 border-b text-sm font-semibold">
            <span>Notifications</span>
            <button
              className="text-blue-500 hover:underline text-xs"
              onClick={handleMarkAllAsRead}
            >
              Mark all as read
            </button>
          </div>
          <ul>
            {notifications.length === 0 && (
              <li className="px-4 py-2 text-sm text-gray-500">
                No notifications
              </li>
            )}
            {notifications.map((note) => (
              <li
                key={note.id}
                onClick={() => handleSingleRead(note.id)}
                className={`px-3 py-2 text-sm cursor-pointer ${
                  !note.isRead ? "font-bold text-black" : "text-gray-800"
                } hover:bg-gray-100 border-b`}
              >
                {note.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
