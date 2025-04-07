// import { useEffect, useState } from "react";
// import Navbar from "../Navbar";
// import axios from "axios";
// import Cookies from "js-cookie";
// import { GoClock } from "react-icons/go";
// import { LuTimer } from "react-icons/lu";
// import { Users} from "lucide-react";
// import { IoTicketOutline } from "react-icons/io5";

// function AdminPage() {
//   const [tokens, setTokens] = useState([]);
//   const [totalTokens, setTotalTokens] = useState(0);
//   const [averageWaitingTime, setAverageWaitingTime] = useState({ mins: 0, secs: 0 });
//   const [totalStaff, setTotalStaff] = useState(0);
//   const [error, setError] = useState(0);
//   const [todaysTokens, setTodaysTokens] = useState(0);

//   const token = Cookies.get("jwtToken");
//   useEffect(() => {
    
//     fetchRequestedTokens();
//     fetchStaff();
//   }, []);

//   const fetchRequestedTokens = async () => {
//     try {
//       const response = await axios.get("http://localhost:8081/api/v1/token/getAllRequestedToken", {
//         withCredentials: true,
//         headers: {
//           "Authorization": `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });
  
//       const fetchedTokens = response.data;
//       console.log("Fetched Tokens from API:", fetchedTokens); // Debug API Response
  
//       setTokens(fetchedTokens);
//       setTotalTokens(fetchedTokens.length);
  
//       // ✅ Filter only COMPLETED tokens & ignore extreme waiting times
//       const completedTokens = fetchedTokens
//         .filter(token => token.status === "COMPLETED" && token.completedTime)
//         .filter(token => {
//           const issuedTime = new Date(token.issuedTime).getTime();
//           const completedTime = new Date(token.completedTime).getTime();
//           const waitingTimeMs = completedTime - issuedTime;
//           return waitingTimeMs <= 7200000; // Ignore tokens with wait time > 2 hours (7200000 ms)
//         });
  
//       if (completedTokens.length > 0) {
//         let totalWaitingTimeMs = 0;
  
//         completedTokens.forEach(token => {
//           const issuedTime = new Date(token.issuedTime).getTime();
//           const completedTime = new Date(token.completedTime).getTime();
//           const waitingTimeMs = completedTime - issuedTime;
  
//           console.log(`Token ID: ${token.id}`);
//           console.log(`Issued Time: ${token.issuedTime} -> ${issuedTime}`);
//           console.log(`Completed Time: ${token.completedTime} -> ${completedTime}`);
//           console.log(`Time Difference (ms): ${waitingTimeMs}`);
//           console.log("--------------------------------");
  
//           totalWaitingTimeMs += waitingTimeMs;
//         });
  
//         // ✅ Convert milliseconds to minutes & seconds correctly
//         const avgWaitingTimeMs = totalWaitingTimeMs / completedTokens.length;
//         const avgMinutes = Math.floor(avgWaitingTimeMs / 60000);
//         const avgSeconds = Math.floor((avgWaitingTimeMs % 60000) / 1000);
  
//         console.log(`Total Waiting Time (ms): ${totalWaitingTimeMs}`);
//         console.log(`Average Waiting Time: ${avgMinutes} mins ${avgSeconds} secs`);
  
//         setAverageWaitingTime({ mins: avgMinutes, secs: avgSeconds });
//       } else {
//         setAverageWaitingTime({ mins: 0, secs: 0 });
//       }


//       // Get today's date boundaries
//       const today = new Date();
//       today.setHours(0, 0, 0, 0); // Midnight start of today
//       const tomorrow = new Date(today);
//       tomorrow.setDate(today.getDate() + 1); // Midnight start of tomorrow

//       // Filter tokens where issuedTime is today
//       const todayTokens = fetchedTokens.filter(token => {
//         const issuedTime = new Date(token.issuedTime);
//         return issuedTime >= today && issuedTime < tomorrow;
//       });

//       setTodaysTokens(todayTokens.length);
  
//     } catch (error) {
//       console.error("Error fetching tokens:", error);
//     }
//   };

