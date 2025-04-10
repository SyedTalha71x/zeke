import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import NavbarTitle from '../../public/navbar-title.svg';
import { BASE_URL } from "../utils/api";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/send-otp`, { email });
      
      if (response.data.message === "OTP sent to email") {
        toast.success("OTP sent to your email!");
        setTimeout(() => {
          navigate("/verify-otp"); 
        }, 1000);
      } else {
        toast.error(response.data.error || "Failed to send OTP");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 
                         "Failed to send OTP. Please try again.";
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
          <p className="text-gray-700 text-xs sm:text-sm px-2">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incidi
          </p>
        </div>

        <div className="form-content">
          <form onSubmit={handleSubmit} className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
            <div>
              <input
                type="email"
                name="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block bg-[#E3E3E380] outline-none text-xs sm:text-sm rounded-xl sm:rounded-2xl w-full px-3 py-2.5 sm:py-3 placeholder-gray-500 text-gray-900"
              />
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
                    Sending OTP...
                  </span>
                ) : (
                  "Send OTP"
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="text-center text-xs sm:text-sm">
          <p className="text-gray-600">
            Back to?{" "}
            <button 
              onClick={() => navigate("/login-signup")} 
              className="text-red-600 cursor-pointer underline underline-offset-3 hover:text-[#a66832] font-medium"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
    </>
  );
}