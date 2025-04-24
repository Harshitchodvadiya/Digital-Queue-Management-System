import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import Navbar from "../Navbar";
import { IoIosArrowBack } from "react-icons/io";

function AddServiceForm() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    serviceName: "",
    serviceDescription: "",
    estimatedTime: "", 
    isActive: true, 
  });

  const [loading, setLoading] = useState(false);
  const [adminToken, setAdminToken] = useState(null);

  /**
   * Fetches the admin token from cookies and retrieves the list of services.
   * Runs once when the component mounts.//component is first added to the DOM.
   */
  useEffect(() => {
    const token = Cookies.get("jwtToken");
    setAdminToken(token);
  }, []);

  /**
   * Handles input field changes and updates the form state.
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  /**
   * Handles form submission by sending a POST request to add a new service.
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
      const response = await axios.post(
        "http://localhost:8081/api/v1/admin/addStaffService",
        {
          ...formData,
          estimatedTime: parseInt(formData.estimatedTime, 10), // Ensure integer value
        },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            withCredentials: true,
          },
        }
      );

      alert("Service added successfully!");
      navigate("/admin");
    } catch (error) {
      console.error("Request Error:", error.response || error);
      alert(
        `Request failed: ${
          error.response?.data?.message || "Please try again."
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white overflow-hidden">
      <Navbar />

      <div className="flex flex-col  flex-grow p-4">
        <div className="p-2 ml-20">
          <button
            onClick={() => navigate("/admin")}
            className=" text-white px-4 py-2 rounded-lg shadow hover:bg-gray-700 transition duration-200"
          >
          <IoIosArrowBack  className="h-5 w-5"/>
          </button>
        </div>  
      
        <h3 className="text-3xl font-bold mb-4 text-center text-white">
          Add Service
        </h3>
        <div className="items-center justify-center flex">
        <form
          className="bg-white shadow-md rounded-xl p-6 w-full items-center justify-center max-w-md text-black border border-gray-300"
          onSubmit={handleSubmit}
        >
          <div className="mb-4">
            <label className="block items-center justify-center text-sm font-semibold text-gray-700 mb-1">
              Service Name
            </label>
            <input
              type="text"
              name="serviceName"
              value={formData.serviceName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 shadow-sm hover:shadow-md"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Service Description
            </label>
            <textarea
              name="serviceDescription"
              value={formData.serviceDescription}
              rows={3}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 shadow-sm hover:shadow-md"
            ></textarea>
          </div>

          {/* Estimated Time Input (Minutes) */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Estimated Time (Minutes)
            </label>
            <input
              type="number"
              name="estimatedTime"
              value={formData.estimatedTime}
              onChange={handleChange}
              required
              min="1"
              className="w-full px-3 py-2 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 shadow-sm hover:shadow-md"
            />
          </div>

          {/* Is Active Checkbox */}
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="mr-2 w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label className="text-sm font-semibold text-gray-700">
              Is Active
            </label>
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
    </div>
  );
}

export default AddServiceForm;
