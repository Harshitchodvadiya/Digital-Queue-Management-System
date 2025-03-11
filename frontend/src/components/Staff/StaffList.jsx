import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";

const StaffList = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editStaff, setEditStaff] = useState(null);
  const [services, setServices] = useState([]);
  const adminToken = Cookies.get("jwtToken");
  const navigate = useNavigate();

  /**
   * Fetches the list of staff members from the backend and filters only those with the role "STAFF".
   */
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

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  /**
   * Groups staff members by service to display staff count per service.
   */
  const staffByService = staff.reduce((acc, member) => {
    const serviceName = member.service?.serviceName || "N/A";
    acc[serviceName] = (acc[serviceName] || 0) + 1;
    return acc;
  }, {});

  /**
   * Fetches available services from the backend.
   */
  const fetchServices = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:8081/api/v1/admin/getAllService", {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setServices(response.data);
    } catch (err) {
      console.error("Failed to fetch services");
    }
  }, [adminToken]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  /**
   * Opens the edit modal with the selected staff member's data.
   */
  const handleEditClick = (staffMember) => {
    setEditStaff({
      ...staffMember,
      service_id: staffMember.service?.serviceId || "",
    });
  };

  /**
   * Updates staff details in the backend.
   */
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
      fetchStaff(); // Refresh list after update
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  /**
   * Deletes a staff member from the backend.
   */
  const handleDeleteStaff = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/api/v1/admin/deleteStaff/${id}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      fetchStaff(); // Refresh list after deletion
    } catch (err) {
      console.error("Failed to delete staff member", err);
    }
  };

  return (
    <div className="h-full w-full flex">
      <div className="flex-1 flex flex-col">
        <Navbar title="Staff Members" />
        <div className="p-6">
          <button
            className="bg-gradient-to-br from-[#16213e] to-[#0f3460] text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-500 transition duration-300 mb-4 ml-300"
            onClick={() => navigate("/add-staff")}
          >
            + Add Staff
          </button>

          {/* Display staff count per service */}
          <div className="mb-6 overflow-x-auto">
            <h3 className="text-lg font-semibold mb-2">Staff Count by Service</h3>
            <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
              <thead>
                <tr className="bg-gray-200 text-gray-700 border">
                  <th className="py-2 px-4 border">Service Name</th>
                  <th className="py-2 px-4 border">Total Staff</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(staffByService).map(([service, count]) => (
                  <tr key={service} className="text-center border">
                    <td className="py-2 px-4 border">{service}</td>
                    <td className="py-2 px-4 border">{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Staff List Table */}
          {loading ? (
            <p className="text-center text-gray-600">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : staff.length === 0 ? (
            <p className="text-center text-gray-500">No staff members found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
                <thead>
                  <tr className="bg-gray-200 text-gray-700 border">
                    <th className="py-2 px-4 border">Full Name</th>
                    <th className="py-2 px-4 border">Service Name</th>
                    <th className="py-2 px-4 border">Email</th>
                    <th className="py-2 px-4 border">Mobile</th>
                    <th className="py-2 px-4 border">Actions</th>
                  </tr>
                </thead>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffList;
