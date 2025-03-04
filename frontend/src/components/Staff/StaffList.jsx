import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const StaffList = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const adminToken = Cookies.get("jwtToken");

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8081/api/v1/admin/userList", {
        withCredentials: true,
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setStaff(response.data.filter((member) => member.role === "STAFF"));
    } catch (err) {
      setError("Failed to fetch staff members. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (staff) => {
    setSelectedStaff(staff);
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this staff member?")) return;

    try {
      await axios.delete(`http://localhost:8081/api/v1/admin/deleteStaff/${id}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      alert("Staff member deleted successfully!");
      fetchStaff();
    } catch (error) {
      alert("Failed to delete staff member. Please try again.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Staff Members</h2>
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
                <th className="py-2 px-4 border">Service ID</th>
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
                  <td className="py-2 px-4 border">{member.service?.serviceId}</td>
                  <td className="py-2 px-4 border">{member.service?.serviceName}</td>
                  <td className="py-2 px-4 border">{member.email}</td>
                  <td className="py-2 px-4 border">{member.mobileNumber}</td>
                  <td className="py-2 px-4 flex justify-center space-x-2">
                    <button
                      onClick={() => handleEdit(member)}
                      className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-700 border"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(member.id)}
                      className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-700 border"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {showEditModal && selectedStaff && (
        <EditStaffModal staff={selectedStaff} onClose={() => setShowEditModal(false)} refreshList={fetchStaff} />
      )}
    </div>
  );
};

const EditStaffModal = ({ staff, onClose, refreshList }) => {
  const [formData, setFormData] = useState({
    firstname: staff.firstname || "",
    email: staff.email || "",
    mobileNumber: staff.mobileNumber || "",
    serviceId: staff.service?.serviceId || "", // Ensure serviceId is initialized
  });

  const [services, setServices] = useState([]);
  const adminToken = Cookies.get("jwtToken");

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get("http://localhost:8081/api/v1/admin/getAllService", {
        withCredentials: true,
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setServices(response.data);
    } catch (error) {
      alert("Failed to load services. Please try again.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleServiceChange = (e) => {
    const selectedService = services.find((s) => s.serviceId === parseInt(e.target.value));
    if (selectedService) {
      setFormData({
        ...formData,
        serviceId: selectedService.serviceId, // Ensure correct serviceId is set
      });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:8081/api/v1/admin/updateStaff/${staff.id}`,
        {
          firstname: formData.firstname,
          email: formData.email,
          mobileNumber: formData.mobileNumber,
          service_id: formData.serviceId, // Ensure service_id is sent correctly
        },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${adminToken}`, "Content-Type": "application/json" },
        }
      );
      alert("Staff updated successfully!");
      refreshList();
      onClose();
    } catch (error) {
      alert("Failed to update staff. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">Edit Staff</h2>
        <form onSubmit={handleUpdate}>
          <label className="block mb-2">Full Name</label>
          <input type="text" name="firstname" value={formData.firstname} onChange={handleChange} className="w-full p-2 border rounded mb-2" required />

          <label className="block mb-2">Service</label>
          <select name="serviceId" value={formData.serviceId} onChange={handleServiceChange} className="w-full p-2 border rounded mb-2" required>
            <option value="">Select Service</option>
            {services.map((service) => (
              <option key={service.serviceId} value={service.serviceId}>
                {service.serviceName}
              </option>
            ))}
          </select>

          <label className="block mb-2">Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded mb-2" required />

          <label className="block mb-2">Mobile Number</label>
          <input type="text" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} className="w-full p-2 border rounded mb-4" required />

          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded">
              Cancel
            </button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default StaffList;
