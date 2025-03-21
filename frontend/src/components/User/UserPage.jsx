import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";

const UserHomePage = () => {
  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [tokens, setTokens] = useState([]);
  const [serviceActiveTokens, setServiceActiveTokens] = useState({});
  const [peopleAheadMap, setPeopleAheadMap] = useState({});
  const [userId, setUserId] = useState(null);
  const [notifications, setNotifications] = useState([]); // 🔔 Notifications state
  const [showNotifications, setShowNotifications] = useState(false); // Toggle state
  const [unreadNotifications, setUnreadNotifications] = useState(0); // read and unread
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = Cookies.get("jwtToken");

  const navigate = useNavigate();

  useEffect(() => {
    const storedNotifications = localStorage.getItem("notifications");
    if (storedNotifications) {
      const parsedNotifications = JSON.parse(storedNotifications);

       // ✅ Ensure parsed data has `isRead` property
    const correctedNotifications = parsedNotifications.map((notif) =>
      notif.hasOwnProperty("isRead") ? notif : { ...notif, isRead: false }
    );


      // ✅ Set notifications from localStorage
      setNotifications(correctedNotifications);
      
  // ✅ Recalculate unread count after loading
        const unreadCount = parsedNotifications.filter((notif) => !notif.isRead).length;
      setUnreadNotifications(unreadCount);
    }
  }, []);


  // ✅ Decode JWT & Extract User ID
  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const parts = decodedToken.sub.split("/");
        if (parts.length > 1) {
          const userIdPart = parts[1].split(":")[0];
          setUserId(parseInt(userIdPart, 10));
        }
      } catch (error) {
        console.error("Error decoding JWT:", error);
      }
    }
  }, []);

  // ✅ Fetch Data when userId is available
  useEffect(() => {
    if (userId) {
      fetchStaff();
      fetchTokensList();
      subscribeToNotifications(userId);
      fetchNotificationHistory();
    }
  }, [userId]);

  // 🔔 Subscribe to SSE for Real-Time Notifications
  const subscribeToNotifications = (userId) => {
    const eventSource = new EventSource(`http://localhost:8081/api/v1/notifications/subscribe/${userId}`);

    eventSource.onmessage = (event) => {
      console.log("🔔 New Notification:", event.data);
      // setNotifications((prev) => [...prev, event.data]); // Store notifications
      //setNotifications((prev) => [...prev, event.data]); // Force re-render by using a callback function

      let newNotification;
      try {
        newNotification = JSON.parse(event.data);
      } catch (error) {
        newNotification = { message: event.data, isRead: false };
      }
      alert(`🔔 Notification: ${event.data}`); // Show alert  

      setNotifications((prev) => {
        const updatedNotifications = [...prev, { ...newNotification, isRead: false }];

         // ✅ Save to localStorage immediately
      localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
      return updatedNotifications;
      });
      setUnreadNotifications((prev) => prev + 1); // ✅ Increase unread count
     
    };

    eventSource.onerror = (error) => {
      console.error("SSE error:", error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  };

  const fetchNotificationHistory = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/api/v1/notifications/history/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(response.data);
      // ✅ Count unread notifications
      const unreadCount = response.data.filter(notif => !notif.isRead).length;
      setUnreadNotifications(unreadCount);
      } catch (error) {
      console.error("Failed to fetch notification history:", error);
      }
    };

    const markAsRead = (notificationId) => {  
      setNotifications((prevNotifications) => { 
        // ✅ Update notifications state
      const updatedNotifications = prevNotifications.map((notif) =>
      notif.id === notificationId ? { ...notif, isRead: true } : notif
     );
    
        // ✅ Save updated notifications to localStorage
        localStorage.setItem("notifications", JSON.stringify(updatedNotifications));

        // ✅ Recalculate unread count after marking as read
        const unreadCount = updatedNotifications.filter((notif) => !notif.isRead).length;
        setUnreadNotifications(unreadCount);
    
        return updatedNotifications;
      });
    
      // Update unread count
      setUnreadNotifications((prev) => Math.max(0, prev - 1));
    };
    

  // ✅ Fetch Staff List
  const fetchStaff = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8081/api/v1/user/userList", {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });

      const staffData = response.data.filter((user) => user.role === "STAFF");
      setStaffList(staffData);
    } catch (err) {
      setError("Failed to fetch staff members. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch Requested Tokens
  const fetchTokensList = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8081/api/v1/token/getRequestedTokenByUserId/${userId}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });

      const { userTokens, activeTokens, peopleAheadMap } = response.data;

      setTokens(userTokens.filter(token => token.status !== "COMPLETED" && token.status !== "SKIPPED"));
      setPeopleAheadMap(peopleAheadMap); // Update "People Ahead"

      // Map active tokens by service ID
      const activeTokensMap = {};
      activeTokens.forEach((token) => {
        const serviceId = token?.staffId?.service?.serviceId;
        if (serviceId) {
          activeTokensMap[serviceId] = token;
        }
      });

      setServiceActiveTokens(activeTokensMap);
    } catch (err) {
      console.error("Error fetching tokens:", err);
      setError("Failed to fetch tokens. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Request a Token
  const requestToken = async () => {
    if (!selectedStaff || !selectedDate || !selectedTime) {
      alert("Please select a service, date, and time.");
      return;
    }

    if (!userId) {
      alert("User ID not found. Please log in again.");
      return;
    }

    const issuedTime = `${selectedDate}T${selectedTime}:00`;

    const requestBody = {
      user: { id: userId },
      staffId: { id: selectedStaff.id },
      issuedTime,
    };

    try {
      await axios.post("http://localhost:8081/api/v1/token/requestToken", requestBody, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });

      alert("Token requested successfully!");
      fetchTokensList();
    } catch (error) {
      alert(error.response?.data || "Failed to request token.");
    }
  };

  // ✅ Format DateTime
  const formatDateTime = (isoString) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  // ✅ Get Box Color Based on Token Status
  const getBoxColor = (status) => {
    if (status === "PENDING") return "bg-yellow-100 border-yellow-400";
    if (status === "ACTIVE") return "bg-green-300 border-green-400";
    return "bg-white border-gray-300";
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Navbar />

      {/* 🔔 Notification Bell */}
      <div className="absolute top-4 left-290">
        <div className="relative">
        {/* 🔥 Toggle on click */}
          <button className="bg-yellow-500 text-white p-2 rounded-full shadow-md"
          onClick={() => setShowNotifications(!showNotifications)} >   
           🔔  {unreadNotifications > 0 && `(${unreadNotifications})`}
             {/* 🔔 {notifications.length > 0 && `(${notifications.length})`} */}
          </button>

           {/* Show dropdown only when toggled */}
           {showNotifications && (
            <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-md p-4">
              <h3 className="font-bold">Recent Notifications</h3>
              {notifications.length > 0 ? (
                notifications.map((notif, index) => (
            //       <p key={notif.id || index} className="text-sm text-gray-700 mt-2">
            //   📢 {notif.message}
            // </p>
                <p
                key={notif.id}
                className={`text-sm mt-2 cursor-pointer transition-all ${
                  notif.isRead ? "text-gray-600 font-normal" : "text-black font-bold"
                }`}
                onClick={() => markAsRead(notif.id)}
              >
                {notif.isRead ? "📢" : "🔔"} {notif.message}
              </p>
          
                ))
              ) : (
                <p className="text-sm text-gray-500">No new notifications</p>
              )}
            </div>
          )}

        </div>
      </div>

      <div className="flex flex-row p-6 gap-6">
        {/* Left Side: Request Token Section */}
        <div className="w-1/3 bg-white shadow-md rounded-lg p-6 border border-gray-300">
          <h2 className="text-2xl font-bold mb-4">Request a Token</h2>
          <select className="w-full border p-2 rounded-md" onChange={(e) => setSelectedStaff(staffList.find(staff => staff.id == e.target.value))}>
            <option value="">-- Select Service --</option>
            {staffList.map((staff) => (
              <option key={staff.id} value={staff.id}>{staff.service?.serviceName || "N/A"} - {staff.firstname}</option>
            ))}
          </select>
          <input type="date" className="w-full border p-2 rounded-md mt-4" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
          <input type="time" className="w-full border p-2 rounded-md mt-2" value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} />
          <button className="bg-blue-500 px-4 py-2 mt-4 w-full text-white rounded-md font-bold" onClick={requestToken}>Request Token</button>
          <button
            className="bg-gray-500 px-4 py-2 mt-2 w-full text-white rounded-md font-bold"
            onClick={() => navigate("/token-history")}
          >
            View History
          </button>
        </div>

         {/* Right Side: Display Tokens */}
         <div className="w-2/3">
          <h2 className="text-2xl font-bold mb-4">Your Active Tokens</h2>

          <div className="grid grid-cols-2 gap-4">
            {tokens.map((token) => (
              <div
                key={token.id}
                className={`p-4 shadow-md rounded-md border ${getBoxColor(token.status)}`}
              >
                <h3 className="font-bold">Token #{token.id}</h3>
                <p>{token.staffId?.service?.serviceName}</p>
                <p>
                  <strong>Status:</strong> {token.status}
                </p>
                <p>
                  <strong>Issued Time:</strong> {formatDateTime(token.issuedTime)}
                </p>
                <p className="mt-2 text-blue-500 font-bold">
                  People Ahead: {peopleAheadMap[token.id] || 0}
                </p>

                {serviceActiveTokens[token.staffId?.service?.serviceId] && (
                  <p className="mt-2 bg-yellow-200 p-2 rounded-md font-bold text-black">
                    Current Token for {token.staffId?.firstname}: 
                    <strong> #{serviceActiveTokens[token.staffId?.service?.serviceId]?.id}</strong>
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        </div>
      </div>
    
  );
};

export default UserHomePage;
