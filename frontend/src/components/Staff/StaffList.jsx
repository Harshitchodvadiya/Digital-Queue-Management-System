//   import React, { useEffect, useState, useCallback } from "react";
// import axios from "axios";
// import Cookies from "js-cookie";
// import { useNavigate } from "react-router-dom";
// import Navbar from "../Navbar";

// const StaffList = () => {
//   const [staff, setStaff] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [editStaff, setEditStaff] = useState(null);
//   const [services, setServices] = useState([]);
//   const adminToken = Cookies.get("jwtToken");
//   const navigate = useNavigate();

//   // Fetch staff list
//   const fetchStaff = useCallback(async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const response = await axios.get("http://localhost:8081/api/v1/admin/userList", {
//         withCredentials: true,
//         headers: { Authorization: `Bearer ${adminToken}` },
//       });

//       setStaff(response.data.filter((member) => member.role === "STAFF"));
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to fetch staff members.");
//     } finally {
//       setLoading(false);
//     }
//   }, [adminToken]);

//   useEffect(() => {
//     fetchStaff();
//   }, [fetchStaff]);

//   //acc: Stores the result as an object {} that keeps track of the staff count per service.
//   const staffByService = staff.reduce((acc, member) => {
//         const serviceName = member.service?.serviceName || "N/A";
//         acc[serviceName] = (acc[serviceName] || 0) + 1;
//         return acc;
//       }, {});

//   // Fetch available services
//   const fetchServices = useCallback(async () => {
//     try {
//       const response = await axios.get("http://localhost:8081/api/v1/admin/getAllService", {
//         headers: { Authorization: `Bearer ${adminToken}` },
//       });
//       setServices(response.data);
//     } catch (err) {
//       console.error("Failed to fetch services");
//     }
//   }, [adminToken]);

//   useEffect(() => {
//     fetchServices();
//   }, [fetchServices]);

//   //Stores selected staff member's details in editStaff state.
//   // Ensures service_id is set for dropdown selection.

//   // Open edit modal with staff data
//   const handleEditClick = (staffMember) => {
//     setEditStaff({
//       ...staffMember,
//       service_id: staffMember.service?.serviceId || "", // Ensure service ID is set
//     });
//   };

//   // Handle staff update
//   const handleUpdateStaff = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.put(
//         `http://localhost:8081/api/v1/admin/updateStaff/${editStaff.id}`,
//         {
//           firstname: editStaff.firstname,
//           email: editStaff.email,
//           mobileNumber: editStaff.mobileNumber,
//           password: editStaff.password || "", // Send password only if changed
//           service_id: editStaff.service_id, // Ensure service is updated
//         },
//         { headers: { Authorization: `Bearer ${adminToken}` } }
//       );

//       setEditStaff(null);//Prevents accidental reuse of old staff data if another update is attempted.
//       fetchStaff(); // Refresh the staff list after update
//     } catch (err) {
//       console.error("Update failed", err);
//     }
//   };

//   // Delete staff member
//   const handleDeleteStaff = async (id) => {
//     try {
//       await axios.delete(`http://localhost:8081/api/v1/admin/deleteStaff/${id}`, {
//         headers: { Authorization: `Bearer ${adminToken}` },
//       });
//       fetchStaff(); // Refresh list after deletion
//     } catch (err) {
//       console.error("Failed to delete staff member", err);
//     }
//   };

//   return (
//     <div className="h-full w-full flex">
      
//       <div className="flex-1 flex flex-col">
      
//         <div className="p-6">
//           <button
//             className="bg-gradient-to-br from-[#16213e] to-[#0f3460] text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-500 transition duration-300 mb-4 ml-300"
//             onClick={() => navigate("/add-staff")}
//           >
//             + Add Staff
//           </button>

//           {/* Staff Count Table */}
//           <div className="mb-6 overflow-x-auto">
//             <h3 className="text-lg font-semibold mb-2">Staff Count by Service</h3>
//             <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
//               <thead className="bg-gray-800 text-white">
//                 <tr >
//                   <th className="py-2 px-4 ">Service Name</th>
//                   <th className="py-2 px-4 ">Total Staff</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {Object.entries(staffByService).map(([service, count]) => (
//                   <tr key={service} className="border-b hover:bg-gray-100 text-gray-700 text-center">
//                     <td className="py-2 px-4">{service}</td>
//                     <td className="py-2 px-4">{count}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {loading ? (
//             <p className="text-center text-gray-600">Loading...</p>
//           ) : error ? (
//             <p className="text-center text-red-500">{error}</p>
//           ) : staff.length === 0 ? (
//             <p className="text-center text-gray-500">No staff members found.</p>
//           ) : (

