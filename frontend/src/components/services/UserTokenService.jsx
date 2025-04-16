import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const BASE_URL = "http://localhost:8081/api/v1/token";
const getToken = () => Cookies.get("jwtToken");

const getUserId = () => {
  const token = getToken();
  const decoded = jwtDecode(token);
  const idPart = decoded.sub.split("/")[1].split(":")[0];
  return parseInt(idPart, 10);
};

export const fetchStaffList = async () => {
  const token = getToken();

  const response = await axios.get(`http://localhost:8081/api/v1/user/userList`, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });

  // Return only STAFF users
  return response.data.filter((user) => user.role === "STAFF");
};

// ✅ Fetch current token details for the logged-in user
export const fetchUserTokenDetails = async () => {
  const token = getToken();
  const userId = getUserId();

  const response = await axios.get(`${BASE_URL}/getRequestedTokenByUserId/${userId}`, {
    withCredentials: true,
    headers: { Authorization: `Bearer ${token}` },
  });

// Check if the data contains userTokens array
// console.log("Fetched token data:", response.data);


if (Array.isArray(response.data.userTokens)) {
  // Filter tokens based on ACTIVE or PENDING status
  const userTokens =  response.data.userTokens.filter(token => 
    token.status !== "COMPLETED" && token.status !== "CANCELLED" && token.status !== "SKIPPED" 
  );

  return {
    tokens: userTokens,
    peopleAheadMap: response.data.peopleAheadMap || {},
    activeTokens : response.data.activeTokens || {}
  };
}
};

// ✅ Request a new token
export const requestToken = async ({ userId, staffId, issuedTime }) => {
  const token = getToken();

  const payload = {
    user: { id: userId },
    staffId: { id: staffId },
    issuedTime,
  };

  const response = await axios.post(`${BASE_URL}/requestToken`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
};


export const rescheduleToken = async (tokenId, newTime, newDate) => {
  const token = getToken();

  const newIssuedTime = new Date(`${newDate}T${newTime}:00`).toISOString();

  return axios.put(
    `${BASE_URL}/rescheduleToken/${tokenId}`,
    { newIssuedTime },  
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

// ✅ Cancel a token
export const cancelToken = async (tokenId) => {
  const token = getToken();
  return axios.put(`${BASE_URL}/cancelToken/${tokenId}`, null, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

