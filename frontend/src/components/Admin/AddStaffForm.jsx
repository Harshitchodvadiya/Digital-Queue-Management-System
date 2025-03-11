import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import Navbar from "../Navbar";

function AddStaffForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstname: "",
    service_id: "",
    email: "",
    password: "",
    mobileNumber: "",
  });

  const [loading, setLoading] = useState(false);
  const [adminToken, setAdminToken] = useState(null);
  const [services, setServices] = useState([]);

  /**
   * Fetches the admin token from cookies and retrieves the list of services.
   * Runs once when the component mounts.
   */
  useEffect(() => {
    const token = Cookies.get("jwtToken");
    setAdminToken(token || null);

    axios
      .get("http://localhost:8081/api/v1/admin/getAllService", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("API Response:", response.data); // Check the data format
        if (Array.isArray(response.data)) {
          setServices(response.data);
        } else {
          console.error("Unexpected response format:", response.data);
        }
      })
      .catch((error) => console.error("Error fetching services:", error));
  }, []);

  /**
   * Handles input field changes and updates the form state.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  /**
   * Handles form submission by sending a POST request to add a new staff member.
   * Prevents submission if adminToken is not available.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!adminToken) {
      alert("Unauthorized: Token not found. Please log in.");
      setLoading(false);
      return;
    }

    try {
      await axios.post(
        "http://localhost:8081/api/v1/admin/addStaff",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`,
          },
          withCredentials: true,
        }
      );

      alert("Staff added successfully!");
      navigate("/staff-list");
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      alert(
        `Signup failed: ${error.response?.data?.message || "Please try again."}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white overflow-hidden">
      <Navbar />

      <div className="flex flex-col items-center justify-center flex-grow p-4">
        <h3 className="text-3xl font-bold mb-4 text-center text-white shadow-md">
          Add New Staff
        </h3>

        <form
          className="bg-white shadow-md rounded-xl p-6 w-full max-w-md text-black border border-gray-300"
          onSubmit={handleSubmit}
        >
          {/* First Name */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 shadow-sm hover:shadow-md"
            />
          </div>

          {/* Service Selection */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Service
            </label>
            <select
              name="service_id"
              value={formData.service_id}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <option value="" disabled>
                Select a service
              </option>
              {services.length > 0 ? (
                services.map((service) => (
                  <option key={service.serviceId} value={service.serviceId}>
                    {service.serviceName}
                  </option>
                ))
              ) : (
                <option disabled>Loading services...</option>
              )}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white py-3 rounded-lg font-semibold text-md transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddStaffForm;