//    const fetchStaff = async () => {
//       setError("");
//       try {
//         const response = await axios.get("http://localhost:8081/api/v1/admin/userList", {
//           withCredentials: true,
//           headers: { Authorization: `Bearer ${token}` },
//           "Content-Type": "application/json",
//         });
          
//         const fetchedStaff = (response.data.filter((member) => member.role === "STAFF"));
//         console.log("Fetched Staff Members:", fetchedStaff);

//         setTotalStaff(fetchedStaff.length);

//       } catch (err) {
//         setError(err.response?.data?.message || "Failed to fetch staff members.");
//       } 
//     };

//   return (
//     <div className="h-screen w-screen flex flex-col overflow-hidden">
//       <Navbar />

//       <div className="container mx-auto px-6 py-6">
//         <div className="mb-4">
//           <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
//           <p className="text-gray-600">Manage services, staff and system settings</p>
//         </div>  
//         </div>  

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-11/12 mt-5 ml-12">
//           {/* Total Tokens */}
//           <div className="bg-white text-gray-900 p-6 rounded-2xl shadow-2xl w-full max-w-xs">
//               <div className="flex items-center justify-between mb-2">
//                 <h3 className="text-lg font-semibold text-gray-700">Total Tokens</h3>
//                 <LuTimer className="w-6 h-6 text-gray-500" />
//               </div>
//               <p className="text-3xl font-bold text-gray-900">{totalTokens}</p>
//             </div>  
           
//           {/* Avg. Wait Time */}
//             <div className="bg-white text-gray-900 p-6 rounded-2xl shadow-2xl w-full max-w-xs">
//               <div className="flex items-center justify-between mb-2">
//                 <h3 className="text-lg font-semibold text-gray-700">Avg. Wait Time</h3>
//                 <GoClock className="w-5 h-5 text-gray-500" />
//               </div>
//               <p className="text-3xl font-bold text-gray-900">{averageWaitingTime.mins} min</p>
//             </div>  

//           {/* Staff Members (Static for now – update if needed) */}

//           <div className="bg-white text-gray-900 p-6 rounded-2xl shadow-2xl w-full max-w-xs">
//               <div className="flex items-center justify-between mb-2">
//                 <h3 className="text-lg font-semibold text-gray-700">Staff Members</h3>
//                 <Users className="w-5 h-5 text-gray-500" />
//               </div>
//               <p className="text-3xl font-bold text-gray-900">{totalStaff}</p>
//             </div>  

//           {/* Today's Token */}
//           <div className="bg-white text-gray-900 p-6 rounded-2xl shadow-2xl w-full max-w-xs">
//               <div className="flex items-center justify-between mb-2">
//                 <h3 className="text-lg font-semibold text-gray-700">Today's Tokens</h3>
//                 <IoTicketOutline className="w-5 h-5 text-gray-500" />
//               </div>
//               <p className="text-3xl font-bold text-gray-900">{todaysTokens}</p>
//             </div>           
//         </div>

//     </div>
//   );
// }

// export default AdminPage;

import { useEffect, useState } from "react";
import Navbar from "../Navbar";
import axios from "axios";
import Cookies from "js-cookie";
import { GoClock } from "react-icons/go";
import { LuTimer } from "react-icons/lu";
import { Users } from "lucide-react";
import { IoTicketOutline } from "react-icons/io5";
import ServiceList from "./ServiceList";
import StaffList from "../Staff/StaffList";
import { SlSettings } from "react-icons/sl";

