// ResetPassword.jsx
import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResetPassword = () => {
  const [password, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handleReset = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      toast.error("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      await axios.post("http://localhost:8081/api/v1/auth/reset-password", {
        email,
        newPassword: password,
        confirmPassword,
      });

      toast.success("Password reset successfully.");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error(
        error?.response?.data?.message || "Failed to reset password."
      );
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
       
       {/* Left side */}
       <div className="md:w-1/2 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] flex items-center justify-center text-white p-10">
         <div className="text-center space-y-4">
           <h2 className="text-4xl font-bold">Reset Password</h2>
           <p className="text-lg">Reset your password to continue.</p>
           <img
            src="src/assets/reset_password.jpg"
            alt="Forgot Password"
            className="w-72 md:w-96 mx-auto"
          />
        </div>
      </div>

        
      <ToastContainer />
      <div className="md:w-1/2 flex items-center justify-center bg-white">
        <div className="w-full max-w-md p-8">
            <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
            <p className="text-center text-gray-600 mb-6">
                Enter your credentials to continue using your account
            </p>

        <form onSubmit={handleReset}>
          <label className="block mb-2 text-sm font-medium">New Password</label>
          <input
            type="password"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <label className="block mb-2 text-sm font-medium">Confirm Password</label>
          <input
            type="password"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-900 text-white py-2 rounded hover:bg-gray-800"
          >
            Reset Password
          </button>
        </form>
      </div>
      </div>
    </div>
  );
};

export default ResetPassword;

// import React, { useState } from "react";
// import axios from "axios";
// import { useLocation, useNavigate } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const ResetPassword = () => {
//   const [password, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const navigate = useNavigate();
//   const location = useLocation();
//   const email = location.state?.email;

//   const handleReset = async (e) => {
//     e.preventDefault();
//     if (!password || !confirmPassword) {
//       toast.error("All fields are required.");
//       return;
//     }

//     if (password !== confirmPassword) {
//       toast.error("Passwords do not match.");
//       return;
//     }

//     try {
//       await axios.post("http://localhost:8081/api/v1/auth/reset-password", {
//         email,
//         newPassword: password,
//         confirmPassword,
//       });

//       toast.success("Password reset successfully.");
//       setTimeout(() => {
//         navigate("/login");
//       }, 1500);
//     } catch (error) {
//       console.error("Password reset error:", error);
//       toast.error(
//         error?.response?.data?.message || "Failed to reset password."
//       );
//     }
//   };

//   return (
//     <div
//       className="min-h-screen flex items-center justify-center bg-cover  bg-no-repeat"
//       style={{ backgroundImage: "url('src/assets/resetpw.png')" }}
//     >
//       <ToastContainer />
//       {/* <div className="bg-gray-300 p-8 rounded shadow-md w-full max-w-md bg-opacity-100"> */}
//       <div className="bg-white bg-opacity-10 backdrop-blur-md p-8 rounded-2xl shadow-lg w-full max-w-md border border-white border-opacity-30">

//         <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
//         <form onSubmit={handleReset}>
//           <label className="block mb-2 text-sm font-medium">New Password</label>
//           <input
//             type="password"
//             className="w-full p-2 border border-gray-300 rounded mb-4"
//             placeholder="Enter new password"
//             value={password}
//             onChange={(e) => setNewPassword(e.target.value)}
//             required
//           />

//           <label className="block mb-2 text-sm font-medium">Confirm Password</label>
//           <input
//             type="password"
//             className="w-full p-2 border border-gray-300 rounded mb-4"
//             placeholder="Confirm new password"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             required
//           />

//           <button
//             type="submit"
//             className="w-full bg-blue-900 text-white py-2 rounded hover:bg-gray-800"
//           >
//             Reset Password
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ResetPassword;