import React from "react";

function SummaryCard({ title, value, icon: Icon }) {
  return (
    <div className="bg-white text-gray-900 p-6 rounded-2xl shadow-2xl w-full max-w-xs">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        <Icon className="w-6 h-6 text-gray-500" />
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

export default SummaryCard;