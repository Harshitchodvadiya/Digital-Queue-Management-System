const AllTokens = ({ allTokens, currentPage, setCurrentPage, itemsPerPage }) => {
    const filtered = allTokens.filter((token) =>
      ["COMPLETED", "SKIPPED", "CANCELLED"].includes(token.status)
    );
  
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const currentTokens = filtered.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  
    return (
      <div className="bg-white shadow-xl rounded-lg p-6 w-full h-100 flex flex-col mt-40">
        <h2 className="text-lg font-semibold border-b pb-2">Today's Tokens</h2>
        <div className="mt-3 flex-1 overflow-y-auto">
          {currentTokens.length === 0 ? (
            <p className="text-gray-500 text-center">No tokens for today</p>
          ) : (
            currentTokens.map((token) => (
              <div key={token.id} className="border-b py-2">
                <h3 className="text-md font-medium">
                  Token Number : {token.id} - {token.user?.firstname}
                </h3>
                <div className="flex justify-between items-center">
                  <p className="text-gray-700">
                    {token.user?.firstname} {token.user?.lastname}
                  </p>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      token.status === "COMPLETED"
                        ? "text-green-600 bg-green-100"
                        : "text-red-600 bg-red-100"
                    }`}
                  >
                    {token.status}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">{token.staffId?.service?.serviceName}</p>
                  <p className="text-gray-600 text-xs pr-2">
                    {token.appointedTime && token.completedTime
                      ? `${Math.round(
                          (new Date(token.completedTime).getTime() -
                            new Date(token.appointedTime).getTime()) /
                            60000
                        )} min`
                      : "N/A"}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="flex justify-center gap-2 mt-3">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded ${
                page === currentPage
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    );
  };
  
  export default AllTokens;
  