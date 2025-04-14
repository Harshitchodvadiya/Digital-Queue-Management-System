import React from "react";

const StaffByServiceTable = ({ staffByService }) => {
  return (
    <div className="mt-6 overflow-x-auto">
      <h3 className="text-lg font-semibold mb-2">Staff Count by Service</h3>
      <table className="min-w-full text-sm text-gray-700 border-separate border-spacing-y-2">
        <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
          <tr>
            <th className="text-left px-6 py-3">Service Name</th>
            <th className="text-left px-6 py-3">Total Staff</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {staffByService &&
            Object.entries(staffByService).map(([service, count]) => (
              <tr key={service} className="bg-white shadow-sm rounded-lg">
                <td className="px-6 py-4 font-medium text-gray-800">{service}</td>
                <td className="px-6 py-4 font-medium">{count}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default StaffByServiceTable;
