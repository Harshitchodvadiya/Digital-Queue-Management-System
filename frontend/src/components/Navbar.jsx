import { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { AiOutlineLogout } from "react-icons/ai";
import Cookies from "js-cookie";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userName, setUserName] = useState("Admin");

  useEffect(() => {
    const storedUserName = Cookies.get("firstname");
    setUserName(storedUserName || "Admin");
    console.log(storedUserName);
    
  }, []);

  const handleLogout = () => {
    Cookies.remove("jwtToken");
    Cookies.remove("firstname");
    window.location.href = "/login";
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-900 text-white shadow-lg">
      <h1 className="text-xl font-bold">Digital Queue Management System</h1>
      <div className="relative">
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

export default Navbar;
