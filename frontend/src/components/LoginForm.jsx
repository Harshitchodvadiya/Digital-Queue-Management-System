import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

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
        const decodedToken = jwtDecode(token);
        const subValue = decodedToken.sub;
        console.log(subValue);
        
        const userRole = subValue.split(":")[1];

        if (userRole === "ADMIN") {
          navigate("/admin");
        } else if (userRole === "STAFF") {
          navigate("/staff");
        } else {
          navigate("/home");
        }
      })
      .catch((error) => {
        console.error("Login failed:", error);
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-8">
        <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-6">
          Welcome
        </h2>
        <p className="text-gray-500 text-center mb-8">
          Please enter your credentials to access your account.
        </p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:outline-none transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition duration-300 transform hover:scale-105"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-gray-900 font-semibold hover:underline"
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
