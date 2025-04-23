import React, { useEffect, useState } from "react";
import { fetchStaff } from "../services/AdminService";
import Table from "../reusableComponents/Table";

const StaffByServiceTable = () => {
  const [staffByService, setStaffByService] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStaffData = async () => {
      try {
        const staffList = await fetchStaff();

        const countMap = staffList.reduce((acc, member) => {
          const serviceName = member.service?.serviceName || "Unassigned";
          acc[serviceName] = (acc[serviceName] || 0) + 1;
          return acc;
        }, {});

        // Convert countMap to array of objects for your reusable table
        const formattedData = Object.entries(countMap).map(([service, count]) => ({
          serviceName: service,
          totalStaff: count,
        }));

        setStaffByService(formattedData);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch staff data.");
      } finally {
        setLoading(false);
      }
    };

    loadStaffData();
  }, []);

  const columns = [
    { title: "Service Name", field: "serviceName" },
    { title: "Total Staff", field: "totalStaff" },
  ];

  return (
    <div className="mt-6 overflow-x-auto">
      <h3 className="text-lg font-semibold mb-2">Staff Count by Service</h3>
      {loading && <p className="text-center text-gray-600">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!loading && !error && <Table columns={columns} data={staffByService} />}
    </div>
  );
};

export default StaffByServiceTable;
