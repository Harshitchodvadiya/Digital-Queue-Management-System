import { useState,useEffect } from "react";
import { getAllTokens } from "../services/TokenService";
import { useNavigate } from "react-router-dom";

const StaffSummary = ({ summary }) => {
  const [error,setError] = useState("");
  const [loading,setLoading] = useState(true);
  const navigate = useNavigate();

  const loadTokenHistory =async() =>{
    try{
      await getAllTokens();
    } catch (err) {
      console.error(err);
      setError("Failed to fetch staffs. Please try again.");
    } finally {
      setLoading(false);
    }
  } 
    useEffect(() => {
      loadTokenHistory();
    }, []);

    return (
      <div className="bg-white shadow-lg rounded-lg p-6 w-full">
        <h2 className="text-lg font-semibold border-b pb-2">Today's Summary</h2>
        <p className="text-gray-500 mt-3">Your service performance</p>
        <div className="mt-5 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600 text-sm mt-2">Total Served</span>
            <span className="text-xl font-bold text-green-600  mt-2">{summary.totalServed}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 text-sm  mt-2">Avg Service Time</span>
            <span className="text-xl font-bold text-blue-600  mt-2">{summary.avgServiceTime} min</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 text-sm  mt-2">Skipped Tokens</span>
            <span className="text-xl font-bold text-red-600  mt-2">{summary.skippedTokens}</span>
          </div>
          <div className="mt-3">
          <button
            className="bg-blue-600 text-white w-90 h-12 rounded-lg hover:bg-blue-700  mt-3 items-center"
            onClick={() => navigate("/staff-token-history")}
          >View Token History</button>
          </div>
        </div>
      </div>
    );
  };
  
  export default StaffSummary;
  