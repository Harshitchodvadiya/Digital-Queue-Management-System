import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

function useAuthentication() {
  const [cookies] = useCookies(["jwtToken", "role"]); // Access cookies
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Start as null to avoid flickering

  useEffect(() => {
    setIsAuthenticated(!!cookies.jwtToken); // Convert to boolean
  }, [cookies.jwtToken]);

  return { isAuthenticated, role: cookies.role };
}

export default useAuthentication;
