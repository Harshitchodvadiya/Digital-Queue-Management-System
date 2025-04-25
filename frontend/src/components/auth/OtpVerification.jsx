import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function OtpVerificationForm() {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(300); // 5 mins expiry time of otp
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0); //to prevent clicking on "Resend OTP" button for 5 mins
  const inputRefs = useRef([]); //Holds refs to all OTP input boxes for focus control.
  const location = useLocation(); // to read data passed via navigate() (like email, mode)
  const navigate = useNavigate();

  const email = location.state?.email;
  const mode = location.state?.mode || "signup"; // 'signup' or 'reset'

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;
    const updatedOtp = [...otp];
    updatedOtp[index] = element.value;
    setOtp(updatedOtp);
    if (element.value && index < 5) {   //Moves to next input if a digit is entered.
      inputRefs.current[index + 1].focus();
    }
  };

  //If backspace is pressed on an empty box, focus moves to the previous box.
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  //Runs a countdown every second. Stops when timeLeft hits 0.
  useEffect(() => {
    const timer =
      timeLeft > 0 &&
      setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  //Disables the "Resend OTP" button for 5 minutes once clicked. Updates countdown on the button.

  useEffect(() => {
    let cooldownTimer;
    if (resendDisabled && resendCooldown > 0) {
      cooldownTimer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    if (resendCooldown <= 0) {
      setResendDisabled(false);
    }
    return () => clearInterval(cooldownTimer);
  }, [resendDisabled, resendCooldown]);

  //Converts time from seconds to "MM:SS" format.
  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const joinedOtp = otp.join("");
    if (joinedOtp.length < 6) {
      setError("Please enter all 6 digits of the OTP.");
      return;
    }
    if (timeLeft <= 0) {
      setError("OTP expired. Please request a new one.");
      return;
    }
    try {
      const endpoint =
        mode === "signup" ? "verify-signup-otp" : "verify-otp";
      await axios.post(`http://localhost:8081/api/v1/auth/${endpoint}`, {
        email,
        otp: joinedOtp,
      });

      toast.success("OTP Verified Successfully!");
      setTimeout(() => {
        if (mode === "signup") {
          navigate("/login");
        } else {
          navigate("/reset-password", { state: { email } });
        }
      }, 2000);
    } catch (error) {
      console.error("OTP Verification failed:", error);
      setError("Invalid or expired OTP.");
    }
  };

  const handleResend = async () => {
    if (resendDisabled) return;
    try {
      await axios.post(`http://localhost:8081/api/v1/auth/resend-otp`, {
        email,
      });
      setTimeLeft(300); // 5 mins
      setOtp(new Array(6).fill(""));
      setError("");
      setResendDisabled(true);
      setResendCooldown(300);
    } catch (error) {
      console.error("Failed to resend OTP:", error);
      setError("Unable to resend OTP. Please try again later.");
    }
  };

  // Auto-submit when all digits are filled
  useEffect(() => {
    if (otp.every((digit) => digit !== "") && timeLeft > 0) {
      handleVerify(new Event("submit"));
    }
  }, [otp]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <ToastContainer />
      {/* Left side */}
      <div className="md:w-1/2 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] flex items-center justify-center text-white p-10">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold">
            Welcome to Digital Queue Management System
          </h2>
          <p className="text-lg">Verify your account to continue.</p>
          <img
            src="https://img.freepik.com/free-vector/enter-otp-concept-illustration_114360-7962.jpg"
            alt="OTP Verification"
            className="w-72 md:w-96 mx-auto"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="md:w-1/2 flex items-center justify-center bg-white">
        <div className="w-full max-w-md p-8">
          <h2 className="text-2xl font-bold text-center mb-2">OTP Verification</h2>
          <p className="text-center text-gray-600 mb-6">
            Enter the OTP sent to <strong>{email}</strong>
          </p>

          <form onSubmit={handleVerify} className="space-y-4">
            <div className="flex justify-between gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  aria-label={`Digit ${index + 1}`}
                  className="w-12 h-12 text-center border border-gray-400 rounded focus:ring-2 focus:ring-indigo-500 text-lg"
                  value={digit}
                  onChange={(e) => handleChange(e.target, index)}
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
            </div>

            {error && (
              <p className="text-red-500 text-sm mt-2" role="alert">
                {error}
              </p>
            )}

            <div className="text-center mt-2 text-sm text-gray-600">
              OTP expires in <span className="font-semibold">{formatTime(timeLeft)}</span>
            </div>

            <div className="text-center mt-2">
              <button
                type="button"
                onClick={handleResend}
                disabled={resendDisabled}
                className={`text-sm font-medium ${
                  resendDisabled
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-indigo-600 hover:underline"
                }`}
              >
                Resend OTP
                {resendDisabled && ` (Available in ${formatTime(resendCooldown)})`}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-900 hover:bg-gray-800 text-white py-2 rounded transition duration-300 mt-4"
            >
              Verify OTP
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default OtpVerificationForm;
