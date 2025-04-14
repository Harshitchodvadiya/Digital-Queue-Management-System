import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import SummaryCards from "../components/Admin/SummaryCards.jsx";
import StaffList from "../components/Staff/StaffList";
import Analytics from '../components/Admin/Analytics'
import TabNav from "../components/Admin/TabNav";
import Navbar from "../components/Navbar";
import ServiceList from "../components/Admin/ServiceList";

function AdminPage() {
  const [tokens, setTokens] = useState([]);
  const [totalTokens, setTotalTokens] = useState(0);
  const [averageWaitingTime, setAverageWaitingTime] = useState({ mins: 0, secs: 0 });
  const [totalStaff, setTotalStaff] = useState(0);
  const [todaysTokens, setTodaysTokens] = useState(0);
  const [activeTab, setActiveTab] = useState("services");

  const token = Cookies.get("jwtToken");

  useEffect(() => {
    fetchRequestedTokens();
    fetchStaff();
  }, []);

  const fetchRequestedTokens = async () => {
    try {
      const response = await axios.get("http://localhost:8081/api/v1/token/getAllRequestedToken", {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });

      const fetchedTokens = response.data;
      setTokens(fetchedTokens);
      setTotalTokens(fetchedTokens.length);

      const completedTokens = fetchedTokens.filter(token =>
        token.status === "COMPLETED" &&
        token.completedTime &&
        new Date(token.completedTime) - new Date(token.issuedTime) <= 7200000
      );

      if (completedTokens.length > 0) {
        const totalWaitingTimeMs = completedTokens.reduce((sum, token) => {
          return sum + (new Date(token.completedTime) - new Date(token.issuedTime));
        }, 0);

        const avgWaitingTimeMs = totalWaitingTimeMs / completedTokens.length;
        setAverageWaitingTime({
          mins: Math.floor(avgWaitingTimeMs / 60000),
          secs: Math.floor((avgWaitingTimeMs % 60000) / 1000),
        });
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      const todayTokens = fetchedTokens.filter(token => {
        const issuedTime = new Date(token.issuedTime);
        return issuedTime >= today && issuedTime < tomorrow;
      });

      setTodaysTokens(todayTokens.length);
    } catch (error) {
      console.error("Error fetching tokens:", error);
    }
  };

  const fetchStaff = async () => {
    try {
      const response = await axios.get("http://localhost:8081/api/v1/admin/userList", {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });

      const staff = response.data.filter(member => member.role === "STAFF");
      setTotalStaff(staff.length);
    } catch (err) {
      console.error("Error fetching staff:", err);
    }
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case "services": return <ServiceList />;
      case "staff": return <StaffList />;
      case "analytics": return <Analytics />;
      default: return null;
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col">
      <Navbar />

      <div className="container mx-auto px-6 py-6">
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage services, staff and system settings</p>
        </div>
      </div>

      <SummaryCards
        totalTokens={totalTokens}
        avgTime={averageWaitingTime}
        totalStaff={totalStaff}
        todaysTokens={todaysTokens}
      />

      <div className="mt-8 ml-12">
        <TabNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <div className="p-6">
        {renderActiveTab()}
      </div>
    </div>
  );
}

export default AdminPage;
