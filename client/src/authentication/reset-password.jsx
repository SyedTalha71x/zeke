import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import NavbarTitle from '../../public/navbar-title.svg';

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
    otp: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState({
    newPassword: false,
    confirmPassword: false
  });
  
  const otp = location.state?.otp || localStorage.getItem("verifiedOtp") || "";
  
  useEffect(() => {
    // Store OTP in localStorage for persistence
    if (otp) {
      localStorage.setItem("verifiedOtp", otp);
      setFormData(prev => ({ ...prev, otp }));
    }
    
    if (!otp) {
      toast.error("Password reset session expired. Please try again.");
      navigate("/forgot-password");
    }
  }, [otp, navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const togglePasswordVisibility = (field) => {
    setPasswordVisible({
      ...passwordVisible,
      [field]: !passwordVisible[field]
    });
  };
  
  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
      isValid: 
        password.length >= minLength && 
        hasUpperCase && 
        hasLowerCase && 
        hasNumber && 
        hasSpecialChar,
      message: password.length === 0 ? "" : [
        password.length < minLength && "At least 8 characters",
        !hasUpperCase && "At least one uppercase letter",
        !hasLowerCase && "At least one lowercase letter",
        !hasNumber && "At least one number",
        !hasSpecialChar && "At least one special character"
      ].filter(Boolean).join(", ")
    };
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { newPassword, confirmPassword } = formData;
    const validation = validatePassword(newPassword);
    
    if (!validation.isValid) {
      toast.error(`Password requirements: ${validation.message}`);
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/reset-password`, {
        newPassword,
        confirmPassword,
        otp: formData.otp
      });
      
      if (response.data.data.success === true) {
        toast.success("Password reset successfully!");
        
        localStorage.removeItem("resetOTP");
        
        setTimeout(() => {
          navigate("/login-signup");
        }, 1500);
      } else {
        toast.error(response.data.error || "Failed to reset password");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 
                         "Failed to reset password. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Password strength indicator
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: "" };
    
    const validation = validatePassword(password);
    
    if (validation.isValid) {
      return { strength: 100, label: "Strong" };
    }
    
    // Calculate based on criteria met
    const criteria = [
      password.length >= 8,
      /[A-Z]/.test(password),
      /[a-z]/.test(password),
      /\d/.test(password),
      /[!@#$%^&*(),.?":{}|<>]/.test(password)
    ];
    
    const metCriteria = criteria.filter(Boolean).length;
    const strengthPercentage = Math.min(Math.floor((metCriteria / 5) * 100), 90);
    
    if (strengthPercentage < 30) return { strength: strengthPercentage, label: "Weak" };
    if (strengthPercentage < 70) return { strength: strengthPercentage, label: "Medium" };
    return { strength: strengthPercentage, label: "Good" };
  };
  
  const passwordStrength = getPasswordStrength(formData.newPassword);
  
  // Get strength bar color
  const getStrengthColor = (strength) => {
    if (strength < 30) return "bg-red-500";
    if (strength < 70) return "bg-yellow-500";
    if (strength < 100) return "bg-blue-500";
    return "bg-green-500";
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
            <h2 className="text-lg sm:text-xl font-medium text-gray-900">Reset Your Password</h2>
            <p className="text-gray-700 text-xs sm:text-sm mt-2 px-2">
              Create a new password for your account
            </p>
          </div>

          <div className="form-content">
            <form onSubmit={handleSubmit} className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
              {!otp && (
                <div>
                  <input
                    type="text"
                    name="otp"
                    required
                    placeholder="Enter your OTP"
                    value={formData.otp}
                    onChange={handleChange}
                    className="appearance-none relative block bg-[#E3E3E380] outline-none text-xs sm:text-sm rounded-xl sm:rounded-2xl w-full px-3 py-2.5 sm:py-3 placeholder-gray-500 text-gray-900 focus:ring-2 focus:ring-[#2F456C]"
                  />
                </div>
              )}
              
              <div>
                <div className="relative">
                  <input
                    type={passwordVisible.newPassword ? "text" : "password"}
                    name="newPassword"
                    required
                    placeholder="New password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="appearance-none relative block bg-[#E3E3E380] outline-none text-xs sm:text-sm rounded-xl sm:rounded-2xl w-full px-3 py-2.5 sm:py-3 placeholder-gray-500 text-gray-900 focus:ring-2 focus:ring-[#2F456C]"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => togglePasswordVisibility("newPassword")}
                  >
                    {passwordVisible.newPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                
                {formData.newPassword && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getStrengthColor(passwordStrength.strength)}`}
                          style={{ width: `${passwordStrength.strength}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-xs text-gray-600">{passwordStrength.label}</span>
                    </div>
                    {passwordStrength.strength < 100 && (
                      <p className="text-xs text-gray-500">
                        {validatePassword(formData.newPassword).message}
                      </p>
                    )}
                  </div>
                )}
              </div>
              
              <div>
                <div className="relative">
                  <input
                    type={passwordVisible.confirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    required
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="appearance-none relative block bg-[#E3E3E380] outline-none text-xs sm:text-sm rounded-xl sm:rounded-2xl w-full px-3 py-2.5 sm:py-3 placeholder-gray-500 text-gray-900 focus:ring-2 focus:ring-[#2F456C]"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => togglePasswordVisibility("confirmPassword")}
                  >
                    {passwordVisible.confirmPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                
                {formData.newPassword && formData.confirmPassword && (
                  <div className="mt-1">
                    {formData.newPassword === formData.confirmPassword ? (
                      <p className="text-xs text-green-600">Passwords match</p>
                    ) : (
                      <p className="text-xs text-red-600">Passwords do not match</p>
                    )}
                  </div>
                )}
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
                      Resetting Password...
                    </span>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="text-center text-xs sm:text-sm">
            <p className="text-gray-600">
              Remember your password?{" "}
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