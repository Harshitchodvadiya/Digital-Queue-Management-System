import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie"; 

import Navbar from "../Navbar"
const UserHomePage = () => {

  const [tokenmodal,setTokenModal] = useState("false");
//   const [staffList, setStaffList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const token = Cookies.get("jwtToken");

//   /**
//    * Fetches the list of staff members when the component mounts.
//    */
//   useEffect(() => {
//     fetchStaff();
//   }, []);

//   /**
//    * Fetches the list of staff members from the API and filters out only those with the role "STAFF".
//    * Handles loading and error states appropriately.
//    */
//   const fetchStaff = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get("http://localhost:8081/api/v1/user/userList", {
//         withCredentials: true,
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const staffData = response.data.filter((user) => user.role === "STAFF");
//       setStaffList(staffData);
//     } catch (err) {
//       setError("Failed to fetch staff members. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-5xl mx-auto p-6 bg-gray-100 min-h-screen">
//       {/* Page Title */}
//       <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Available Staff</h2>
      
//       {/* Loading, Error, or Staff List Display */}
//       {loading ? (
//         <p className="text-center text-gray-600">Loading...</p>
//       ) : error ? (
//         <p className="text-center text-red-500">{error}</p>
//       ) : staffList.length === 0 ? (
//         <p className="text-center text-gray-500">No staff members found.</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//           {staffList.map((staff) => (
//             <div key={staff.id} className="border p-4 rounded-lg shadow-lg bg-white">
//               <h2 className="text-xl font-bold">{staff.firstname}</h2>
//               <p className="text-gray-600">
//                 <strong>Service:</strong> {staff.service?.serviceName || "N/A"}
//               </p>
//               <p className="text-gray-500">{staff.service?.serviceDescription || "No description available"}</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );

return (
  <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white">
    <Navbar/>

    {/* Page Content */}
    <div className="flex flex-col items-center justify-center flex-grow p-6">
      <div className="text-center p-6 bg-white shadow-lg rounded-lg text-gray-900 w-full max-w-4xl">
        <h2 className="text-3xl font-bold">Welcome to the User Dashboard!</h2>
        
      </div>

    <div className="flex flex-col items-end w-30">
      <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white py-3 rounded-lg font-semibold text-md transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            onClick={setTokenModal="true"}
          >Request Token</button>
    </div>
      
    </div>
  </div>
);
 };

export default UserHomePage;
