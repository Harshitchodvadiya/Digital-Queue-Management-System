
import React from "react";

const Filter = ({
  selectedDate,
  selectedStatus,
  selectedService,
  onDateChange,
  onStatusChange,
  onServiceChange,
  showServiceFilter = false, 
}) => {
  return (
    <div className="flex gap-4">
      <input
        type="date"
        className="border p-2 rounded-md"
        value={selectedDate}
        onChange={(e) => onDateChange(e.target.value)}
      />

      <select
        className="border p-2 rounded-md"
        value={selectedStatus}
        onChange={(e) => onStatusChange(e.target.value)}
      >
        <option value="">All Status</option>
        <option value="COMPLETED">Completed</option>
        <option value="SKIPPED">Skipped</option>
        <option value="CANCELLED">Cancelled</option>
      </select>


      {showServiceFilter && (
      <input
        type="text"
        className="border p-2 rounded-md"
        placeholder="Search by Service Name"
        value={selectedService}
        onChange={(e) => onServiceChange(e.target.value)}
      />)}


      
    </div>
  );
};

export default Filter;
