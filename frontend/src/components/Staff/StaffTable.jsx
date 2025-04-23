import React, { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { GoTrash } from "react-icons/go";
import { fetchStaff, deleteStaff } from "../services/AdminService";
import EditStaffModal from "./EditStaffModal";
import Table from "../reusableComponents/Table"; 

const StaffTable = () => {
  const [staffData, setStaffData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [editStaff, setEditStaff] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const loadStaff = async () => {
    try {
      const fetchedStaff = await fetchStaff();
      const transformedData = fetchedStaff.map((member) => ({
        fullName: member.firstname,
        service: member.service?.serviceName || "N/A",
        email: member.email,
        mobile: member.mobileNumber,
        actions: (
          
          <div className="flex space-x-2 justify-center">
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
        ),
      }));
      setStaffData(transformedData);
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
    loadStaff();
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
    loadStaff(); // Refresh after edit
  };

  const columns = [
    { title: "Full Name", field: "fullName" },
    { title: "Service", field: "service" },
    { title: "Email", field: "email" },
    { title: "Mobile", field: "mobile" },
    { title: "Actions", field: "actions" },
  ];

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div>
      <Table columns={columns} data={staffData} />
      {showModal && editStaff && (
        <EditStaffModal staff={editStaff} onClose={closeModal} />
      )}
    </div>
  );
};

export default StaffTable;
