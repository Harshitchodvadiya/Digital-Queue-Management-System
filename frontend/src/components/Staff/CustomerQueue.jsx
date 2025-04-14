// import { jwtDecode } from "jwt-decode";
// import Cookies from "js-cookie";
// import { useEffect, useState } from "react";
// import { GoClock } from "react-icons/go";
// import axios from "axios";

// const CustomerQueue = () => {
//   const [tokens, setTokens] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [staffId, setStaffId] = useState(null);

//   useEffect(() => {
//     const fetchTokens = async () => {
//       const jwtToken = Cookies.get("jwtToken");
//       if (!jwtToken) return console.warn("JWT not found");

//       const decoded = jwtDecode(jwtToken);
//       const subParts = decoded.sub.split("/");
//       const extractedId = parseInt(subParts[1]?.split(":")[0], 10);
//       if (!extractedId) return console.warn("Staff ID not found");

//       setStaffId(extractedId);
//       try {
//         const res = await axios.get(`http://localhost:8081/api/v1/token/getTodayTokensByStaffId/${extractedId}`,{
//           headers: { Authorization: `Bearer ${jwtToken}` },
//           withCredentials: true,
//         });
//         const filteredTokens = res.data.filter(token => token.status === "PENDING");
//         setTokens(filteredTokens);
//       } catch (err) {
//         console.error("Error fetching tokens:", err);
//       }
//       setLoading(false);
//     };
//     fetchTokens();
//   }, []);

//   return (
//     <div className="bg-white shadow-xl rounded-2xl p-6 mt-4 ">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-semibold">Customer Queue</h2>
//         <span className="text-sm text-gray-500">{tokens.length} Waiting</span>
//       </div>

//       {tokens.length === 0 ? (
//         <p className="text-gray-500">No customers in queue.</p>
//       ) : (
//         <ul className="divide-y">
//           {tokens.map((token, index) => (
//             <li key={token.id} className="flex justify-between items-center py-4 gap-4 flex-wrap">
//               <div className="flex gap-4 items-center">
//                 <span className="text-sm font-semibold bg-gray-200 px-3 py-1 rounded-full">{index + 1}</span>
//                 <div>
//                   <p className="font-medium text-gray-800">
//                     <span className="font-semibold">Token Number : {token.id}</span> - {token.user?.firstname}
//                   </p>
//                   <span className="text-blue-600 text-sm font-medium bg-blue-100 px-2 py-1 rounded-lg">
//                     {token.staffId?.service?.serviceName}
//                   </span>
//                 </div>
//               </div>

//               <div className="flex items-center gap-1 text-sm text-gray-500">
//                 <GoClock className="h-4 w-4" />
//                 <span>{token.additionalWaitTime} min</span>
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default CustomerQueue;


import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { GoClock } from "react-icons/go";
import axios from "axios";

const CustomerQueue = () => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [staffId, setStaffId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const tokensPerPage = 5;

  useEffect(() => {
    const fetchTokens = async () => {
      const jwtToken = Cookies.get("jwtToken");
      if (!jwtToken) return console.warn("JWT not found");

      const decoded = jwtDecode(jwtToken);
      const subParts = decoded.sub.split("/");
      const extractedId = parseInt(subParts[1]?.split(":")[0], 10);
      if (!extractedId) return console.warn("Staff ID not found");

      setStaffId(extractedId);
      try {
        const res = await axios.get(
          `http://localhost:8081/api/v1/token/getTodayTokensByStaffId/${extractedId}`,
          {
            headers: { Authorization: `Bearer ${jwtToken}` },
            withCredentials: true,
          }
        );
        const filteredTokens = res.data.filter(token => token.status === "PENDING");
        setTokens(filteredTokens);
      } catch (err) {
        console.error("Error fetching tokens:", err);
      }
      setLoading(false);
    };
    fetchTokens();
  }, []);

  // Pagination logic
  const indexOfLastToken = currentPage * tokensPerPage;
  const indexOfFirstToken = indexOfLastToken - tokensPerPage;
  const currentTokens = tokens.slice(indexOfFirstToken, indexOfLastToken);
  const totalPages = Math.ceil(tokens.length / tokensPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 mt-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Customer Queue</h2>
        <span className="text-sm text-gray-500">{tokens.length} Waiting</span>
      </div>

      {tokens.length === 0 ? (
        <p className="text-gray-500">No customers in queue.</p>
      ) : (
        <>
          <ul className="divide-y">
            {currentTokens.map((token, index) => (
              <li key={token.id} className="flex justify-between items-center py-4 gap-4 flex-wrap">
                <div className="flex gap-4 items-center">
                  <span className="text-sm font-semibold bg-gray-200 px-3 py-1 rounded-full">
                    {(currentPage - 1) * tokensPerPage + index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-gray-800">
                      <span className="font-semibold">Token Number : {token.id}</span> - {token.user?.firstname}
                    </p>
                    <span className="text-blue-600 text-sm font-medium bg-blue-100 px-2 py-1 rounded-lg">
                      {token.staffId?.service?.serviceName}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <GoClock className="h-4 w-4" />
                  <span>{token.additionalWaitTime} min</span>
                </div>
              </li>
            ))}
          </ul>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-4 gap-2">
            {[...Array(totalPages)].map((_, idx) => {
              const pageNum = idx + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-1 rounded-md text-sm font-medium hover:bg-gray-4  00 ${
                    currentPage === pageNum ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default CustomerQueue;
