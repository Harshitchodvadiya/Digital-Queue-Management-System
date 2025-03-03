import React, { useState } from "react";
import axios from "axios";
import { useNavigate,Link } from "react-router-dom";

function RegistrationForm() {
  const [firstname, setName] = useState("");
  const [lastname, setLastName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    const user = {
      firstname: firstname,
      lastname: lastname,
      mobileNumber:mobileNumber,
      email: email,
      password: password,
    };

    axios
      .post("http://localhost:8081/api/v1/auth/signup", user)
      .then((response) => {
        console.log("Registration successful:", response.data);
        navigate("/");
      })
      .catch((error) => {
        console.error("Registration failed:", error);
      });
  };

  return (
    <div className="bg-gray-100 flex h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
      {/* Left Side - Full Width Image */}
      <div className="w-1/2">
        <img
          src="https://images.unsplash.com/photo-1513128034602-7814ccaddd4e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Workspace"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Right Side - Sign-In Card */}
      <div className="w-1/2 flex justify-center items-center p-6 mt-10 mb-10">
        <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-xl">
          <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-4">
            Sign Up
          </h2>
          <p className="text-gray-500 text-center mb-6">
          Sign up to access the platform.
          </p>

          {/* Form */}
          <form className="space-y-3" onSubmit={handleSubmit}>
          <div>
                  <label className="block text-gray-700 font-medium text-left">First Name:</label>
                  <input
                    type="text"
                    placeholder="Enter your first name"
                    value={firstname}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full mb-1 p-1 border rounded-md bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:outline-none transition"
                  />
            </div>

            <div>
            <label className="block text-gray-700 font-medium">Last Name</label>
            <input
              type="text"
              placeholder="Enter your last name"
              value={lastname}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-full mb-1 p-1 border rounded-md bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:outline-none transition"
            />
          </div>


            <div>
                  <label className="block text-gray-700 font-medium text-left">Phone Number:</label>
                  <input
                    type="number"
                    placeholder="Enter your phone no."
                    max={10}
                    maxLength={10}
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)} 
                    required
                    className="w-full mb-1 p-1 border rounded-md bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium text-left">Email:</label>
                  <input
                    type="email"
                    placeholder="name@yourmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full mb-1 p-1 border rounded-md bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:outline-none transition"
                  />
                </div>
    
                <div>
                  <label className="block text-gray-700 font-medium text-left">Password:</label>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full mb-1 p-1 border rounded-md bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:outline-none transition"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition duration-300 transform hover:scale-105">
                  Sign Up
                </button>
              </form>
    
              <p className="mt-4 text-center mb-1 text-sm text-gray-600">
                Have an account? 
                 <Link to="/login" className="text-gray-900 font-semibold hover:underline">Login here</Link> 
              </p>
        </div>
      </div>
    </div>
  );
}

export default RegistrationForm;
