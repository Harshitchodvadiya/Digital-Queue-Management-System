  import React, { useEffect, useState, useCallback } from "react";
  import axios from "axios";
  import Cookies from "js-cookie";
  import { useNavigate } from "react-router-dom";
  import Navbar from "../Navbar";


  const StaffList = () => {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); //  Sidebar state
    const adminToken = Cookies.get("jwtToken");
    const navigate = useNavigate();

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

    return (
      <div className=" h-full w-full flex ">
      
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Navbar */}
          <Navbar title="Staff Members" />

        

          {/* Main Content */}
          <div className="p-6">
            {/* <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Staff Members</h2> */}
            <button
              className="bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-500 transition duration-300 mb-4 ml-300"
              onClick={() => navigate("/add-staff")}
            >
              + Add Staff
            </button>

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
                        <td className="py-2 px-4 border">{member.service?.serviceId || "N/A"}</td>
                        <td className="py-2 px-4 border">{member.service?.serviceName || "N/A"}</td>
                        <td className="py-2 px-4 border">{member.email}</td>
                        <td className="py-2 px-4 border">{member.mobileNumber}</td>
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

  export default StaffList;
