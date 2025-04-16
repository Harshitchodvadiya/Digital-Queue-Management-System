import { useEffect, useState } from "react";
import {
  getAllRequestedTokens,
  getTodaySummary,
  callNextToken,
  completeToken,
  skipToken,
  getPendingTokens
} from "../components/services/TokenService";
import CustomerQueue from "../components/Staff/CustomerQueue";
import ActiveToken from "../components/Staff/ActiveToken";
import StaffSummary from "../components/Staff/StaffSummary";
import AllTokens from "../components/Staff/AllTokens";
import Navbar from "../components/Navbar";

const StaffPage = () => {
  const [tokens, setTokens] = useState([]);
  const [tokensStatus, setTokensStatus] = useState([]);
  const [activeToken, setActiveToken] = useState(null);
  const [summary, setSummary] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchTokens = async () => {
    try {
      const res = await getAllRequestedTokens();
      setTokensStatus(res);
    } catch (err) {
      console.error("Error fetching tokens:", err);
    }
  };

  const fetchPendingTokens = async () => {
    try {
      const res = await getPendingTokens();
      setTokens(res);
    } catch (err) {
      console.error("Error fetching tokens:", err);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await getTodaySummary();
      setSummary(res);
    } catch (err) {
      console.error("Error fetching summary:", err);
    }
  };

  const handleCallNext = async () => {
    try {
      const res = await callNextToken();
      setActiveToken(res);
      await fetchTokens();
      await fetchSummary();
    } catch (err) {
      console.error("Error calling next token:", err);
    }
  };

  const handleAction = async (type) => {
    try {
      if (!activeToken) return;
      if (type === "complete") await completeToken(activeToken.id);
      if (type === "skip") await skipToken(activeToken.id);
      setActiveToken(null);
      await fetchTokens();
      await fetchSummary();
    } catch (err) {
      console.error(`Error on ${type}:`, err);
    }
  };

  useEffect(() => {
    fetchTokens();
    fetchSummary();
    fetchPendingTokens()
    const interval = setInterval(() => {
      fetchSummary();
      fetchPendingTokens();
    }, 1000); // every 10 sec

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-6 py-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Staff Portal</h1>
          <p className="text-gray-600">Manage customer queue and service delivery</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Side */}
          <div className="md:col-span-2 space-y-6">
            {/* ActiveToken */}
              <ActiveToken activeToken={activeToken}
                  handleCallNext={handleCallNext}
                  handleAction={handleAction} />

            {/* Queue List */}
              <CustomerQueue tokens={tokens} />
           
          </div>

          {/* Right Side */}
          <div className="space-y-6">
            {/* Summary Card */}
              <StaffSummary summary={summary} />
          
            {/* Completed/Skipped Tokens */}
              <AllTokens
                allTokens={tokensStatus}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                itemsPerPage={itemsPerPage}
              />
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffPage;
