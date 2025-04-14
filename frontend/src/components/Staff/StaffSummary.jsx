const StaffSummary = ({ summary }) => {
    return (
      <div className="bg-white shadow-lg rounded-lg p-6 w-full">
        <h2 className="text-lg font-semibold border-b pb-2">Today's Summary</h2>
        <p className="text-gray-500 mt-2">Your service performance</p>
        <div className="mt-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600 text-sm">Total Served</span>
            <span className="text-xl font-bold text-green-600">{summary.totalServed}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 text-sm">Avg Service Time</span>
            <span className="text-xl font-bold text-blue-600">{summary.avgServiceTime} min</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 text-sm">Skipped Tokens</span>
            <span className="text-xl font-bold text-red-600">{summary.skippedTokens}</span>
          </div>
        </div>
      </div>
    );
  };
  
  export default StaffSummary;
  