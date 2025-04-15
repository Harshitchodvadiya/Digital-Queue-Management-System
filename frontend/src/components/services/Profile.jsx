import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const BASE_URL = "http://localhost:8081/api/v1/user";
const getToken = () => Cookies.get("jwtToken");

const getUserId = () => {
  const token = getToken();
  const decoded = jwtDecode(token);
  const idPart = decoded.sub.split("/")[1].split(":")[0];
  return parseInt(idPart, 10);
};

//  ✅ Fetch current token details for the logged-in user
export const getUserProfile = async () => {
  const token = getToken();
//   const userId = getUserId();

  const response = await axios.get(`${BASE_URL}/profile`, {
    withCredentials: true,
    headers: { Authorization: `Bearer ${token}` },
  });

  console.log(response.data);
  return response.data;
}