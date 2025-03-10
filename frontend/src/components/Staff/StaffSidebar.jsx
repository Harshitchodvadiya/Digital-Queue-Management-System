import { useNavigate } from "react-router-dom";
import { X, LogOut } from "lucide-react";
import Cookies from "js-cookie";

function StaffSidebar({ isOpen, onClose }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("jwtToken");
    onClose(); // Close sidebar
    navigate("/login");
  };

  return (
    <div
      className={`fixed top-0 left-0 w-64 h-full bg-gradient-to-b from-gray-900 to-gray-800 p-6 flex flex-col space-y-6 shadow-xl transition-transform transform ${
        isOpen ? "translate-x-0" : "-translate-x-64"
      } duration-300 ease-in-out border-r border-gray-700`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-2">
        <h2 className="text-xl font-semibold text-white tracking-wide">Staff Panel</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white transition-all duration-200">
          <X size={24} />
        </button>
      </div>

      {/* Navigation Buttons */}
      <nav className="flex flex-col space-y-4 flex-grow">
        <button
          onClick={() => {
            navigate("/staff");
            onClose();
          }}
          className="text-white text-lg font-medium hover:text-purple-400 transition-all duration-200"
        >
          Dashboard
        </button>
        <button
          onClick={() => {
            navigate("/staff-token-list");
            onClose();
          }}
          className="text-white text-lg font-medium hover:text-purple-400 transition-all duration-200"
        >
          Requested Tokens
        </button>
        
        <button
          onClick={handleLogout}
          className="text-white text-lg font-medium hover:text-purple-400 transition-all duration-200"
        >
          <span>Log out</span>
        </button>
      </nav>
    </div>
  );
}

export default StaffSidebar;