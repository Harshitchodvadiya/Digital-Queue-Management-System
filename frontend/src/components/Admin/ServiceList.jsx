
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { SlSettings } from "react-icons/sl";

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

  /**
   * Fetches all services from the backend when the component mounts.
   * Uses useCallback to prevent unnecessary re-renders.
   */
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

  /**
   * Calls fetchService when the component mounts.
   */
  useEffect(() => {
    fetchService();
  }, [fetchService]);

  /**
   * Handles clicking the edit button by setting the selected service's data.
   */
  const handleEditClick = (service) => {
    setEditService(service);
    setFormData({
      serviceName: service.serviceName,
      serviceDescription: service.serviceDescription,
      estimatedTime: service.estimatedTime || "",
      active: service.active,
    });
  };

  /**
   * Handles form input changes and updates the state accordingly.
   */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Toggle Active Status
  const handleToggleActive = () => {
    setFormData({ ...formData, active: !formData.active });
  };

  /**
   * Handles updating the service details by sending a PUT request to the backend.
   */
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
      <div className="flex-1 flex flex-col p-6">
       
          {loading ? (
            <p className="text-center text-gray-600">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : services.length === 0 ? (
            <p className="text-center text-gray-500">No services found.</p>
          ) : (

            <div className="bg-white rounded-xl p-4">
              <div className="flex justify-between items-center px-4 pb-2">
                <h2 className="text-lg font-semibold text-gray-700">Total Services</h2>
                
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg shadow flex items-center gap-2"
                  onClick={() => navigate("/add-service")}
                >
                  <SlSettings className="h-4 w-4" /> Add Service
                </button>
                
              </div>
            <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-700 border-separate border-spacing-y-2">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                
                  <tr>
                    <th className="px-6 py-4 text-center ">Service ID</th>
                    <th className="px-6 py-4 text-center ">Service Name</th>
                    <th className="px-6 py-4 text-center">Service Description</th>
                    <th className="px-6 py-4 text-center ">Estimated Time (min)</th>
                    <th className="px-6 py-4 text-center ">Active</th>
                    <th className="px-6 py-4 text-center ">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {services.map((service) => (
                    <tr key={service.serviceId} className="bg-white shadow-sm rounded-lg">
                      <td className="px-6 py-4 font-medium ">{service.serviceId || "N/A"}</td>
                      <td className="px-6 py-4 font-medium">{service.serviceName || "N/A"}</td>
                      <td className="px-6 py-4 font-medium ">{service.serviceDescription || "N/A"}</td>
                      <td className="px-6 py-4 font-medium ">{service.estimatedTime || "N/A"}</td>
                      <td className="px-6 py-4 font-medium ">
                        {service.active ? "Yes" : "No"}
                      </td>
                      <td className="py-2 px-4 ">
                        <div className="flex  space-x-2">
                          <button
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow flex items-center gap-2"
                            onClick={() => handleEditClick(service)}
                          >
                          <SlSettings />  Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          )}

          {/* Edit Service Form */}
          {editService && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-300 opacity-90">
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
  );
};

export default ServiceList;
  