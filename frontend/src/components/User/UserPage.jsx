import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie"; 
import { jwtDecode } from "jwt-decode"; 
import { useNavigate } from "react-router-dom"; 
import Navbar from "../Navbar";

const UserHomePage = () => {
  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [tokens, setTokens] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = Cookies.get("jwtToken");

  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const parts = decodedToken.sub.split("/");
        if (parts.length > 1) {
          const userIdPart = parts[1].split(":")[0];
          setUserId(parseInt(userIdPart, 10));
        }
      } catch (error) {
        console.error("Error decoding JWT:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchStaff();
      fetchTokensList();
    }
  }, [userId]);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8081/api/v1/user/userList", {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });

      const staffData = response.data.filter((user) => user.role === "STAFF");
      setStaffList(staffData);
    } catch (err) {
      setError("Failed to fetch staff members. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTokensList = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8081/api/v1/token/getRequestedTokenByUserId/${userId}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });

      const filteredTokens = response.data.filter(
        (token) => token.status !== "COMPLETED"
      );
      setTokens(filteredTokens);
    } catch (err) {
      setError("Failed to fetch tokens. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const requestToken = async () => {
    if (!selectedStaff || !selectedDate || !selectedTime) {
      alert("Please select a service, date, and time.");
      return;
    }

    if (!userId) {
      alert("User ID not found. Please log in again.");
      return;
    }

    const issuedTime = `${selectedDate}T${selectedTime}:00`;

    const requestBody = {
      user: { id: userId },
      staffId: { id: selectedStaff.id },
      issuedTime,
    };

    try {
      await axios.post("http://localhost:8081/api/v1/token/requestToken", requestBody, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });

      alert("Token requested successfully!");
      fetchTokensList();
    } catch (error) {
      alert(error.response?.data || "Failed to request token.");
    }
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      // second: "2-digit",
      hour12: false,
    });
  };

  const getBoxColor = (status) => {
    if (status === "PENDING") return "bg-yellow-100";
    if (status === "ACTIVE") return "bg-green-300";
    return "bg-white";
  };


  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Navbar />

      <div className="flex flex-row p-6 gap-6">
        {/* Left Side: Request Token Section */}
        <div className="w-1/3 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Request a Token</h2>
          <p className="text-sm text-gray-500 mb-4">Select a service to join the queue</p>

          <select
            className="w-full border p-2 rounded-md"
            onChange={(e) => setSelectedStaff(staffList.find(staff => staff.id == e.target.value))}
          >
            <option value="">-- Select Service --</option>
            {staffList.map((staff) => (
              <option key={staff.id} value={staff.id}>
                {staff.service?.serviceName || "N/A"} - {staff.firstname}
              </option>
            ))}
          </select>

          {selectedStaff && (
            <div className="bg-gray-100 p-3 rounded-md mt-3">
              <p className="text-sm">
                <strong>Service Details:</strong> {selectedStaff.service?.serviceDescription || "N/A"}
              </p>
              <p className="text-sm">
                <strong>Estimated time per customer:</strong> <span className="font-bold">{selectedStaff.service?.estimatedTime || "N/A"} minutes</span>
              </p>
            </div>
          )}

          <input
            type="date"
            className="w-full border p-2 rounded-md mt-4"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />

          <input
            type="time"
            className="w-full border p-2 rounded-md mt-2"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
          />

          <button
            className="bg-blue-500 px-4 py-2 mt-4 w-full text-white rounded-md font-bold"
            onClick={requestToken}
          >
            Request Token
          </button>

          <button
            className="bg-gray-500 px-4 py-2 mt-2 w-full text-white rounded-md font-bold"
            onClick={() => navigate("/token-history")}
          >
            View History
          </button>
        </div>

        {/* Right Side: Display Today's Tokens */}
        <div className="w-2/3">
          <h2 className="text-2xl font-bold mb-4">Your Active Tokens</h2>

          <div className="grid grid-cols-2 gap-4">
            {tokens.map((token) => (
              <div
                key={token.id}
                className={`p-4 shadow-md rounded-md ${getBoxColor(token.status)}`}
              >
                <h3 className="font-bold">Token #{token.id}</h3>
                <p>{token.staffId?.service?.serviceName}</p>
                <p>
                  <strong>Status:</strong> {token.status}
                </p>
                <p>
                  <strong>Issued Time:</strong> {formatDateTime(token.issuedTime)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHomePage;
