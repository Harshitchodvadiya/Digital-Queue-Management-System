import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email.");
      return;
    }
    try {
      await axios.post("http://localhost:8081/api/v1/auth/forgot-password", {
        email,
      });
      toast.success("OTP sent to your email.");
      setTimeout(() => {
        navigate("/verify-otp", {
          state: { email: email, mode: "reset" }, // mode: this is part of the reset password.
        });
      }, 1500); //Waits for 1.5 seconds

    } catch (error) {
      console.error("Error sending reset OTP:", error);
      toast.error(
        error?.response?.data?.message || "Failed to send OTP. Try again."
      );
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <ToastContainer />

      {/* Left side */}
       <div className="md:w-1/2 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] flex items-center justify-center text-white p-10">
         <div className="text-center space-y-4">
           <h2 className="text-4xl font-bold">Forgot Password</h2>
           <p className="text-lg">Reset your password to continue.</p>
           <img
            src="src/assets/forgot_password.jpg"
            alt="Forgot Password"
            className="w-72 md:w-96 mx-auto"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="md:w-1/2 flex items-center justify-center bg-white">
        <div className="w-full max-w-md p-8">
        <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>
          <p className="text-center text-gray-600 mb-6">
            Enter the email associated with your account and we'll send you an otp to your registered email.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
            <label className="block mb-2 text-sm font-medium">Email Address</label>
          <input
            type="email"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
            </div>
          
          <button
            type="submit"
            className="w-full bg-blue-900 text-white py-2 rounded hover:bg-gray-800"
          >
            Send OTP
          </button>
        </form>

          </div>
        </div>
      </div>
    
  );
};

export default ForgotPassword;
