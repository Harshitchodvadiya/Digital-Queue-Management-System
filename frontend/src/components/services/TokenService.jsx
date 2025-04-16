import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const API_BASE_URL = "http://localhost:8081/api/v1/token";

//  Safely get JWT token and extract staffId
export const getTokenAndStaffId = () => {
  const token = Cookies.get("jwtToken");
  if (!token) throw new Error("No token found");

  const decoded = jwtDecode(token);

  try {
    const sub = decoded.sub;
    const parts = sub.split("/");

    if (parts.length < 2) {
      throw new Error("Invalid 'sub' format in token");
    }

    const idPart = parts[1]; // "3:STAFF"
    const staffId = parseInt(idPart.split(":")[0], 10); 

    if (isNaN(staffId)) {
      throw new Error("Invalid staff ID extracted from token.");
    }

    return { token, staffId };
  } catch (err) {
    console.error("Staff ID not found in decoded token.");
    throw new Error("Staff ID not found in decoded token.");
  }
};

// ✅ Get all today's tokens for the staff
export const getAllRequestedTokens = async () => {
  const { token, staffId } = getTokenAndStaffId();
  const response = await axios.get(`${API_BASE_URL}/getTodayTokensByStaffId/${staffId}`, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });
  // ✅ Filter only PENDING tokens
  const filteredTokens = response.data.filter(token => token.status != "PENDING");
  return filteredTokens;
};

export const getPendingTokens = async () => {
  const { token, staffId } = getTokenAndStaffId();
  const response = await axios.get(`${API_BASE_URL}/getTodayTokensByStaffId/${staffId}`, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });
  // ✅ Filter only PENDING tokens
  const filteredTokens = response.data.filter(token => token.status === "PENDING");
  return filteredTokens;
};

// ✅ Get today's summary for the staff
export const getTodaySummary = async () => {
  const { token, staffId } = getTokenAndStaffId();
  const response = await axios.get(`${API_BASE_URL}/getTodayTokensByStaffId/${staffId}`, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });

  const completed = response.data.filter(t => t.status === "COMPLETED");
  const skipped = response.data.filter(t => t.status === "SKIPPED");
  const totalServed = completed.length;
  const skippedCount = skipped.length;

  const totalServiceTime = completed.reduce((sum, token) => {
    if (token.appointedTime && token.completedTime) {
      return sum + (new Date(token.completedTime) - new Date(token.appointedTime));
    }
    return sum;
  }, 0);

  const avgServiceTime = totalServed > 0
    ? Math.round((totalServiceTime / totalServed) / 60000)
    : 0;

  return {
    totalServed,
    avgServiceTime,
    skippedTokens: skippedCount,
  };
};


// ✅ Call next token
export const callNextToken = async () => {
  const { token, staffId } = getTokenAndStaffId();
  const res = await axios.get(`${API_BASE_URL}/getTodayTokensByStaffId/${staffId}`, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });

  const nextToken = res.data.find((t) => t.status === "PENDING");
  if (!nextToken) throw new Error("No PENDING token available");

  const response = await axios.put(`${API_BASE_URL}/nextToken/${nextToken.id}`, null, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });

  return response.data;
};

// ✅ Complete current token
export const completeToken = async (tokenId) => {
  const { token } = getTokenAndStaffId();
  await axios.put(`${API_BASE_URL}/completeToken/${tokenId}`, null, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });
};

// ✅ Skip current token
export const skipToken = async (tokenId) => {
  const { token } = getTokenAndStaffId();
  await axios.put(`${API_BASE_URL}/skipToken/${tokenId}`, null, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });
};
