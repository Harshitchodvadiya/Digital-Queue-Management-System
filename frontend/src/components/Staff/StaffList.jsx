import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react";
import StaffTable from "./StaffTable";
import EditStaffModal from "./EditStaffModal";
import StaffByServiceTable from "./StaffByServiceTable.jsx";

const StaffList = () => {
  const [staff, setStaff] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editStaff, setEditStaff] = useState(null);
  const adminToken = Cookies.get("jwtToken");
  const navigate = useNavigate();

  useEffect(() => {
    fetchStaff();
    fetchServices();
  }, []);

  const fetchStaff = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get("http://localhost:8081/api/v1/admin/userList", {
        withCredentials: true,
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setStaff(response.data.filter((member) => member.role === "STAFF"));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch staff members.");
    } finally {
      setLoading(false);
    }
  }, [adminToken]);

  const fetchServices = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:8081/api/v1/admin/getAllService", {
        withCredentials: true,
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      console.log(response.data);
      
      setServices(response.data);
    } catch (err) {
      console.error("Failed to fetch services");
    }
  }, [adminToken]);

  const handleEditClick = (staffMember) => {
    setEditStaff({
      ...staffMember,
      service_id: staffMember.service?.serviceId || "",
    });
  };

  const handleUpdateStaff = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:8081/api/v1/admin/updateStaff/${editStaff.id}`,
        {
          firstname: editStaff.firstname,
          email: editStaff.email,
          mobileNumber: editStaff.mobileNumber,
          password: editStaff.password || "",
          service_id: editStaff.service_id,
        },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      setEditStaff(null);
      fetchStaff();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleDeleteStaff = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/api/v1/admin/deleteStaff/${id}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      fetchStaff();
    } catch (err) {
      console.error("Failed to delete staff member", err);
    }
  };

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
  
        <StaffTable
          staff={staff}
          loading={loading}
          error={error}
          onEdit={handleEditClick}
          onDelete={handleDeleteStaff}
        />
  
        {/* ✅ Compute and pass staffByService correctly */}
        <StaffByServiceTable
          staffByService={staff.reduce((acc, member) => {
            const serviceName = member.service?.serviceName || "N/A";
            acc[serviceName] = (acc[serviceName] || 0) + 1;
            return acc;
          }, {})}
        />
  
        {editStaff && (
          <EditStaffModal
            editStaff={editStaff}
            services={services}
            setEditStaff={setEditStaff}
            handleUpdateStaff={handleUpdateStaff}
          />
        )}
      </div>
    </div>
  );
};

export default StaffList;
