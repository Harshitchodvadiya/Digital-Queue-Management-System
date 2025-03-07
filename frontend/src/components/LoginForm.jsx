import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie"; // Import Cookies

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const user = { email, password };

    axios
      .post("http://localhost:8081/api/v1/auth/signin", user, {
        withCredentials: true,
      })
      .then((response) => {
        console.log("Login successful:", response.data);
        const token = response.data.token;

        // Decode JWT token to get user details
        const decodedToken = jwtDecode(token);
        const subValue = decodedToken.sub;
        console.log(subValue);

        // Extract email and role correctly
        const parts = subValue.split("/"); // Splitting by '/'
        const userEmail = parts[0]; // Extract email
        const rolePart = parts[1].split(":"); // Splitting remaining part by ':'
        const userRole = rolePart[1]; // Extract role

        // Store token and user details in cookies
        Cookies.set("jwtToken", token, { expires: 1 });
        Cookies.set("firstname", userEmail.split("@")[0], { expires: 1 });
        Cookies.set("role", userRole, { expires: 1 });

        // Redirect based on role
        if (userRole === "ADMIN") {
          navigate("/admin");
        } else if (userRole === "STAFF") {
          navigate("/staff");
        } else {
          navigate("/user");
        }
      })
      .catch((error) => {
        console.error("Login failed:", error);
      });
  };

  return (
    <div className="bg-gray-100 flex h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
      {/* Left Side - Full Width Image */}
      <div className="w-1/2">
        <img
          src="https://images.unsplash.com/photo-1535957998253-26ae1ef29506?q=80&w=1472&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Workspace"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Right Side - Sign-In Card */}
      <div className="w-1/2 flex justify-center items-center p-6">
        <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-xl">
          <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-4">
            Sign In
          </h2>
          <p className="text-gray-500 text-center mb-6">
            Please enter your credentials to access your account.
          </p>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-700 font-medium">Email:</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full mt-1 p-2 border rounded-md bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">Password:</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full mt-1 p-2 border rounded-md bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:outline-none transition"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gray-900 text-white py-2 rounded-lg font-semibold hover:bg-gray-700 transition duration-300"
            >
              Login
            </button>
          </form>

          {/* Register Link */}
          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-gray-900 font-semibold hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
