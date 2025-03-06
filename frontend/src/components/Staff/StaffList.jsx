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

  // Fetch staff list
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

  const staffByService = staff.reduce((acc, member) => {
        const serviceName = member.service?.serviceName || "N/A";
        acc[serviceName] = (acc[serviceName] || 0) + 1;
        return acc;
      }, {});

  // Fetch available services
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

  // Open edit modal with staff data
  const handleEditClick = (staffMember) => {
    setEditStaff({
      ...staffMember,
      service_id: staffMember.service?.serviceId || "", // Ensure service ID is set
    });
  };

  // Handle staff update
  const handleUpdateStaff = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:8081/api/v1/admin/updateStaff/${editStaff.id}`,
        {
          firstname: editStaff.firstname,
          email: editStaff.email,
          mobileNumber: editStaff.mobileNumber,
          password: editStaff.password || "", // Send password only if changed
          service_id: editStaff.service_id, // Ensure service is updated
        },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );

      setEditStaff(null);
      fetchStaff(); // Refresh the staff list after update
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  // Delete staff member
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

          

          {/* Staff Count Table */}
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
                <tbody>
                  {staff.map((member) => (
                    <tr key={member.id} className="text-center border">
                      <td className="py-2 px-4 border">{member.firstname}</td>
                      <td className="py-2 px-4 border">{member.service?.serviceName || "N/A"}</td>
                      <td className="py-2 px-4 border">{member.email}</td>
                      <td className="py-2 px-4 border">{member.mobileNumber}</td>
                      <td className="py-2 px-4 border">
                        <div className="flex justify-center space-x-2">
                          <button
                            className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-700"
                            onClick={() => handleEditClick(member)}
                          >
                            Edit
                          </button>
                          <button
                            className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-700"
                            onClick={() => handleDeleteStaff(member.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Edit Staff Modal */}
      {editStaff && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Staff</h2>
            <form onSubmit={handleUpdateStaff}>
              <label>First Name:</label>
              <input
                type="text"
                value={editStaff.firstname}
                onChange={(e) => setEditStaff({ ...editStaff, firstname: e.target.value })}
                className="w-full border p-2 mb-2"
              />

<label>Service:</label>
              <select
                value={editStaff.service_id}
                onChange={(e) => setEditStaff({ ...editStaff, service_id: e.target.value })}
                className="w-full border p-2 mb-2"
              >
                <option value="">Select Service</option>
                {services.map((service) => (
                  <option key={service.serviceId} value={service.serviceId}>
                    {service.serviceName}
                  </option>
                ))}
              </select>

              <label>Email:</label>
              <input
                type="email"
                value={editStaff.email}
                onChange={(e) => setEditStaff({ ...editStaff, email: e.target.value })}
                className="w-full border p-2 mb-2"
              />

              <label>Mobile:</label>
              <input
                type="text"
                value={editStaff.mobileNumber}
                onChange={(e) => setEditStaff({ ...editStaff, mobileNumber: e.target.value })}
                className="w-full border p-2 mb-2"
              />

              

              <button className="bg-green-500 text-white px-4 py-2 rounded" type="submit">
                Save
              </button>
              <button className="ml-2 bg-gray-400 text-white px-4 py-2 rounded" onClick={() => setEditStaff(null)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffList;
