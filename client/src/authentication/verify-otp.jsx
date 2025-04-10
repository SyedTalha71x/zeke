/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import NavbarTitle from '../../public/navbar-title.svg';
import { BASE_URL } from "../utils/api";

export default function VerifyOTP() {
  const navigate = useNavigate();
//   const location = useLocation();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); 
  const [isResending, setIsResending] = useState(false);
  

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);
  
  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const handleChange = (index, value) => {
    // Allow only numbers
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };
  
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };
  
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();
    
    if (/^\d+$/.test(pastedData) && pastedData.length <= 6) {
      const digits = pastedData.split("");
      const newOtp = [...otp];
      
      digits.forEach((digit, index) => {
        if (index < 6) newOtp[index] = digit;
      });
      
      setOtp(newOtp);
      
      // Focus the next empty field or the last field
      const nextEmptyIndex = newOtp.findIndex(v => !v);
      if (nextEmptyIndex !== -1 && nextEmptyIndex < 6) {
        document.getElementById(`otp-${nextEmptyIndex}`).focus();
      } else {
        document.getElementById(`otp-5`).focus();
      }
    }
  };
  
//   const handleResendOTP = async () => {
//     if (timeLeft > 0) return;
    
//     setIsResending(true);
//     try {
//       const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/send-otp`);
      
//       if (response.data.message === "OTP sent to email") {
//         toast.success("New OTP sent to your email!");
//         setTimeLeft(120); // Reset timer
//       } else {
//         toast.error(response.data.error || "Failed to resend OTP");
//       }
//     } catch (error) {
//       const errorMessage = error.response?.data?.error || "Failed to resend OTP. Please try again.";
//       toast.error(errorMessage);
//     } finally {
//       setIsResending(false);
//     }
//   };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      toast.error("Please enter the complete OTP");
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/verify-otp`, { 
        otp: otpValue 
      });
      
      if (response.data.data.success == true) {
        toast.success("OTP verified successfully!");
        localStorage.setItem("verifiedOtp", otpValue);
        setTimeout(() => {
            navigate('/reset-password', {state: {otp: otpValue}})
        }, 1000);
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      const errorMessage = "OTP is expired or invalid. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-6 bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg">
          <div className="text-center">
            <div className="flex justify-center mb-3 sm:mb-4">
              <img
                src={NavbarTitle}
                alt="Hitsphere Logo"
                className="h-auto w-auto max-w-[200px] sm:max-w-none"
              />
            </div>
            <h2 className="text-lg sm:text-xl font-medium text-gray-900">Verify OTP</h2>
            <p className="text-gray-700 text-xs sm:text-sm mt-2 px-2">
              We've sent a verification code to 
            </p>
          </div>

          <div className="form-content">
            <form onSubmit={handleSubmit} className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
              <div>
                <div className="flex justify-center gap-2 sm:gap-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={index === 0 ? handlePaste : undefined}
                      className="appearance-none text-center w-10 h-12 sm:w-12 sm:h-14 bg-[#E3E3E380] outline-none text-lg font-medium rounded-xl sm:rounded-2xl px-1 text-gray-900 focus:ring-2 focus:ring-[#2F456C]"
                      autoFocus={index === 0}
                    />
                  ))}
                </div>
                <div className="text-center mt-3 text-xs sm:text-sm">
                  <p className="text-gray-500">
                    Time remaining: <span className="font-medium">{formatTime()}</span>
                  </p>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`group relative w-full flex justify-center py-2.5 sm:py-3 cursor-pointer border border-transparent text-xs sm:text-sm font-medium rounded-xl sm:rounded-2xl text-white bg-[#2F456C] hover:bg-[#374b73] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B3B5C] ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying...
                    </span>
                  ) : (
                    "Verify OTP"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* <div className="text-center text-xs sm:text-sm">
            <p className="text-gray-600">
              Didn't receive the code?{" "}
              <button 
                onClick={handleResendOTP} 
                disabled={timeLeft > 0 || isResending}
                className={`cursor-pointer underline underline-offset-3 font-medium ${
                  timeLeft > 0 || isResending 
                    ? "text-gray-400" 
                    : "text-red-600 hover:text-[#a66832]"
                }`}
              >
                {isResending ? "Resending..." : "Resend OTP"}
              </button>
            </p>
            <p className="mt-2">
              <button 
                onClick={() => navigate("/forgot-password")} 
                className="text-[#2F456C] cursor-pointer hover:underline underline-offset-3 hover:text-[#3d5785] font-medium"
              >
                Change Email
              </button>
            </p>
          </div> */}
        </div>
      </div>
    </>
  );
}