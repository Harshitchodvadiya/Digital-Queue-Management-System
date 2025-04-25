import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
//Recharts:library to render responsive and customizable charts 
import axios from "axios";
import Cookies from "js-cookie";

// add more colors if services > 5
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
          },
        });
        const rawBarData = barRes.data;
        setBarData(rawBarData);        

        // Fetch pie chart data
        const pieRes = await axios.get("http://localhost:8081/api/v1/token/getAllRequestedToken", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const tokens = pieRes.data;
        console.log(tokens);
        

        // service_name counts for pie chart
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
        console.log(pieFormatted);
        
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

        {/* Makes the chart scale automatically to fit the parent container. */}
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"  // cx, cy: Centers the pie in the container.
              cy="50%"
              outerRadius={90} //size of the pie chart
              label={({ percent }) => `${(percent * 100).toFixed(0)}%`} //percentage values
            >
             
             {/*if i don't use _ , as map have 2 params,JavaScript thinks index is the element, not the actual index. */}
              {pieData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                //Cell: Used to style each slice(part) , fill: loops through colors
              ))}

            </Pie>
            <Tooltip /> //Shows data on hover. 
            <Legend layout="vertical" verticalAlign="middle" align="right" /> 
            {/* Displays labels for each slice.(parts)  eg: banking,payment*/} 
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-md w-150 h-96 md:col-span-2 ml-50">
        <h2 className="text-lg font-bold text-gray-700 mb-2">Token Statistics</h2>
        <p className="text-sm text-gray-500 mb-4">Total completed, skipped, and cancelled tokens per day</p>
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={barData}> //Base component for rendering bars using barData.
            <XAxis
              dataKey="date"
              // Converts YYYY-MM-DD to DD-MM-YYYY.
              tickFormatter={(dateStr) => {
                const [year, month, day] = dateStr.split("-");
                return `${day}-${month}-${year}`;
              }}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="completed" stackId="a" fill="#4ade80" />
            <Bar dataKey="skipped" stackId="b" fill="#facc15" />
            <Bar dataKey="cancelled" stackId="c" fill="#f87171" />
            {/* stackId: Stacks all bars vertically for the same day. */}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TokenBarChart;
