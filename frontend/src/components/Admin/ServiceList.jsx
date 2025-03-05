import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";

const ServiceList = () => {
  const [services, setServices] = useState([]); // Changed from 'staff' to 'services'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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

      setServices(response.data); // Directly set the service list
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch services.");
    } finally {
      setLoading(false);
    }
  }, [adminToken]);

  useEffect(() => {
    fetchService();
  }, [fetchService]);

  return (
    <div className="h-full w-full flex">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar title="Service List" />

        {/* Main Content */}
        <div className="p-6">
          <button
          className="bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-500 transition duration-300 mb-4 ml-290 w-[150px]"

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
                    <th className="py-2 px-4 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service) => (
                    <tr key={service.serviceId} className="text-center border">
                      <td className="py-2 px-4 border">{service.serviceId || "N/A"}</td>
                      <td className="py-2 px-4 border">{service.serviceName || "N/A"}</td>
                      <td className="py-2 px-4 border">{service.serviceDescription || "N/A"}</td>
                      <td className="py-2 px-4 border">
                        <div className="flex justify-center space-x-2">
                          <button className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-700">
                            Edit
                          </button>
                          <button className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-700">
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
    </div>
  );
};

export default ServiceList;
