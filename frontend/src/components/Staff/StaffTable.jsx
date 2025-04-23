import React, { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { GoTrash } from "react-icons/go";
import { fetchStaff,deleteStaff } from "../services/AdminService";
import EditStaffModal from "./EditStaffModal";

const StaffTable = () => {
  const [staffData,setStaffData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [editStaff, setEditStaff] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const loadStaff = async () => {
    try {
      const staffData = await fetchStaff();
      console.log("Fetched staff:", staffData);
      setStaffData(staffData);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch staffs. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
    useEffect(() => {
      loadStaff();
    }, []);
    
  const handleDelete = async (id) => {
      await deleteStaff(id);
      loadStaff(); // Refresh
  };

  const handleEditClick = (staffMember) => {
    setEditStaff({
      ...staffMember,
      service_id: staffMember.service?.serviceId || "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditStaff(null);
    loadStaff(); // Refresh after update
  };

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (staffData.length === 0) return <p className="text-center text-gray-500">No staff members found.</p>;

  return (
    <div className="overflow-x-auto mb-6">
      <table className="min-w-full text-sm text-gray-700 border-separate border-spacing-y-2">
        <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
          <tr>
            <th className="text-left px-6 py-3">Full Name</th>
            <th className="text-left px-6 py-3">Service</th>
            <th className="text-left px-6 py-3">Email</th>
            <th className="text-left px-6 py-3">Mobile</th>
            <th className="text-left px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {staffData.map((member) => (
            <tr key={member.id} className="bg-white shadow-sm rounded-lg">
              <td className="px-6 py-4 font-medium">{member.firstname}</td>
              <td className="px-6 py-4 font-medium">{member.service?.serviceName || "N/A"}</td>
              <td className="px-6 py-4 font-medium">{member.email}</td>
              <td className="px-6 py-4 font-medium">{member.mobileNumber}</td>
              <td className="px-6 py-4">
                <div className="flex space-x-2">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow flex items-center gap-2"
                    onClick={() => handleEditClick(member)}
                  >
                    <Users className="h-5 w-5" /> Edit
                  </button>
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg shadow flex items-center gap-2"
                    onClick={() => handleDelete(member.id)}
                  >
                    <GoTrash className="h-5 w-5" /> Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showModal && editStaff && (

        <EditStaffModal
          staff={editStaff}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default StaffTable;
