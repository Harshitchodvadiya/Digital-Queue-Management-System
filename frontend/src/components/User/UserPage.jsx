import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Navbar from "../Navbar";

const UserHomePage = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = Cookies.get("jwtToken");

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8081/api/v1/user/userList", {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });
      const staffData = response.data.filter((user) => user.role === "STAFF");
      setStaffList(staffData);
    } catch (err) {
      setError("Failed to fetch staff members. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <div className="max-w-5xl mx-auto p-6 bg-gray-100 min-h-screen">
      {/* <Navbar/> */}
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Available Staff</h2>
      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : staffList.length === 0 ? (
        <p className="text-center text-gray-500">No staff members found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {staffList.map((staff) => (
            <div key={staff.id} className="border p-4 rounded-lg shadow-lg bg-white">
              <h2 className="text-xl font-bold">{staff.firstname}</h2>
              <p className="text-gray-600">
                <strong>Service:</strong> {staff.service?.serviceName || "N/A"}
              </p>
              <p className="text-gray-500">{staff.service?.serviceDescription || "No description available"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserHomePage;
