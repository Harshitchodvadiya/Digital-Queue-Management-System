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
  const [role, setRole] = useState("");

  /**
   * Fetches the username from cookies and updates the state.
   * Runs on component mount and updates every second to listen for changes.
   */
  useEffect(() => {
    const fetchUserInfo = () => {
      const userName = Cookies.get("firstname");   
      const storedUserName = userName.split(".")[0]; //"archie.koshti"     

      if (storedUserName) {
        setUserName(storedUserName);
      }

      const roleCookie = Cookies.get("role");
      if (roleCookie) {
        setRole(roleCookie);
      }
    };

    fetchUserInfo();

    // Listen for changes
    const interval = setInterval(fetchUserInfo, 300);
    return () => clearInterval(interval); // Cleanup function to clear interval on unmount
  }, []);

  /**
   * Handles user logout by removing authentication-related cookies
   * and redirecting to the login page.
   */
  const handleLogout = () => {
    Cookies.remove("jwtToken");
    Cookies.remove("firstname");
    Cookies.remove("role");
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between p-2.5 bg-gray-900 text-white shadow-lg">
      {/* Left-aligned Title */}
      <h1 className="text-xl  text-center  ml-100 font-bold pl-6">{title}</h1>

      {/* Centering NotificationPanel and Profile */}
      <div className="flex items-center space-x-4 mr-6">
        {/* Notification Panel */}
        {role === "USER" && <NotificationPanel />}

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
            <div className="absolute right-0 mt-1 w-40 bg-gray-300 text-black rounded-lg shadow-lg">
              {role === "USER" && <button
                onClick={() => navigate("/profile")}
                className="flex items-center w-full px-4 py-2 rounded-lg hover:bg-gray-200"
              >
                <FaUserCircle size={20} className="mr-2"/>
               Profile
              </button>
              }
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
