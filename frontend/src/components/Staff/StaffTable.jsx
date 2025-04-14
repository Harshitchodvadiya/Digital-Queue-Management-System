import React from "react";
import { Users } from "lucide-react";
import { GoTrash } from "react-icons/go";

const StaffTable = ({ staff, loading, error, onEdit, onDelete }) => {
  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (staff.length === 0) return <p className="text-center text-gray-500">No staff members found.</p>;

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
          {staff.map((member) => (
            <tr key={member.id} className="bg-white shadow-sm rounded-lg">
              <td className="px-6 py-4 font-medium">{member.firstname}</td>
              <td className="px-6 py-4 font-medium">{member.service?.serviceName || "N/A"}</td>
              <td className="px-6 py-4 font-medium">{member.email}</td>
              <td className="px-6 py-4 font-medium">{member.mobileNumber}</td>
              <td className="px-6 py-4">
                <div className="flex space-x-2">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow flex items-center gap-2"
                    onClick={() => onEdit(member)}
                  >
                    <Users className="h-5 w-5" /> Edit
                  </button>
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg shadow flex items-center gap-2"
                    onClick={() => onDelete(member.id)}
                  >
                    <GoTrash className="h-5 w-5" /> Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StaffTable;