//             <div className="overflow-x-auto">
//               {/* <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg"> */}
//               <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
//               <thead className="bg-gray-800 text-white">
//                   <tr>
//                     <th className="py-2 px-4">Full Name</th>
//                     <th className="py-2 px-4 ">Service Name</th>
//                     <th className="py-2 px-4 ">Email</th>
//                     <th className="py-2 px-4 ">Mobile</th>
//                     <th className="py-2 px-4 ">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {staff.map((member) => (
//                     <tr key={member.id} className="border-b hover:bg-gray-100 text-gray-700 text-center">
//                       <td className="py-2 px-4 ">{member.firstname}</td>
//                       <td className="py-2 px-4 ">{member.service?.serviceName || "N/A"}</td>
//                       <td className="py-2 px-4 ">{member.email}</td>
//                       <td className="py-2 px-4 ">{member.mobileNumber}</td>
//                       <td className="py-2 px-4 ">
//                         <div className="flex justify-center space-x-2">
//                           <button
//                             className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-700"
//                             onClick={() => handleEditClick(member)}
//                           >
//                             Edit
//                           </button>
//                           <button
//                             className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-700"
//                             onClick={() => handleDeleteStaff(member.id)}
//                           >
//                             Delete
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Edit Staff Modal */}

// {editStaff && (
//   //<div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] bg-opacity-50">
//   <div className="fixed inset-0 flex items-center justify-center bg-gray-300 opacity-90">
//     <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//       <h2 className="text-2xl font-semibold text-center mb-4">Edit Staff</h2>
//       <form onSubmit={handleUpdateStaff} className="space-y-4">
        
//         {/* First Name */}
//         <div>
//           <label className="block text-gray-700 font-medium mb-1">First Name:</label>
//           <input
//             type="text"
//             value={editStaff.firstname}
//             onChange={(e) => setEditStaff({ ...editStaff, firstname: e.target.value })}
//             className="w-full border border-gray-600 p-2 rounded-md focus:ring focus:ring-blue-200"
//           />
//         </div>

//         {/* Email */}
//         <div>
//           <label className="block text-gray-700 font-medium mb-1">Email:</label>
//           <input
//             type="email"
//             value={editStaff.email}
//             onChange={(e) => setEditStaff({ ...editStaff, email: e.target.value })}
//             className="w-full border border-gray-600 p-2 rounded-md focus:ring focus:ring-blue-200"
//           />
//         </div>

//         {/* Service Dropdown */}
//         <div>
//           <label className="block text-gray-700 font-medium mb-1">Service:</label>
//           <select
//             value={editStaff.service_id}
//             onChange={(e) => setEditStaff({ ...editStaff, service_id: e.target.value })}
//             className="w-full border border-gray-600 p-2 rounded-md focus:ring focus:ring-blue-200"
//           >
//             <option value="">Select Service</option>
//             {services.map((service) => (
//               <option key={service.serviceId} value={service.serviceId}>
//                 {service.serviceName}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Mobile Number */}
//         <div>
//           <label className="block text-gray-700 font-medium mb-1">Mobile No:</label>
//           <input
//             type="text"
//             value={editStaff.mobileNumber}
//             onChange={(e) => setEditStaff({ ...editStaff, mobileNumber: e.target.value })}
//             className="w-full border border-gray-600 p-2 rounded-md focus:ring focus:ring-blue-200"
//           />
//         </div>

//         {/* Buttons */}
//         <div className="flex justify-end space-x-2">
//           <button
//             type="button"
//             className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
//             onClick={() => setEditStaff(null)}
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
//           >
//             Save
//           </button>
//         </div>
//       </form>
//     </div>
//   </div>
// )}
//     </div>
//   );
// };

// export default StaffList;

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import { Users} from "lucide-react";
import { GoTrash } from "react-icons/go";

