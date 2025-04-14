import { Bell } from "lucide-react";
import { toast } from "react-toastify";
import {
  fetchNotificationHistory,
  subscribeToNotifications,
} from "../services/NotificationsService";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

const NotificationPanel = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showList, setShowList] = useState(false);

  // Load from localStorage initially
  useEffect(() => {
    const stored = localStorage.getItem("notifications");
    if (stored) {
      const parsed = JSON.parse(stored).map((notif) =>
        notif.hasOwnProperty("isRead") ? notif : { ...notif, isRead: false }
      );
      setNotifications(parsed);
      setUnreadCount(parsed.filter((n) => !n.isRead).length);
    }
  }, []);

  // Save to localStorage when notifications change
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem("notifications", JSON.stringify(notifications));
    }
  }, [notifications]);

  // Fetch history from backend
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await fetchNotificationHistory();
        const stored = JSON.parse(localStorage.getItem("notifications")) || [];

        const merged = history.map((notif) => {
          const local = stored.find((n) => n.id === notif.id);
          return local ? { ...notif, isRead: local.isRead } : { ...notif, isRead: false };
        });

        setNotifications(merged);
        setUnreadCount(merged.filter((n) => !n.isRead).length);
      } catch (err) {
        console.error("Failed to fetch notification history:", err);
      }
    };

    loadHistory();
  }, []);

  // Real-time subscription via SSE (Get userId from JWT token stored in cookies)
  useEffect(() => {
    const token = Cookies.get("token");  // Get the token from cookies
    if (token) {
      try {
        const decoded = jwt_decode(token);  // Decode the JWT token to extract userId
        const userId = decoded.userId;  // Assuming your token contains userId as 'userId'

        const source = subscribeToNotifications(
          userId,
          (data) => {
            toast.info(data.message, {
              position: "top-right",
              autoClose: 5000,
            });

            const updated = [
              { ...data, id: Date.now(), isRead: false }, // Fallback ID if backend doesn't provide
              ...notifications,
            ];

            setNotifications(updated);
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
  }, [notifications]);

  const toggleRead = (index) => {
    const updated = [...notifications];
    updated[index].isRead = true;
    setNotifications(updated);
    setUnreadCount(updated.filter((n) => !n.isRead).length);

    // Save the updated notifications to localStorage
    localStorage.setItem("notifications", JSON.stringify(updated));
  };

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    setNotifications(updated);
    setUnreadCount(0);

    // Save the updated notifications to localStorage
    localStorage.setItem("notifications", JSON.stringify(updated));
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
        <div className="absolute right-0 mt-2 w-70 bg-white border shadow-md z-50 max-h-70 overflow-auto rounded-md">
          <div className="flex justify-between items-center p-2 border-b text-sm font-semibold">
            <span>Notifications</span>
            <button
              className="text-blue-500 hover:underline text-xs"
              onClick={markAllAsRead}
            >
              Mark all as read
            </button>
          </div>
          <ul>
            {notifications.length === 0 && (
              <li className="px-4 py-2 text-sm text-gray-500">No notifications</li>
            )}
            {notifications.map((note, i) => (
              <li
                key={i}
                onClick={() => toggleRead(i)}
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

// import { Bell } from "lucide-react";
// import { toast } from "react-toastify";
// import {
//   fetchNotificationHistory,
//   subscribeToNotifications,
// } from "../services/NotificationsService";
// import { useState, useEffect } from "react";
// import Cookies from "js-cookie";
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';


// const NotificationPanel = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [showList, setShowList] = useState(false);

//   // Load from localStorage initially
//   useEffect(() => {
//     const stored = localStorage.getItem("notifications");
//     if (stored) {
//       const parsed = JSON.parse(stored).map((notif) =>
//         notif.hasOwnProperty("isRead") ? notif : { ...notif, isRead: false }
//       );
//       setNotifications(parsed);
//       setUnreadCount(parsed.filter((n) => !n.isRead).length);
//     }
//   }, []);

//   // Save to localStorage when notifications change
//   useEffect(() => {
//     localStorage.setItem("notifications", JSON.stringify(notifications));
//   }, [notifications]);

//   // Fetch history from backend
//   useEffect(() => {
//     const loadHistory = async () => {
//       try {
//         const history = await fetchNotificationHistory();
//         const stored = JSON.parse(localStorage.getItem("notifications")) || [];

//         const merged = history.map((notif) => {
//           const local = stored.find((n) => n.id === notif.id);
//           return local ? { ...notif, isRead: local.isRead } : { ...notif, isRead: false };
//         });

//         setNotifications(merged);
//         setUnreadCount(merged.filter((n) => !n.isRead).length);
//       } catch (err) {
//         console.error("Failed to fetch notification history:", err);
//       }
//     };

//     loadHistory();
//   }, []);

//   // Real-time subscription via SSE (Get userId from JWT token stored in cookies)
//   useEffect(() => {
//     const token = Cookies.get("token");  // Get the token from cookies
//     if (token) {
//       try {
//         const decoded = jwt_decode(token);  // Decode the JWT token to extract userId
//         const userId = decoded.userId;  // Assuming your token contains userId as 'userId'

//         const source = subscribeToNotifications(
//           userId,
//           (data) => {
//             // Toast for 'Turn Called'
//             if (data.type === "ACTIVE") {
//               toast.success("It's your turn now!", {
//                 position: "top-right",
//                 autoClose: 5000,
//               });
//             }
//             // Toast for 'Turn Skipped'
//             if (data.type === "SKIPPED") {
//               toast.error("Your turn was skipped!", {
//                 position: "top-right",
//                 autoClose: 5000,
//               });
//             }

//             // Add new notification to the list
//             const updated = [
//               { ...data, id: Date.now(), isRead: false }, // Fallback ID if backend doesn't provide
//               ...notifications,
//             ];

//             setNotifications(updated);
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
//   }, [notifications]);

//   const toggleRead = (index) => {
//     const updated = [...notifications];
//     updated[index].isRead = true;
//     setNotifications(updated);
//     setUnreadCount(updated.filter((n) => !n.isRead).length);
//   };

//   const markAllAsRead = () => {
//     const updated = notifications.map((n) => ({ ...n, isRead: true }));
//     setNotifications(updated);
//     setUnreadCount(0);
//   };

//   return (
//     <div className="relative">
//       <button onClick={() => setShowList(!showList)} className="relative">
//         <Bell className="text-yellow-600" />
//         {unreadCount > 0 && (
//           <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
//             {unreadCount}
//           </span>
//         )}
//       </button>

//       {showList && (
//         <div className="absolute right-0 mt-2 w-70 bg-white border shadow-md z-50 max-h-70 overflow-auto rounded-md">
//           <div className="flex justify-between items-center p-2 border-b text-sm font-semibold">
//             <span>Notifications</span>
//             <button
//               className="text-blue-500 hover:underline text-xs"
//               onClick={markAllAsRead}
//             >
//               Mark all as read
//             </button>
//           </div>
//           <ul>
//             {notifications.length === 0 && (
//               <li className="px-4 py-2 text-sm text-gray-500">No notifications</li>
//             )}
//             {notifications.map((note, i) => (
//               <li
//                 key={i}
//                 onClick={() => toggleRead(i)}
//                 className={`px-3 py-2 text-sm cursor-pointer ${
//                   !note.isRead ? "font-bold text-black" : "text-gray-800"
//                 } hover:bg-gray-100 border-b`}
//               >
//                 {note.message}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default NotificationPanel;
