import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editService, setEditService] = useState(null);
  const [formData, setFormData] = useState({
    serviceName: "",
    serviceDescription: "",
    estimatedTime: "",
    active: false,
  });

  const adminToken = Cookies.get("jwtToken");
  const navigate = useNavigate();

  const fetchService = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get("http://localhost:8081/api/v1/admin/getAllService", {
        withCredentials: true,
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      setServices(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch services.");
    } finally {
      setLoading(false);
    }
  }, [adminToken]);

  useEffect(() => {
    fetchService();
  }, [fetchService]);

  // Handle Edit Click
  const handleEditClick = (service) => {
    setEditService(service);
    setFormData({
      serviceName: service.serviceName,
      serviceDescription: service.serviceDescription,
      estimatedTime: service.estimatedTime || "",
      active: service.active,
    });
  };

  // Handle Form Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Toggle Active Status
  const handleToggleActive = () => {
    setFormData({ ...formData, active: !formData.active });
  };

  // Handle Update Service
  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:8081/api/v1/admin/updateService/${editService.serviceId}`,
        formData,
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        }
      );

      setEditService(null); // Close the form
      fetchService(); // Refresh the list
    } catch (error) {
      console.error("Update failed", error);
      alert("Failed to update service.");
    }
  };

  return (
    <div className="h-full w-full flex">
      <div className="flex-1 flex flex-col">
        <Navbar title="Service List" />
        <div className="p-6">
          <button
            className="bg-gradient-to-br from-[#16213e] to-[#0f3460] text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-500 transition duration-300 mb-4"
            onClick={() => navigate("/add-service")}
          >
            + Add Service
          </button>

          {loading ? (
            <p className="text-center text-gray-600">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : services.length === 0 ? (
            <p className="text-center text-gray-500">No services found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
                <thead>
                  <tr className="bg-gray-200 text-gray-700 border">
                    <th className="py-2 px-4 border">Service ID</th>
                    <th className="py-2 px-4 border">Service Name</th>
                    <th className="py-2 px-4 border">Service Description</th>
                    <th className="py-2 px-4 border">Estimated Time (min)</th>
                    <th className="py-2 px-4 border">Active</th>
                    <th className="py-2 px-4 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service) => (
                    <tr key={service.serviceId} className="text-center border">
                      <td className="py-2 px-4 border">{service.serviceId || "N/A"}</td>
                      <td className="py-2 px-4 border">{service.serviceName || "N/A"}</td>
                      <td className="py-2 px-4 border">{service.serviceDescription || "N/A"}</td>
                      <td className="py-2 px-4 border">{service.estimatedTime || "N/A"}</td>
                      <td className="py-2 px-4 border">
                        {service.active ? "Yes" : "No"}
                      </td>
                      <td className="py-2 px-4 border">
                        <div className="flex justify-center space-x-2">
                          <button
                            className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-700"
                            onClick={() => handleEditClick(service)}
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Edit Service Form */}
          {editService && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] text-black">
                <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">Edit Service</h2>

                <label className="block mb-2 text-md text-gray-800 font-medium">Service Name:</label>
                <input
                  type="text"
                  name="serviceName"
                  value={formData.serviceName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded mt-1"
                />

                <label className="block mb-2 mt-4 font-medium text-md text-gray-800">Service Description:</label>
                <textarea
                  name="serviceDescription"
                  value={formData.serviceDescription}
                  onChange={handleChange}
                  className="w-full p-2 border rounded mt-1"
                  rows={5}
                ></textarea>

                <label className="block mb-2 mt-4 font-medium text-md text-gray-800">Estimated Time (min):</label>
                <input
                  type="number"
                  name="estimatedTime"
                  value={formData.estimatedTime}
                  onChange={handleChange}
                  className="w-full p-2 border rounded mt-1"
                />

                <div className="flex items-center mt-4">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={handleToggleActive}
                    className="mr-2"
                  />
                  <span className="text-gray-800">Active</span>
                </div>

                <div className="flex justify-center space-x-2 mt-6">
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
                    onClick={() => setEditService(null)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={handleUpdate}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ServiceList;