function AdminPage() {
  const [tokens, setTokens] = useState([]);
  const [totalTokens, setTotalTokens] = useState(0);
  const [averageWaitingTime, setAverageWaitingTime] = useState({ mins: 0, secs: 0 });
  const [totalStaff, setTotalStaff] = useState(0);
  const [error, setError] = useState(0);
  const [todaysTokens, setTodaysTokens] = useState(0);
  const [activeTab, setActiveTab] = useState("services");

  const token = Cookies.get("jwtToken");

  useEffect(() => {
    fetchRequestedTokens();
    fetchStaff();
  }, []);

  const fetchRequestedTokens = async () => {
    try {
      const response = await axios.get("http://localhost:8081/api/v1/token/getAllRequestedToken", {
        withCredentials: true,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const fetchedTokens = response.data;
      setTokens(fetchedTokens);
      setTotalTokens(fetchedTokens.length);

      const completedTokens = fetchedTokens
        .filter(token => token.status === "COMPLETED" && token.completedTime)
        .filter(token => {
          const issuedTime = new Date(token.issuedTime).getTime();
          const completedTime = new Date(token.completedTime).getTime();
          const waitingTimeMs = completedTime - issuedTime;
          return waitingTimeMs <= 7200000;
        });

      if (completedTokens.length > 0) {
        let totalWaitingTimeMs = 0;
        completedTokens.forEach(token => {
          const issuedTime = new Date(token.issuedTime).getTime();
          const completedTime = new Date(token.completedTime).getTime();
          totalWaitingTimeMs += (completedTime - issuedTime);
        });

        const avgWaitingTimeMs = totalWaitingTimeMs / completedTokens.length;
        const avgMinutes = Math.floor(avgWaitingTimeMs / 60000);
        const avgSeconds = Math.floor((avgWaitingTimeMs % 60000) / 1000);
        setAverageWaitingTime({ mins: avgMinutes, secs: avgSeconds });
      } else {
        setAverageWaitingTime({ mins: 0, secs: 0 });
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      const todayTokens = fetchedTokens.filter(token => {
        const issuedTime = new Date(token.issuedTime);
        return issuedTime >= today && issuedTime < tomorrow;
      });

      setTodaysTokens(todayTokens.length);

    } catch (error) {
      console.error("Error fetching tokens:", error);
    }
  };

  const fetchStaff = async () => {
    setError("");
    try {
      const response = await axios.get("http://localhost:8081/api/v1/admin/userList", {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
        "Content-Type": "application/json",
      });

      const fetchedStaff = response.data.filter((member) => member.role === "STAFF");
      setTotalStaff(fetchedStaff.length);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch staff members.");
    }
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case "services":
        return <ServiceList />;
      case "staff":
        return <StaffList />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col">
      <Navbar />

      <div className="container mx-auto px-6 py-6">
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage services, staff and system settings</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-11/12 mt-5 ml-12">
        <div className="bg-white text-gray-900 p-6 rounded-2xl shadow-2xl w-full max-w-xs">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-700">Total Tokens</h3>
            <LuTimer className="w-6 h-6 text-gray-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalTokens}</p>
        </div>

        <div className="bg-white text-gray-900 p-6 rounded-2xl shadow-2xl w-full max-w-xs">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-700">Avg. Wait Time</h3>
            <GoClock className="w-5 h-5 text-gray-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{averageWaitingTime.mins} min</p>
        </div>

        <div className="bg-white text-gray-900 p-6 rounded-2xl shadow-2xl w-full max-w-xs">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-700">Staff Members</h3>
            <Users className="w-5 h-5 text-gray-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalStaff}</p>
        </div>

        <div className="bg-white text-gray-900 p-6 rounded-2xl shadow-2xl w-full max-w-xs">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-700">Today's Tokens</h3>
            <IoTicketOutline className="w-5 h-5 text-gray-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{todaysTokens}</p>
        </div>
      </div>

      {/* Tab Nav */}
      <div className="mt-8 ml-12">
        <div className="flex space-x-6 border-b border-gray-200 pb-2">
          <button
            onClick={() => setActiveTab("services")}
            className={`text-md font-semibold hover:cursor-pointer flex items-center gap-2  ${
              activeTab === "services" ? "text-gray-900" : "text-gray-600"
            }`}
          >
           <SlSettings className="h-4 w-4" />  Services
          </button>
          <button
            onClick={() => setActiveTab("staff")}
            className={`text-md font-semibold hover:cursor-pointer  flex items-center gap-2 ${
              activeTab === "staff" ? "text-gray-900" : "text-gray-600"
            }`}
          >
          <Users className="h-4 w-4"/>  Staff Members
          </button>
        </div>
      </div>

      {/* Render Tab Content */}
      <div className="p-6">{renderActiveTab()}</div>
    </div>
  );
}

export default AdminPage;


