import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
          Create Account
        </h2>
        <p className="text-gray-500 text-center mb-6">
          Sign up to access the platform.
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 font-medium">First Name</label>
            <input
              type="text"
              placeholder="Enter your first name"
              value={firstname}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full mt-1 px-4 py-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:outline-none transition"
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
              className="w-full mt-1 px-4 py-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Mobile Number</label>
            <input
              type="text"
              placeholder="Enter your mobile number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              required
              className="w-full mt-1 px-4 py-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              placeholder="name@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full mt-1 px-4 py-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full mt-1 px-4 py-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:outline-none transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition duration-300 transform hover:scale-105"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-gray-900 font-semibold hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}

export default RegistrationForm;
