import { Users, CheckCircle, SkipForward } from "lucide-react";

const ActiveToken = ({ activeToken, handleCallNext, handleAction }) => {

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 w-full ">
      {!activeToken ? (
        <div className="text-center mt-8 items-center justify-center h-75">
          <Users className="h-20 w-20 text-gray-400 mx-auto" />
          <h1 className="text-xl font-semibold mt-4 text-gray-800">
            No Customer Currently Being Served
          </h1>
          <p className="text-gray-500 mt-2">Click the call next button to serve the next person in the queue.</p>
          <button
            className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 ml-65 flex items-center gap-2"
            onClick={handleCallNext}
          >
          <Users className="h-5 w-5"/>  Call Next Customer
          </button>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-2">
            <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-sm">Now Serving</span>
            <span className="text-gray-500">
              Started {new Date(activeToken.appointedTime).toLocaleString()}
            </span>
          </div>

          <div className="h-35">

          <h2 className="text-3xl font-bold mb-1">{activeToken.id}</h2>
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-700 font-medium">{activeToken.user?.firstname}</p>
            <span className="text-blue-600 text-sm font-medium bg-blue-100 px-2 py-1 rounded-lg">
              {activeToken.staffId?.service?.serviceName || "Service"}
            </span>
          </div>

          <div className="flex gap-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              onClick={() => handleAction("complete")}
            >
              <CheckCircle className="h-5 w-5" /> Complete Service
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 flex items-center gap-2"
              onClick={() => handleAction("skip")}
            >
              <SkipForward className="h-5 w-5" /> Skip Customer
            </button>
          </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ActiveToken;
