// AdminPage.js
import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";

function AdminPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-900 via-black to-gray-900 text-white">
      {/* Sidebar Toggle Button */}
      <button 
        onClick={() => setIsSidebarOpen(true)} 
        className="absolute top-4 left-4 bg-gray-700 p-2 rounded-md shadow-md hover:bg-gray-600"
      >
        <Menu size={24} />
      </button>
      
      {/* Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-grow p-6">
        <h2 className="text-4xl font-bold mb-6">Welcome to Admin Panel</h2>
        <p className="text-lg text-gray-300">Manage staff and system settings efficiently.</p>
      </div>
    </div>
  );
}

export default AdminPage;
