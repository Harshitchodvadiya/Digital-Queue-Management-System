import { useState } from "react";
import { GoClock } from "react-icons/go";
import Pagination from "../reusableComponents/Pagination"; // Make sure the path is correct

const CustomerQueue = ({ tokens }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const tokensPerPage = 4;

  // Calculate token slices for pagination
  const indexOfLastToken = currentPage * tokensPerPage;
  const indexOfFirstToken = indexOfLastToken - tokensPerPage;
  const currentTokens = tokens.slice(indexOfFirstToken, indexOfLastToken);

  // Total pages based on tokens per page
  const totalPages = Math.ceil(tokens.length / tokensPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
  
  <div className="bg-white shadow-xl rounded-2xl p-6 mt-4 h-[29rem] flex flex-col ">
    {/* Header */}
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold">Customer Queue</h2>
      <span className="text-sm text-gray-500">{tokens.length} Waiting</span>
    </div>

    <div className="flex-1 overflow-hidden">
      {tokens.length === 0 ? (
        <p className="text-gray-500">No customers in queue.</p>
      ) : (
        <ul className="divide-y">
          {currentTokens.map((token, index) => (
            <li
              key={token.id}
              className="flex justify-between items-center py-4 gap-4 flex-wrap"
            >
              <div className="flex gap-4 items-center">
                <span className="text-sm font-semibold bg-gray-200 px-3 py-1 rounded-full">
                  {(currentPage - 1) * tokensPerPage + index + 1}
                </span>
                <div>
                  <p className="font-medium text-gray-800">
                    <span className="font-semibold">
                      Token Number : {token.id}
                    </span>{" "}
                    - {token.user?.firstname}
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
      )}
    </div>
  
    {/* Pagination at the bottom */}
    {totalPages > 0 && (
      <div className="flex justify-center mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      </div>
    )}
  </div>
  
  );
};

export default CustomerQueue;
