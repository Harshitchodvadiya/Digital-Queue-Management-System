// import { useEffect, useState } from "react";
// import Cookies from "js-cookie";

// function useAuthentication() {
//   const [isAuthenticated, setIsAuthenticated] = useState(!!Cookies.get("jwtToken"));
//   const [userRole, setUserRole] = useState(Cookies.get("role") || ""); // Read role from cookies

//   useEffect(() => {
//     const token = Cookies.get("jwtToken");
//     const role = Cookies.get("role");

//     setIsAuthenticated(!!token);
//     setUserRole(role || ""); // Ensure role is set properly
//   }, []);

//   return { isAuthenticated, role: userRole };
// }

// export default useAuthentication;
