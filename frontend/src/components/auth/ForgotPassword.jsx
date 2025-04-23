
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// function ForgotPassword() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleResetPassword = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (password !== confirmPassword) {
//       setError("Passwords do not match");
//       return;
//     }

//     try {
//       const response = await axios.post("http://localhost:8081/api/v1/auth/forgot-password", {
//         email,
//         newPassword: password,
//         confirmPassword,
//       });

//       toast.success("Password reset successful!");
//       navigate("/login");
//     } catch (err) {
//       console.error("Error resetting password:", err);
//       setError(
//         err.response?.data?.message || "Something went wrong. Please try again."
//       );
//     }
//   };

//   return (
//     <div className="flex flex-col md:flex-row min-h-screen">
//       <ToastContainer />

//       {/* Left side */}
//       <div className="md:w-1/2 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] flex items-center justify-center text-white p-10">
//         <div className="text-center space-y-4">
//           <h2 className="text-4xl font-bold">Forgot Password</h2>
//           <p className="text-lg">Reset your password to continue.</p>
//           <img
//             src="src/assets/forgot_password.png"
//             alt="Forgot Password"
//             className="w-72 md:w-96 mx-auto"
//           />
//         </div>
//       </div>

//       {/* Right side */}
//       <div className="md:w-1/2 flex items-center justify-center bg-white">
//         <div className="w-full max-w-md p-8">
//           <h2 className="text-2xl font-bold text-center mb-2">Reset Your Password</h2>
//           <p className="text-center text-gray-600 mb-6">
//             Enter your credentials to reset the password
//           </p>

//           <form onSubmit={handleResetPassword} className="space-y-4">
//             <div>
//               <label className="block text-gray-700 font-medium">Email:</label>
//               <input
//                 type="email"
//                 placeholder="Enter your email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 className="w-full mt-1 p-2 border rounded-md bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:outline-none transition"
//               />
//             </div>

//             <div>
//               <label className="block text-gray-700 font-medium">New Password:</label>
//               <input
//                 type="password"
//                 placeholder="Enter new password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 className="w-full mt-1 p-2 border rounded-md bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:outline-none transition"
//               />
//             </div>

//             <div>
//               <label className="block text-gray-700 font-medium">Confirm Password:</label>
//               <input
//                 type="password"
//                 placeholder="Confirm new password"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 required
//                 className="w-full mt-1 p-2 border rounded-md bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:outline-none transition"
//               />
//             </div>

//             {error && (
//               <p className="text-red-500 text-sm mt-2" role="alert">
//                 {error}
//               </p>
//             )}

//             <button
//               type="submit"
//               className="w-full bg-blue-900 hover:bg-gray-800 text-white py-2 rounded transition duration-300 mt-4"
//             >
//               Reset Password
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ForgotPassword;


import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

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
          state: { email: email, mode: "reset" },
        });
      }, 1500);
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
