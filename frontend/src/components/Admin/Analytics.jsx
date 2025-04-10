import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import axios from "axios";
import Cookies from "js-cookie";

// You can define this at the top or outside the component
const COLORS = ["#0284c7", "#0d9488", "#8b5cf6", "#22c55e", "#f97316"];

const TokenBarChart = () => {
  const [barData, setBarData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const token = Cookies.get("jwtToken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch bar chart data
        const barRes = await axios.get("http://localhost:8081/api/v1/token/token-stats", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const rawBarData = barRes.data;
        setBarData(rawBarData);

        // Fetch pie chart data
        const pieRes = await axios.get("http://localhost:8081/api/v1/token/getAllRequestedToken", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const tokens = pieRes.data;
        console.log("All Requested Tokens:", tokens);

        // Aggregate service_name counts for pie chart
        const serviceCounts = {};
        tokens.forEach((token) => {
          const serviceName = token.staffId?.service?.serviceName;
          if (serviceName) {
            serviceCounts[serviceName] = (serviceCounts[serviceName] || 0) + 1;
          }
        });

        const pieFormatted = Object.entries(serviceCounts).map(([name, value]) => ({
          name,
          value,
        }));

        setPieData(pieFormatted);
      } catch (err) {
        console.error("Error fetching chart data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
      {/* Pie Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-md w-150 h-96">
        <h2 className="text-lg font-bold text-gray-700 mb-2">Service Distribution</h2>
        <p className="text-sm text-gray-500 mb-4">Breakdown by service type</p>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={85}
              label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
            >
              {pieData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend layout="vertical" verticalAlign="middle" align="right" />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-md w-150 h-96 md:col-span-2 ml-50">
        <h2 className="text-lg font-bold text-gray-700 mb-2">Token Statistics</h2>
        <p className="text-sm text-gray-500 mb-4">Total completed, skipped, and cancelled tokens per day</p>
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(dateStr) => {
                const [year, month, day] = dateStr.split("-");
                return `${day}-${month}-${year}`;
              }}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="completed" stackId="a" fill="#4ade80" />
            <Bar dataKey="skipped" stackId="a" fill="#facc15" />
            <Bar dataKey="cancelled" stackId="a" fill="#f87171" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TokenBarChart;
