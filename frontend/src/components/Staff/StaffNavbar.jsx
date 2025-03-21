import { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { AiOutlineLogout } from "react-icons/ai";
import Cookies from "js-cookie";
import { Menu } from "lucide-react";
import StaffSidebar from "./StaffSidebar";

const StaffNavbar = ({ title = "Digital Queue Management System" }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userName, setUserName] = useState("Admin");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  /**
   * Fetches the stored username from cookies and updates the state.
   * This effect runs on component mount and sets up an interval to check for changes.
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
    return () => clearInterval(interval);
  }, []);

  /**
   * Handles user logout by removing authentication cookies and redirecting to the login page.
   */
  const handleLogout = () => {
    Cookies.remove("jwtToken");
    Cookies.remove("firstname");
    window.location.href = "/login";
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-gray-900 text-white shadow-lg text-center">
      {/* Sidebar */}
      <StaffSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Sidebar Toggle Button (Hidden when sidebar is open) */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="absolute top-4 left-4 bg-gray-700 p-2 rounded-md shadow-md hover:bg-gray-600 text-white"
        >
          <Menu size={24} />
        </button>
      )}

      {/* Centered Title */}
      <h1 className="text-xl font-bold text-center flex-grow pl-70">
        {title}
      </h1>

      {/* User Dropdown */}
      <div className="relative w-1/4 flex justify-end">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 transition"
        >
          <FaUserCircle size={24} />
          <span>{userName}</span>
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-lg shadow-lg">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 hover:bg-gray-200"
            >
              <AiOutlineLogout className="mr-2" />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default StaffNavbar;
