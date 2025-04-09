
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import Cookies from "js-cookie";
// import Navbar from "../Navbar";

// function AddServiceForm() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
    
//     serviceName: "",
//     serviceDescription: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [adminToken, setAdminToken] = useState(null);

//   useEffect(() => {
//     const token = Cookies.get("jwtToken");
//     setAdminToken(token || null);

//     axios
//       .get("http://localhost:8081/api/v1/admin/getAllService", {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((response) => {
//         console.log("API Response:", response.data); // Check the data format
//         if (Array.isArray(response.data)) {
//           setServices(response.data);
//         } else {
//           console.error("Unexpected response format:", response.data);
//         }
//       })
//       .catch((error) => console.error("Error fetching services:", error));
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
  
//     if (!adminToken) {
//       alert("Unauthorized: Token not found. Please log in.");
//       setLoading(false);
//       return;
//     }
  
//     try {
//       console.log("Sending request to backend...");
//       console.log("Request Data:", formData);
  
//       const response = await axios.post(
//         "http://localhost:8081/api/v1/admin/addStaffService",
//         formData,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${adminToken}`,
//           },
//           withCredentials: true,
//         }
//       );
  
//       console.log("Response:", response.data);
//       alert("Service added successfully!");
//       navigate("/service-list");
//     } catch (error) {
//       console.error("Request Error:", error.response || error);
//       alert(
//         `Request failed: ${
//           error.response?.data?.message || "Please try again."
//         }`
//       );
//     } finally {
//       setLoading(false);
//     }
//   };
  

//   return (
//     <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white overflow-hidden">
//       <Navbar />

//       <div className="flex flex-col items-center justify-center flex-grow p-4">
      
//         <h3 className="text-3xl font-bold mb-4 text-center text-white shadow-md">
//           Add Service
//         </h3>

//         <form
//           className="bg-white shadow-md rounded-xl p-6 w-full max-w-md text-black border border-gray-300"
//           onSubmit={handleSubmit}
//         > 

//           <div className="mb-4">
//             <label className="block text-sm font-semibold text-gray-700 mb-1">
//               Service Name
//             </label>
//             <input
//               type="text"
//               name="serviceName"
//               value={formData.serviceName}
//               onChange={handleChange}
//               required
//               className="w-full px-3 py-2 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 shadow-sm hover:shadow-md"
//             />
//           </div>

//           <div className="mb-4">
//             <label className="block text-sm font-semibold text-gray-700 mb-1">
//               Service Description
//             </label>
//             <input
//               type="text"
//               name="serviceDescription"
//               value={formData.serviceDescription}
//               onChange={handleChange}
//               required
//               className="w-full px-3 py-2 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 shadow-sm hover:shadow-md"
//             />
//           </div>

        
//           {/* Submit Button */}
//           <button
//             type="submit"
//             className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white py-3 rounded-lg font-semibold text-md transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
//           >
//             {loading ? "Submitting..." : "Submit"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default AddServiceForm;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import Navbar from "../Navbar";

function AddServiceForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    serviceName: "",
    serviceDescription: "",
    estimatedTime: "", // Added estimated time field
    isActive: true, // Default to active
  });

  const [loading, setLoading] = useState(false);
  const [adminToken, setAdminToken] = useState(null);

  /**
   * Fetches the admin token from cookies and retrieves the list of services.
   * Runs once when the component mounts.//component is first added to the DOM.
   */
  useEffect(() => {
    const token = Cookies.get("jwtToken");
    setAdminToken(token || null);
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
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`,
          },
          withCredentials: true,
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
      <div className="flex flex-col items-center justify-center flex-grow p-4">
        <h3 className="text-3xl font-bold mb-4 text-center text-white shadow-md">
          Add Service
        </h3>
        <form
          className="bg-white shadow-md rounded-xl p-6 w-full max-w-md text-black border border-gray-300"
          onSubmit={handleSubmit}
        >
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
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
  );
}

export default AddServiceForm;
