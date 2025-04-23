import React, { useEffect, useState } from "react";
import { updateStaff, fetchServices } from "../services/AdminService";

const EditStaffModal = ({ staff, onClose }) => {

  const [editStaff, setEditStaff] = useState({ ...staff });
  const [services, setServices] = useState([]);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const res = await fetchServices();
        setServices(res);
      } catch (err) {
        console.error("Failed to load services", err);
      }
    };
    loadServices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateStaff(editStaff);
      onClose(); // Close modal and refresh parent
    } catch (err) {
      console.error("Failed to update staff", err);
    }
  };


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-300 bg-opacity-75">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">Edit Staff</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">First Name</label>
            <input
              type="text"
              value={editStaff.firstname}
              onChange={(e) => setEditStaff({ ...editStaff, firstname: e.target.value })}
              className="w-full border p-2 rounded-md"
            />
          </div>
          <div>
            <label className="block font-medium">Email</label>
            <input
              type="email"
              value={editStaff.email}
              onChange={(e) => setEditStaff({ ...editStaff, email: e.target.value })}
              className="w-full border p-2 rounded-md"
            />
          </div>
          <div>
            <label className="block font-medium">Mobile Number</label>
            <input
              type="text"
              value={editStaff.mobileNumber}
              onChange={(e) => setEditStaff({ ...editStaff, mobileNumber: e.target.value })}
              className="w-full border p-2 rounded-md"
            />
          </div>
          <div>
            <label className="block font-medium">Service</label>
            <select
              value={editStaff.service_id}
              onChange={(e) => setEditStaff({ ...editStaff, service_id: e.target.value })}
              className="w-full border p-2 rounded-md"
            >
              <option value="">Select Service</option>
              {services.map((service) => (
                <option key={service.serviceId} value={service.serviceId}>
                  {service.serviceName}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={() => setEditStaff(null)}
              className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStaffModal;
