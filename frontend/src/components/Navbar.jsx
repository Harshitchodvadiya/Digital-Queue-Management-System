// import { useState, useEffect } from "react";
// import { FaUserCircle } from "react-icons/fa";
// import { AiOutlineLogout } from "react-icons/ai";
// import Cookies from "js-cookie";
// import { useNavigate } from "react-router-dom";
// import NotificationPanel from "./User/NotificationPanel";

// const Navbar = ({ title = "Digital Queue Management System" }) => {

//   const navigate = useNavigate();
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [userName, setUserName] = useState("Admin");

//   /**
//    * Fetches the username from cookies and updates the state.
//    * Runs on component mount and updates every second to listen for changes.
//    */
//   useEffect(() => {
//     const fetchUserName = () => {
//       const storedUserName = Cookies.get("firstname");
//       if (storedUserName) {
//         setUserName(storedUserName);
//       }
//     };

//     fetchUserName();

//     // Listen for changes
//     const interval = setInterval(fetchUserName, 1000);
//     return () => clearInterval(interval);   // Cleanup function to clear interval on unmount
//   }, []);

//   /**
//    * Handles user logout by removing authentication-related cookies
//    * and redirecting to the login page.
//    */
//   const handleLogout = () => {
//     Cookies.remove("jwtToken");
//     Cookies.remove("firstname");
//     navigate("/login");
//   };

//   return (
//     <nav className="flex items-center justify-between p-2.5 bg-gray-900 text-white shadow-lg text-center">
     
     
//       {/* Centered Title */}
//       <h1 className="text-xl font-bold text-center flex-grow pl-70" >
//        {title}
//       </h1>
      

//       <div className="flex items-center space-x-4">
//        {/* 🛎️ Notifications */}
//        <NotificationPanel />
//        </div>
      

//       {/* User Dropdown */}
//       <div className="relative w-1/4 flex justify-end">
//         <button
//           onClick={() => setDropdownOpen(!dropdownOpen)}
//           className="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 transition"
//         >
//           <FaUserCircle size={24} />
//           <span>{userName}</span>
//         </button>
//         {dropdownOpen && (
//           <div className="absolute right-0 mt-12 w-40 bg-gray-300 text-black rounded-lg shadow-lg">
//             <button
//               onClick={handleLogout}
//               className="flex items-center w-full px-4 py-2 rounded-lg hover:bg-gray-200 "
//             >
//               <AiOutlineLogout className="mr-2" />
//               Logout
//             </button>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { AiOutlineLogout } from "react-icons/ai";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import NotificationPanel from "./User/NotificationPanel";

const Navbar = ({ title = "Digital Queue Management System" }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userName, setUserName] = useState("Admin");

  /**
   * Fetches the username from cookies and updates the state.
   * Runs on component mount and updates every second to listen for changes.
   */
  useEffect(() => {
    const fetchUserName = () => {
      const storedUserName = Cookies.get("firstname");
      if (storedUserName) {
        setUserName(storedUserName);
      }
    };

    fetchUserName();

    // Listen for changes
    const interval = setInterval(fetchUserName, 1000);
    return () => clearInterval(interval); // Cleanup function to clear interval on unmount
  }, []);

  /**
   * Handles user logout by removing authentication-related cookies
   * and redirecting to the login page.
   */
  const handleLogout = () => {
    Cookies.remove("jwtToken");
    Cookies.remove("firstname");
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between p-2.5 bg-gray-900 text-white shadow-lg">
      {/* Left-aligned Title */}
      <h1 className="text-xl  text-center  ml-100 font-bold pl-6">{title}</h1>

      {/* Centering NotificationPanel and Profile */}
      <div className="flex items-center space-x-4 mr-6">
        {/* Notification Panel */}
        <NotificationPanel />

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 transition"
          >
            <FaUserCircle size={24} />
            <span>{userName}</span>
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-12 w-40 bg-gray-300 text-black rounded-lg shadow-lg">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 rounded-lg hover:bg-gray-200"
              >
                <AiOutlineLogout className="mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
