// import { Bell } from "lucide-react";
// import { toast } from "react-toastify";
// import {
//   fetchNotificationHistory,
//   subscribeToNotifications,
// } from "../services/NotificationsService";
// import { useState, useEffect } from "react";
// import Cookies from "js-cookie";
// import { jwtDecode } from "jwt-decode";

// const NotificationPanel = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [showList, setShowList] = useState(false);

//   // Load from localStorage initially
//   useEffect(() => {
//     const stored = localStorage.getItem("notifications");
//     console.log(localStorage);
    
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
//     if (notifications.length > 0) {
//       localStorage.setItem("notifications", JSON.stringify(notifications));
//     }
//   }, [notifications]);

//   // Fetch history from backend and merge it with localstorage 
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
//         const decoded = jwtDecode(token);  // Decode the JWT token to extract userId
//         console.log("Decoded token:", decoded);

//         // const userId = decoded.userId;  // Assuming your token contains userId as 'userId'
//         const userId = decoded.sub;

//         const source = subscribeToNotifications(
//           userId,
//           (data) => {
//             toast.info(data.message);

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
//   }, []);

//   const toggleRead = (index) => {
//     const updated = [...notifications];
//     updated[index].isRead = true;
//     setNotifications(updated);
//     setUnreadCount(updated.filter((n) => !n.isRead).length);

//     // Save the updated notifications to localStorage
//     localStorage.setItem("notifications", JSON.stringify(updated));
//   };

//   const markAllAsRead = () => {
//     const updated = notifications.map((n) => ({ ...n, isRead: true }));
//     setNotifications(updated);
//     setUnreadCount(0);

//     // Save the updated notifications to localStorage
//     localStorage.setItem("notifications", JSON.stringify(updated));
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

import { Bell } from "lucide-react";
import {
  fetchNotificationHistory,
  subscribeToNotifications,
} from "../services/NotificationsService";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const NotificationPanel = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showList, setShowList] = useState(false);

  // Load from localStorage on mount
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

  // Save to localStorage when notifications update
  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  // Fetch notification history and merge with localStorage
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

  // Subscribe to SSE
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const userId = decoded.userId;

      const source = subscribeToNotifications(
        userId,
        (data) => {
          

          // Save in local + state using functional updates
          // setNotifications((prevNotifications) => {
          //   const newNotif = {
          //     ...data,
          //     id: Date.now(), // fallback ID if backend doesn't provide
          //     isRead: false,
          //   };
          //   const updated = [newNotif, ...prevNotifications];
          //   setUnreadCount(updated.filter((n) => !n.isRead).length);
          //   localStorage.setItem("notifications", JSON.stringify(updated));
          //   return updated;
          // });

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
  }, []);

  const toggleRead = (index) => {
    const updated = [...notifications];
    updated[index].isRead = true;
    setNotifications(updated);
    setUnreadCount(updated.filter((n) => !n.isRead).length);
    // localStorage.setItem("notifications", JSON.stringify(updated));
  };

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    setNotifications(updated);
    setUnreadCount(0);
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
        <div className="absolute right-0 mt-2 w-72 bg-white border shadow-md z-50 max-h-72 overflow-auto rounded-md">
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