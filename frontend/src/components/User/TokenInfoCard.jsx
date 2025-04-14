import React, { useEffect, useState } from "react";
import { fetchUserTokenDetails, cancelToken } from "../services/UserTokenService";
import { MdOutlineWatchLater } from "react-icons/md";
import { BsPersonCheck } from "react-icons/bs";
import { RiErrorWarningLine } from "react-icons/ri";
import { GoSync } from "react-icons/go";
import RescheduleTokenModal from "./RescheduleTokenModal";

const TokenInfoCard = ({ userId }) => {
  const [tokens, setTokens] = useState([]);
  const [serviceActiveTokens, setServiceActiveTokens] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [peopleAheadMap, setPeopleAheadMap] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedToken, setSelectedToken] = useState(null);

  const loadTokenInfo = async () => {
    try {
      const data = await fetchUserTokenDetails();
      setTokens(data.tokens);
      setPeopleAheadMap(data.peopleAheadMap);
      setServiceActiveTokens(data.activeTokens);
    } catch (err) {
      console.error(err);
      setError("Failed to load token information.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTokenInfo();
  }, [userId]);

  const openRescheduleModal = (token) => {
    setSelectedToken(token);
    setShowModal(true);
  };

  const closeRescheduleModal = () => {
    setShowModal(false);
    setSelectedToken(null);
  };

  if (loading) return <p className="text-center text-muted-foreground">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!tokens) return <p className="text-center text-muted-foreground">No token found.</p>;

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-6">
        {tokens.length > 0 ? (
          tokens.map((token) => (
            <div
              key={token.id}
              className="p-6 shadow-lg rounded-2xl bg-white border border-gray-200"
            >
              <p className="text-gray-600 text-sm font-semibold">
                {token.staffId?.service?.serviceName || "Service"}
              </p>

              <div className="flex justify-between items-center mt-2">
                <h3 className="text-xl font-bold">{token.id}</h3>
                <span className="px-3 py-1 text-sm font-semibold text-blue-600 bg-blue-100 rounded-xl">
                  {token.status || "Waiting"}
                </span>
              </div>

              <p className="flex items-center mt-2 text-gray-500">
                <MdOutlineWatchLater />
                <span className="ml-1">{Math.floor(token.additionalWaitTime) || 0} min</span>
              </p>
              <p className="flex items-center mt-1 text-gray-500">
                <BsPersonCheck />
                <span className="ml-1">
                  People Ahead:{" "}
                  {peopleAheadMap && peopleAheadMap[token.id] !== undefined
                    ? peopleAheadMap[token.id]
                    : 0}
                </span>
              </p>

              {serviceActiveTokens[token.staffId?.service?.serviceId] && (
                <p className="mt-1 p-1 rounded-md font-bold text-black">
                  Current Token for {token.staffId?.firstname} :{" "}
                  <strong>{serviceActiveTokens[token.staffId?.service?.serviceId]?.id}</strong>
                </p>
              )}

              {peopleAheadMap[token.id] === 0 && (
                <div className="mt-3 bg-green-200 p-2 rounded-md text-green-700 text-sm flex items-center">
                  Next Turn Will Be Yours
                </div>
              )}

              {peopleAheadMap[token.id] > 0 && peopleAheadMap[token.id] < 4 && (
                <div className="mt-3 bg-yellow-100 p-2 rounded-md text-yellow-700 text-sm flex items-center">
                  <RiErrorWarningLine />
                  {peopleAheadMap[token.id]} customers ahead of you
                </div>
              )}

              <div className="mt-auto flex justify-between pt-4">
                {token.status === "PENDING" && (
                  <>
                    <button
                      onClick={() => openRescheduleModal(token)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-1/2 mr-2 flex items-center justify-center space-x-2"
                    >
                      <GoSync className="h-5 w-5" />
                      <span>Reschedule</span>
                    </button>
                    <button
                      onClick={() => cancelToken(token.id).then(loadTokenInfo)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 w-1/2"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-2 mt-55 text-2xl">
            No active tokens
          </p>
        )}
      </div>

      {showModal && selectedToken && (
        <RescheduleTokenModal
          token={selectedToken}
          onClose={closeRescheduleModal}
          onUpdate={loadTokenInfo}
        />
      )}
    </div>
  );
};

export default TokenInfoCard;
