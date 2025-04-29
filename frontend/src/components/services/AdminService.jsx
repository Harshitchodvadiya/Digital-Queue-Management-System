import Cookies from "js-cookie";
import axios from "axios";
const adminToken = Cookies.get("jwtToken");

export const fetchStaff = async () => {
    const response = await axios.get("http://localhost:8081/api/v1/admin/userList", {
      headers: { Authorization: `Bearer ${adminToken}` },  
      withCredentials: true,
      });

    const staff = response.data.filter((member) => member.role === "STAFF");

    return staff;
  };
  
  export const fetchServices = async () => {
    const response = await axios.get("http://localhost:8081/api/v1/admin/getAllService", {
       headers: { Authorization: `Bearer ${adminToken}` },
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
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );

    return response.data;
  };

  export const deleteStaff = async (id) => {
      await axios.delete(`http://localhost:8081/api/v1/admin/deleteStaff/${id}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
  };