const StaffList = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editStaff, setEditStaff] = useState(null);
  const [services, setServices] = useState([]);
  const adminToken = Cookies.get("jwtToken");
  const navigate = useNavigate();

  // Fetch staff list
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

  //acc: Stores the result as an object {} that keeps track of the staff count per service.
  const staffByService = staff.reduce((acc, member) => {
        const serviceName = member.service?.serviceName || "N/A";
        acc[serviceName] = (acc[serviceName] || 0) + 1;
        return acc;
      }, {});

  // Fetch available services
  const fetchServices = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:8081/api/v1/admin/getAllService", {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setServices(response.data);
    } catch (err) {
      console.error("Failed to fetch services");
    }
  }, [adminToken]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  //Stores selected staff member's details in editStaff state.
  // Ensures service_id is set for dropdown selection.

  // Open edit modal with staff data
  const handleEditClick = (staffMember) => {
    setEditStaff({
      ...staffMember,
      service_id: staffMember.service?.serviceId || "", // Ensure service ID is set
    });
  };

  // Handle staff update
  const handleUpdateStaff = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:8081/api/v1/admin/updateStaff/${editStaff.id}`,
        {
          firstname: editStaff.firstname,
          email: editStaff.email,
          mobileNumber: editStaff.mobileNumber,
          password: editStaff.password || "", // Send password only if changed
          service_id: editStaff.service_id, // Ensure service is updated
        },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );

      setEditStaff(null);//Prevents accidental reuse of old staff data if another update is attempted.
      fetchStaff(); // Refresh the staff list after update
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  // Delete staff member
  const handleDeleteStaff = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/api/v1/admin/deleteStaff/${id}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      fetchStaff(); // Refresh list after deletion
    } catch (err) {
      console.error("Failed to delete staff member", err);
    }
  };

  return (
    <div className="h-full w-full flex">
      
      <div className="flex-1 flex flex-col p-6">
      
         {/* Staff Management Header & Add Button */}
         <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-700">Staff Management</h3>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg shadow flex items-center gap-2 "
            onClick={() => navigate("/add-staff")}
          >
            <Users className="h-5 w-5 gap-2"/>  Add Staff Members
          </button>
        </div>

        {/* Staff Table */}
        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : staff.length === 0 ? (
          <p className="text-center text-gray-500">No staff members found.</p>
        ) : (
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full text-sm text-gray-700 border-separate border-spacing-y-2">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="text-left px-6 py-3">Full Name</th>
                  <th className="py-2 px-4 text-left">Service Name</th>
                  <th className="py-2 px-4 text-left">Email</th>
                  <th className="py-2 px-4 text-left">Mobile</th>
                  <th className="py-2 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {staff.map((member) => (
                  <tr key={member.id} className="bg-white shadow-sm rounded-lg">
                    <td className="px-6 py-4 font-medium text-gray-800">{member.firstname}</td>
                    <td className="px-6 py-4 font-medium">{member.service?.serviceName || "N/A"}</td>
                    <td className="px-6 py-4 font-medium">{member.email}</td>
                    <td className="px-6 py-4 font-medium">{member.mobileNumber}</td>
                    <td className="py-2 px-4">
                      <div className="flex  space-x-2">
                        <button
                          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow flex items-center gap-2"
                          onClick={() => handleEditClick(member)}
                        >
                        <Users className="h-5 w-5 gap-2"/>  Edit
                        </button>
                        <button
                          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg shadow flex items-center gap-2"
                          onClick={() => handleDeleteStaff(member.id)}
                        >
                        <GoTrash className="h-5 w-5 gap-2"/>  Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Staff Count by Service */}
        <div className="overflow-x-auto">
          <h3 className="text-lg font-semibold mb-2">Staff Count by Service</h3>
          <table className="min-w-full text-sm text-gray-700 border-separate border-spacing-y-2">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="text-left px-6 py-3">Service Name</th>
                <th className="text-left px-6 py-3">Total Staff</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {Object.entries(staffByService).map(([service, count]) => (
                <tr key={service} className="bg-white shadow-sm rounded-lg">
                  <td className="px-6 py-4 font-medium text-gray-800">{service}</td>
                  <td className="px-6 py-4 font-medium">{count}</td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>



      {/* Edit Staff Modal */}
      {editStaff && (
   
    <div className="fixed inset-0 flex items-center justify-center bg-gray-300 opacity-90">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 className="text-2xl font-semibold text-center mb-4">Edit Staff</h2>
      <form onSubmit={handleUpdateStaff} className="space-y-4">
        
        {/* First Name */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">First Name:</label>
          <input
            type="text"
            value={editStaff.firstname}
            onChange={(e) => setEditStaff({ ...editStaff, firstname: e.target.value })}
            className="w-full border border-gray-600 p-2 rounded-md focus:ring focus:ring-blue-200"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Email:</label>
          <input
            type="email"
            value={editStaff.email}
            onChange={(e) => setEditStaff({ ...editStaff, email: e.target.value })}
            className="w-full border border-gray-600 p-2 rounded-md focus:ring focus:ring-blue-200"
          />
        </div>

        {/* Service Dropdown */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Service:</label>
          <select
            value={editStaff.service_id}
            onChange={(e) => setEditStaff({ ...editStaff, service_id: e.target.value })}
            className="w-full border border-gray-600 p-2 rounded-md focus:ring focus:ring-blue-200"
          >
            <option value="">Select Service</option>
            {services.map((service) => (
              <option key={service.serviceId} value={service.serviceId}>
                {service.serviceName}
              </option>
            ))}
          </select>
        </div>

        {/* Mobile Number */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Mobile No:</label>
          <input
            type="text"
            value={editStaff.mobileNumber}
            onChange={(e) => setEditStaff({ ...editStaff, mobileNumber: e.target.value })}
            className="w-full border border-gray-600 p-2 rounded-md focus:ring focus:ring-blue-200"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
            onClick={() => setEditStaff(null)}
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
        )}
    </div>
    </div>
  );
};

export default StaffList;
