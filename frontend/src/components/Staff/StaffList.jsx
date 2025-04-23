import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react";
import StaffTable from "./StaffTable";
import StaffByServiceTable from "./StaffByServiceTable.jsx";

const StaffList = () => {
  const [staff, setStaff] = useState([]); 

  const navigate = useNavigate();
  return (
    <div className="h-full w-full flex">
      <div className="flex-1 flex flex-col p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-700">Staff Management</h3>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg shadow flex items-center gap-2"
            onClick={() => navigate("/add-staff")}
          >
            <Users className="h-5 w-5" /> Add Staff Members
          </button>
        </div>
  
        <StaffTable/>
  
        {/* ✅ Compute and pass staffByService correctly */}
        <StaffByServiceTable
          staffByService={staff.reduce((acc, member) => {
            const serviceName = member.service?.serviceName || "N/A";
            acc[serviceName] = (acc[serviceName] || 0) + 1;
            return acc;
          }, {})}
        />

      </div>
    </div>
  );
};

export default StaffList;
