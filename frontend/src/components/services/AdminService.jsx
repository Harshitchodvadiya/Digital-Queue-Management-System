import Cookies from "js-cookie";
import axios from "axios";

const getAuthHeader = () => {
  const token = Cookies.get("jwtToken");
  return { Authorization: `Bearer ${token}` };
};

export const fetchStaff = async () => {
  const response = await axios.get("http://localhost:8081/api/v1/admin/userList", {
    headers: getAuthHeader(),
    withCredentials: true,
  });

  return response.data.filter((member) => member.role === "STAFF");
};

export const fetchServices = async () => {
  const response = await axios.get("http://localhost:8081/api/v1/admin/getAllService", {
    headers: getAuthHeader(),
    withCredentials: true,
  });
  return response.data;
};

export const updateStaff = async (editStaff) => {
  const response = await axios.put(
    `http://localhost:8081/api/v1/admin/updateStaff/${editStaff.id}`,
    {
      firstname: editStaff.firstname,
      email: editStaff.email,
      mobileNumber: editStaff.mobileNumber,
      password: editStaff.password || "",
      service_id: editStaff.service_id,
    },
    {
      headers: getAuthHeader(),
    }
  );

  return response.data;
};

export const deleteStaff = async (id) => {
  await axios.delete(`http://localhost:8081/api/v1/admin/deleteStaff/${id}`, {
    headers: getAuthHeader(),
  });
};
