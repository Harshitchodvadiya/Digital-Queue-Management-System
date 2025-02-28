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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staff.map((member, index) => (
            <div key={index} className="bg-white shadow-lg rounded-lg p-5 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-700">{member.firstname} {member.lastname}</h3>
              <p className="text-gray-600">Email: {member.email}</p>
              <p className="text-gray-600">Mobile: {member.mobileNumber}</p>
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => handleEdit(member)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(member.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {showEditModal && selectedStaff && (
        <EditStaffModal staff={selectedStaff} onClose={() => setShowEditModal(false)} refreshList={fetchStaff} />
      )}
    </div>
  );
};

const EditStaffModal = ({ staff, onClose, refreshList }) => {
  const [formData, setFormData] = useState({ ...staff });
  const adminToken = Cookies.get("jwtToken");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8081/api/v1/admin/updateStaff/${staff.id}`, formData, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${adminToken}`, "Content-Type": "application/json" },
      });
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
          <label className="block mb-2">First Name</label>
          <input
            type="text"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
            required
          />

          <label className="block mb-2">Last Name</label>
          <input
            type="text"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
            required
          />

          <label className="block mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
            required
          />

          <label className="block mb-2">Mobile Number</label>
          <input
            type="text"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-4"
            required
          />

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
