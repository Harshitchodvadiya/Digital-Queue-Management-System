import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import { IoTicketOutline } from "react-icons/io5";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdOutlineWatchLater } from "react-icons/md";
import { BsPersonCheck } from "react-icons/bs";
import { RiErrorWarningLine } from "react-icons/ri";
import { GoSync } from "react-icons/go";



const UserHomePage = () => {
  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [tokens, setTokens] = useState([]);
  const [serviceActiveTokens, setServiceActiveTokens] = useState({});
  const [peopleAheadMap, setPeopleAheadMap] = useState({});
  const [userId, setUserId] = useState(null);

  const [rescheduleToken, setRescheduleToken] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = Cookies.get("jwtToken");

  // Notification States
  const [notifications, setNotifications] = useState([]); // 🔔 Notifications state
  const [showNotifications, setShowNotifications] = useState(false); // Toggle state
  const [unreadNotifications, setUnreadNotifications] = useState(0); // read and unread

  const navigate = useNavigate();

   // ✅ Load stored notifications from localStorage on page load
  useEffect(() => {

    //localStorage is a built-in web storage API in JavaScript that allows you to store key-value pairs in the browser persistently.
    //The data remains saved even after the page is refreshed or the browser is closed.
    
    const storedNotifications = localStorage.getItem("notifications");
    if (storedNotifications) {
      let parsedNotifications = JSON.parse(storedNotifications);

       // ✅ Ensure notifications have `isRead` property
       parsedNotifications = parsedNotifications.map((notif) =>
        notif.hasOwnProperty("isRead") ? notif : { ...notif, isRead: false }
      );

      // ✅ Set notifications from localStorage
      setNotifications(parsedNotifications);
      
  // ✅ Recalculate unread count after loading
        const unreadCount = parsedNotifications.filter((notif) => !notif.isRead).length;
      setUnreadNotifications(unreadCount);
    }
  }, []);

  // ✅ Store updated notifications in `localStorage` every time they change
useEffect(() => {
  if (notifications.length > 0) {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }
}, [notifications]); // ✅ Runs every time `notifications` updates


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

  //  Subscribe to SSE for Real-Time Notifications
  const subscribeToNotifications = (userId) => {
    const eventSource = new EventSource(`http://localhost:8081/api/v1/notifications/subscribe/${userId}`);
  
    eventSource.onmessage = (event) => {
      console.log("🔔 New Notification:", event.data);
  
      let newNotification;
      try {
        newNotification = JSON.parse(event.data);
      } catch (error) {
        newNotification = { message: event.data, isRead: false };
      }
  
        // ✅ Show toast notification at the top-right corner
    toast.info(newNotification.message, {
      position: "top-right",
      autoClose: 5000, // Hide after 5 sec
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      
    });

      // ✅ Retrieve existing notifications from localStorage
      const storedNotifications = localStorage.getItem("notifications");
      const parsedStoredNotifications = storedNotifications ? JSON.parse(storedNotifications) : [];
  
      // ✅ Merge new notification with stored ones, preserving `isRead` status
      const updatedNotifications = [...parsedStoredNotifications, { ...newNotification, isRead: false }];
  
      // ✅ Save to localStorage
      localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
  
      setNotifications(updatedNotifications);
      setUnreadNotifications((prev) => prev + 1); // ✅ Increase unread count
    };
  
    eventSource.onerror = (error) => {
      console.error("SSE error:", error);
      eventSource.close();
    };
  
    return () => eventSource.close(); // ✅ Cleanup
  };
  

    // ✅ Fetch notification history from the backend
    const fetchNotificationHistory = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/api/v1/notifications/history/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
    
        const fetchedNotifications = response.data;
    
        // ✅ Retrieve stored notifications from localStorage
        const storedNotifications = localStorage.getItem("notifications");
        const parsedStoredNotifications = storedNotifications ? JSON.parse(storedNotifications) : [];
    
        // ✅ Merge `isRead` status from localStorage with fetched notifications
        const updatedNotifications = fetchedNotifications.map((notif) => {
          const storedNotif = parsedStoredNotifications.find((stored) => stored.id === notif.id);
          return storedNotif ? { ...notif, isRead: storedNotif.isRead } : { ...notif, isRead: false };
        });
    
        setNotifications(updatedNotifications);
        
        // ✅ Save merged notifications to `localStorage`
        localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
    
        // ✅ Count unread notifications
        const unreadCount = updatedNotifications.filter(notif => !notif.isRead).length;
        setUnreadNotifications(unreadCount);
        
      } catch (error) {
        console.error("Failed to fetch notification history:", error);
      }
    };
    

    // ✅ Mark a notification as read
    const markAsRead = (notificationId) => {  
      setNotifications((prevNotifications) => { 
        const updatedNotifications = prevNotifications.map((notif) =>
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        );
    
        // ✅ Save updated notifications to `localStorage`
        localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
    
        // ✅ Recalculate unread count
        const unreadCount = updatedNotifications.filter((notif) => !notif.isRead).length;
        setUnreadNotifications(unreadCount);
    
        return updatedNotifications;
      });
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

      setTokens(userTokens.filter(token => token.status !== "COMPLETED" && token.status !== "SKIPPED"  && token.status !== "CANCELLED"));
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

  const cancelToken = async (tokenId) => {
    if (!tokenId) return;
  
    const confirmCancel = window.confirm("Are you sure you want to cancel this token?");
    if (!confirmCancel) return;
  
    try {
      await axios.put(`http://localhost:8081/api/v1/token/cancelToken/${tokenId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      alert("Token canceled successfully!");
      fetchTokensList(); // ✅ Refresh tokens after canceling
    } catch (error) {
      alert(error.response?.data || "Failed to cancel token.");
    }
  };

  const handleRescheduleClick = (token) => {
    setRescheduleToken(token);
    setNewDate("");
    setNewTime("");
  };
  
  const confirmReschedule = async () => {
    if (!newDate || !newTime) {
      alert("Please select a new date and time.");
      return;
    }
  
    const updatedTime = new Date(`${newDate}T${newTime}:00`).toISOString();
  
    try {
      await axios.put(
        `http://localhost:8081/api/v1/token/rescheduleToken/${rescheduleToken.id}`,
        { newIssuedTime: updatedTime }, // Fix here
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      alert("Token rescheduled successfully!");
      setRescheduleToken(null);
      fetchTokensList(); // Refresh token list
    } catch (error) {
      alert(error.response?.data || "Failed to reschedule token.");
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

      {/* ✅ Notification Toast Container */}
    <ToastContainer className="mt-20"></ToastContainer> 
      {/* 🔔 Notification Bell */}
      <div className="absolute top-2.5 left-290">
        <div className="relative">
        {/* 🔥 Toggle on click */}
          <button className="text-white p-2 rounded-full shadow-md"
          onClick={() => setShowNotifications(!showNotifications)} >   
           🔔  {unreadNotifications > 0 && `(${unreadNotifications})`}
          </button>

           {/* Show dropdown only when toggled */}
           {showNotifications && (
            <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-md p-4 max-h-64 overflow-y-auto">
              <h3 className="font-bold">Recent Notifications</h3>
              {notifications.length > 0 ? (
                notifications.map((notif, index) => (
                <p
                key={notif.id || index} 
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
        <div className="w-1/3 h-95 bg-white shadow-md rounded-lg p-6 border border-gray-300">
          <h2 className="text-2xl font-bold mb-4">Request a Token</h2>
          <select className="w-full border p-2 rounded-md" onChange={(e) => setSelectedStaff(staffList.find(staff => staff.id == e.target.value))}>
            <option value="">-- Select Service --</option>
            {staffList.map((staff) => (
              <option key={staff.id} value={staff.id}>{staff.service?.serviceName|| "N/A"} - {staff.service?.estimatedTime ? ` - ${staff.service.estimatedTime} mins` : ""}</option>
            ))}
          </select>
          <input type="date" className="w-full border p-2 rounded-md mt-4" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
          <input type="time" className="w-full border p-2 rounded-md mt-2" value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} />
          <button className="bg-blue-500 px-6 py-3 mt-4 w-full text-white rounded-md font-bold flex items-center justify-center gap-2" onClick={requestToken}> <IoTicketOutline className="h-6 w-6" /> Request Token</button>
          <button
            className="bg-gray-500 px-4 py-2 mt-2 w-full text-white rounded-md font-bold"
            onClick={() => navigate("/token-history")}
          >
            View History
          </button>
        </div>

         


         
        <div className="w-2/3">

          {/* Token Cards */}
          <div className="grid grid-cols-2 gap-6">
            {tokens.length > 0 ? (
              tokens.map((token) => (
                <div
                  key={token.id}
                  className="p-6 shadow-lg rounded-2xl bg-white border border-gray-200"
                >
                  {/* Service Name */}
                  <p className="text-gray-600 text-sm font-semibold">
                    {token.staffId?.service?.serviceName || "Service"}
                  </p>

                  {/* Token Number & Status */}
                  <div className="flex justify-between items-center mt-2">
                    <h3 className="text-xl font-bold">{token.id}</h3>
                    <span className="px-3 py-1 text-sm font-semibold text-blue-600 bg-blue-100 rounded-xl">
                      {token.status || "Waiting"}
                    </span>
                  </div>

                  {/* Estimated Wait Time & Position */}
                  <p className="flex items-center mt-2 text-gray-500">
                  <MdOutlineWatchLater />
                  <span className="ml-1">{Math.floor(token.additionalWaitTime) || 0} min</span>
                  </p>
                  <p className="flex items-center mt-1 text-gray-500">
                  <BsPersonCheck />

                   <span className="ml-1">People Ahead: {peopleAheadMap[token.id] || 0}</span>
                  </p>

                  {serviceActiveTokens[token.staffId?.service?.serviceId] && (
                  <p className="mt-1 p-1 rounded-md font-bold text-black">
                    Current Token for {token.staffId?.firstname} : 
                    <strong> {serviceActiveTokens[token.staffId?.service?.serviceId]?.id}</strong>
                  </p>
                )}
                {peopleAheadMap[token.id] === 0 && (
                    <div className="mt-3 bg-green-200 p-2 rounded-md text-green-700 text-sm flex items-center">
                       Next Turn Will Be Yours
                    </div>
                  )}

                  {/* Notification Box: "Customers ahead of you" */}
                  {peopleAheadMap[token.id] > 0 && peopleAheadMap[token.id] < 4 && (
                    <div className="mt-3 bg-yellow-100 p-2 rounded-md text-yellow-700 text-sm flex items-center">
                    <RiErrorWarningLine />
                    {peopleAheadMap[token.id]} customers ahead of you
                    </div>
                  )}

                  

                  {/* Action Buttons */}
                  <div className="mt-auto flex justify-between pt-4">
                    {token.status === "PENDING" && (
                      <button 
                          onClick={() => handleRescheduleClick(token)}
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-1/2 mr-2 flex items-center justify-center space-x-2"
                        >
                          <GoSync className="h-5 w-5" />  
                          <span>Reschedule</span>
                        </button>

                    )}
                    {token.status === "PENDING" && (
                      <button 
                        onClick={() => cancelToken(token.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 w-1/2"
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center col-span-2">No active tokens</p>
            )}
          </div>
        </div>




        {rescheduleToken && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-300 bg-opacity-90">
            <div className=" bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4">Reschedule Token</h2>
              <p><strong>Current Time:</strong> {formatDateTime(rescheduleToken.issuedTime)}</p>
              
              <label className="block mt-2">New Date:</label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="border p-2 rounded w-full"
                min={new Date().toISOString().split("T")[0]} // Prevent selecting past dates
              />

              <label className="block mt-2">New Time:</label>
              <input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="border p-2 rounded w-full"
                min={
                  newDate === new Date().toISOString().split("T")[0] 
                    ? new Date().toTimeString().slice(0, 5)  // Prevent past time on the current date
                    : "00:00"
                }
              />

              <div className="flex gap-2 mt-4">
                <button 
                  onClick={confirmReschedule} 
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Confirm
                </button>
                <button 
                  onClick={() => setRescheduleToken(null)} 
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
  );
};

export default UserHomePage;
