

import { useState } from "react";
import { Users, CheckCircle, SkipForward } from "lucide-react";

const ActiveToken = ({ activeToken, handleCallNext, handleAction }) => {
  const [loadingNext, setLoadingNext] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [loadingSkip, setLoadingSkip] = useState(false);

  const onCallNext = async () => {
    setLoadingNext(true);
    try {
      await handleCallNext();
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingNext(false);
    }
  };

  const onComplete = async () => {
    setLoadingComplete(true);
    try {
      await handleAction("complete");
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingComplete(false);
    }
  };

  const onSkip = async () => {
    setLoadingSkip(true);
    try {
      await handleAction("skip");
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSkip(false);
    }
  };

  return (
    <div className="h-85 bg-white shadow-lg rounded-2xl p-6 w-full">
      {!activeToken ? (
        <div className="text-center mt-8 items-center justify-center h-75">
          <Users className="h-20 w-20 text-gray-400 mx-auto" />
          <h1 className="text-xl font-semibold mt-4 text-gray-800">
            No Customer Currently Being Served
          </h1>
          <p className="text-gray-500 mt-2">
            Click the call next button to serve the next person in the queue.
          </p>
          <button
            className={`mt-4 px-6 py-3 rounded-lg ml-65 flex items-center gap-2 ${
              loadingNext
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white`}
            onClick={onCallNext}
            disabled={loadingNext}
          >
            {loadingNext ? (
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
            ) : (
              <Users className="h-5 w-5" />
            )}
            {loadingNext ? "Calling Next Customer" : "Call Next Customer"}
          </button>
        </div>
      ) : (
        <>
          <div className="flex justify-end items-end mb-2">
            <h3 className="text-gray-500">
              Started {new Date(activeToken.appointedTime).toLocaleString()}
            </h3>
          </div>

          <div className="justify-end items-end flex mt-4">
            <h3 className="text-blue-600 text-sm font-medium bg-blue-100 px-2 py-1 rounded-lg">
              Estimated service time:{" "}
              {activeToken.staffId?.service?.estimatedTime} mins
            </h3>
          </div>

          <div className="h-35">
            <span className="bg-blue-500 text-white px-2 mt-4 py-1 rounded-full text-sm">
              Now Serving
            </span>

            <h2 className="text-3xl font-bold mb-1 mt-7">{activeToken.id}</h2>
            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-700 font-medium mt-2">
                {activeToken.user?.firstname}
              </p>
              <span className="text-blue-600 text-sm font-medium bg-blue-100 px-2 py-1 rounded-lg">
                {activeToken.staffId?.service?.serviceName || "Service"}
              </span>
            </div>

            <div className="flex gap-4 mt-7">
              {/* Complete Button */}
              <button
                className={`${
                  loadingComplete
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-700"
                } text-white px-4 py-2 rounded-lg flex items-center gap-2`}
                onClick={onComplete}
                disabled={loadingComplete}
              >
                {loadingComplete ? (
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                ) : (
                  <CheckCircle className="h-5 w-5" />
                )}
                {loadingComplete ? "Processing..." : "Complete Service"}
              </button>

              {/* Skip Button */}
              <button
                className={`${
                  loadingSkip
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-gray-500 hover:bg-gray-600"
                } text-white px-4 py-2 rounded-lg flex items-center gap-2`}
                onClick={onSkip}
                disabled={loadingSkip}
              >
                {loadingSkip ? (
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                ) : (
                  <SkipForward className="h-5 w-5" />
                )}
                {loadingSkip ? "Processing..." : "Skip Customer"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ActiveToken;
