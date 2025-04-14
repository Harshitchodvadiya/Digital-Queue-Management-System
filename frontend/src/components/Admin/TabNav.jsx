import React from "react";
import { SlSettings } from "react-icons/sl";
import { Users } from "lucide-react";
import { FiBarChart } from "react-icons/fi";

function TabNav({ activeTab, setActiveTab }) {
  return (
    <div className="flex space-x-6 border-b border-gray-200 pb-2">
      <button
        onClick={() => setActiveTab("services")}
        className={`text-md font-semibold flex items-center gap-2 ${activeTab === "services" ? "text-gray-900" : "text-gray-600"}`}
      >
        <SlSettings className="h-4 w-4" /> Services
      </button>
      <button
        onClick={() => setActiveTab("staff")}
        className={`text-md font-semibold flex items-center gap-2 ${activeTab === "staff" ? "text-gray-900" : "text-gray-600"}`}
      >
        <Users className="h-4 w-4" /> Staff Members
      </button>
      <button
        onClick={() => setActiveTab("analytics")}
        className={`text-md font-semibold flex items-center gap-2 ${activeTab === "analytics" ? "text-gray-900" : "text-gray-600"}`}
      >
        <FiBarChart className="h-4 w-4" /> Analytics
      </button>
    </div>
  );
}

export default TabNav;