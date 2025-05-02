// import { useState,useEffect } from "react";
// import { getAllTokens } from "../services/TokenService";
// import Navbar from "../Navbar";
// import { useNavigate } from "react-router-dom";
// import Pagination from "../reusableComponents/Pagination";
// import { IoMdArrowRoundBack } from "react-icons/io";

// const StaffTokenHistory = () => {
//     const [error, setError] = useState("");
//     const [loading, setLoading] = useState(true);
//     const [tokens, setTokens] = useState([]);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [tokensPerPage] = useState(6);
//     const navigate = useNavigate();
  
//     const loadTokenHistory = async () => {
//       try {
//         const response = await getAllTokens();
//         const filteredTokens = response.filter(token => token.status != "CANCELLED");
//         console.log(filteredTokens);
        
//         setTokens(filteredTokens);
//       } catch (err) {
//         console.error(err);
//         setError("Failed to fetch tokens. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     useEffect(() => {
//       loadTokenHistory();
//     }, []);
  
//     const formatDateTime = (isoString) => {
//       if (!isoString) return "N/A";
//       const date = new Date(isoString);
//       return date.toLocaleString("en-GB", {
//         day: "2-digit",
//         month: "2-digit",
//         year: "numeric",
//         hour: "2-digit",
//         minute: "2-digit",
//         hour12: false,
//       });
//     };
  
//     const indexOfLastToken = currentPage * tokensPerPage;
//     const indexOfFirstToken = indexOfLastToken - tokensPerPage;
//     const currentTokens = tokens.slice(indexOfFirstToken, indexOfLastToken);
//     const totalPages = Math.ceil(tokens.length / tokensPerPage);
  
//     return (
//       <div className="min-h-screen flex flex-col bg-white text-black">
//         <Navbar />
  
//         <div className="p-6">
//           <button
//             className="bg-blue-500 text-white px-3 py-2 rounded-md mb-4"
//             onClick={() => navigate("/staff")}
//           >
//             <IoMdArrowRoundBack />
//           </button>
  
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-2xl font-bold">Token History</h2>
//           </div>
  
//           {loading ? (
//             <p>Loading history...</p>
//           ) : error ? (
//             <p className="text-red-500">{error}</p>
//           ) : tokens.length === 0 ? (
//             <p className="text-gray-500">No token history found.</p>
//           ) : (
//             <>
//               <div className="overflow-x-auto">
//                 <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
//                   <thead className="bg-gray-800 text-white">
//                     <tr>
//                       <th className="py-4 px-6 text-left">Token ID</th>
//                       <th className="py-4 px-6 text-left">Appointed Date and Time</th>
//                       <th className="py-4 px-6 text-left">Completed Time</th>
//                       <th className="py-4 px-6 text-left">Status</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {currentTokens.map((token, index) => (
//                       <tr key={token.id} className="border-b hover:bg-gray-100 text-gray-700">
//                         <td className="py-4 px-6 font-medium text-gray-800">
//                           {(currentPage - 1) * tokensPerPage + index + 1}
//                         </td>
//                         <td className="py-4 px-6">{formatDateTime(token.appointedTime)}</td>
//                         <td className="py-4 px-6">{formatDateTime(token.completedTime)}</td>
//                         <td className="py-4 px-6">{token.status}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
  
//               {totalPages > 1 && (
//                 <Pagination
//                   currentPage={currentPage}
//                   totalPages={totalPages}
//                   onNext={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//                   onPrev={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//                 />
//               )}
//             </>
//           )}
//         </div>
//       </div>
//     );
//   };
  
// export default StaffTokenHistory;

import { useState, useEffect } from "react";
import { getAllTokens } from "../services/TokenService";
import Navbar from "../Navbar";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import Filter from "../reusableComponents/Filter";
import Pagination from "../reusableComponents/Pagination";

const StaffTokenHistory = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [tokens, setTokens] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [tokensPerPage] = useState(6);
  const navigate = useNavigate();

  // Filter state
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const loadTokenHistory = async () => {
    try {
      const response = await getAllTokens();
      const filteredTokens = response.filter(token => token.status !== "CANCELLED");
      setTokens(filteredTokens);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch tokens. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTokenHistory();
  }, []);

  const formatDateTime = (isoString) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  // Apply filters
  const filteredTokens = tokens.filter((token) => {
    const matchesDate = selectedDate
      ? token.appointedTime?.startsWith(selectedDate)
      : true;
    const matchesStatus = selectedStatus
      ? token.status === selectedStatus
      : true;

    return matchesDate && matchesStatus;
  });

  // Pagination logic
  const indexOfLastToken = currentPage * tokensPerPage;
  const indexOfFirstToken = indexOfLastToken - tokensPerPage;
  const currentTokens = filteredTokens.slice(indexOfFirstToken, indexOfLastToken);
  const totalPages = Math.ceil(filteredTokens.length / tokensPerPage);

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Navbar />

      <div className="p-6">
        <button
          className="bg-blue-500 text-white px-3 py-2 rounded-md mb-4"
          onClick={() => navigate("/staff")}
        >
          <IoMdArrowRoundBack />
        </button>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Token History</h2>
        </div>

        {/* Filter */}
        <div className="mb-6 items-end justify-end flex">
          <Filter
            selectedDate={selectedDate}
            selectedStatus={selectedStatus}
            onDateChange={(val) => {
              setSelectedDate(val);
              setCurrentPage(1);
            }}
            onStatusChange={(val) => {
              setSelectedStatus(val);
              setCurrentPage(1);
            }}
            showServiceFilter={false}
            isUserSide={false}
          />
        </div>

        {loading ? (
          <p>Loading history...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : filteredTokens.length === 0 ? (
          <p className="text-gray-500">No token history found.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="py-4 px-6 text-left">Token ID</th>
                    <th className="py-4 px-6 text-left">Appointed Date and Time</th>
                    <th className="py-4 px-6 text-left">Completed Time</th>
                    <th className="py-4 px-6 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTokens.map((token, index) => (
                    <tr key={token.id} className="border-b hover:bg-gray-100 text-gray-700">
                      <td className="py-4 px-6 font-medium text-gray-800">
                        {(currentPage - 1) * tokensPerPage + index + 1}
                      </td>
                      <td className="py-4 px-6">{formatDateTime(token.appointedTime)}</td>
                      <td className="py-4 px-6">{formatDateTime(token.completedTime)}</td>
                      <td className="py-4 px-6">{token.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onNext={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                onPrev={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StaffTokenHistory;
