import { useState, useEffect, useRef } from "react"
import { Eye, EyeOff } from "lucide-react"
import { gsap } from "gsap"
import { Link, useNavigate } from "react-router-dom"
import Google from "../../public/google.svg"
import Facebook from "../../public/facebook.svg"  
import Apple from "../../public/apple.svg"
import NavbarTitle from "../../public/navbar-title.svg"
import axios from "axios" 
import toast, { Toaster } from "react-hot-toast";
import { BASE_URL } from "../utils/api"

export default function AuthForm() {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  
  
  const tabsRef = useRef(null)
  const slideRef = useRef(null)
  const containerRef = useRef(null)
  const [isTabsReady, setIsTabsReady] = useState(false)
  
  useEffect(() => {
    const initializeSlider = () => {
      if (!tabsRef.current || !slideRef.current) return;
      
      const buttons = tabsRef.current.children
      const activeButton = buttons[isLogin ? 1 : 0]
      const buttonWidth = activeButton.offsetWidth
      const buttonLeft = activeButton.offsetLeft

      gsap.set(slideRef.current, {
        x: buttonLeft,
        width: buttonWidth
      })
      
      setIsTabsReady(true)
    }

    // Use ResizeObserver to handle window resizing
    const resizeObserver = new ResizeObserver(initializeSlider)
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current)
      }
    }
  }, [isLogin])

  const handleTabChange = (newIsLogin) => {
    if (newIsLogin === isLogin || !isTabsReady) return

    setError("")

    const buttons = tabsRef.current.children
    const activeButton = buttons[newIsLogin ? 1 : 0]
    const buttonWidth = activeButton.offsetWidth
    const buttonLeft = activeButton.offsetLeft

    gsap.to(slideRef.current, {
      x: buttonLeft,
      width: buttonWidth,
      duration: 0.5,
      ease: "power2.out"
    })

    gsap.to(".form-content", {
      opacity: 0,
      y: 20,
      duration: 0.3,
      onComplete: () => {
        setIsLogin(newIsLogin)
        gsap.to(".form-content", {
          opacity: 1,
          y: 0,
          duration: 0.3
        })
      }
    })
  }

  // Password validation
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
  
  // Get strength bar color
  const getStrengthColor = (strength) => {
    if (strength < 30) return "bg-red-500";
    if (strength < 70) return "bg-yellow-500";
    if (strength < 100) return "bg-blue-500";
    return "bg-green-500";
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
  
    // Validate password on signup
    if (!isLogin) {
      const validation = validatePassword(formData.password);
      if (!validation.isValid) {
        toast.error(`Password requirements: ${validation.message}`);
        return;
      }
    }
  
    setLoading(true)
  
    try {
      if (isLogin) {
        const loginData = {
          email: formData.email,
          password: formData.password
        }
  
        const response = await axios.post(`${BASE_URL}/login`, loginData)
  
        if (response.data.data.token) {
          localStorage.setItem("authToken", response.data.data.token)
          toast.success('You are logged in successfully!')
          setTimeout(() => {
            navigate("/") 
          }, 2000);
        }
      } else {
        const signupData = {
          name: formData.fullName,
          email: formData.email,
          password: formData.password
        }
  
        await axios.post(`${BASE_URL}/signup`, signupData)
        toast.success("Registration successful! Please login.")
        handleTabChange(true)
        setFormData({
          fullName: "",
          email: formData.email,
          password: ""
        })
      }
    } catch (err) {
      console.error("Auth error:", err);
    
      if (err.response && err.response.data && err.response.data.data?.error) {
        const errorMessage = err.response.data.data.error;
    
        if (isLogin) {
          if (errorMessage === "Invalid email or password") {
            toast.error("Wrong credentials. Please try again.");
          } else {
            toast.error(errorMessage);
          }
        } else {
          // For signup errors
          toast.error(errorMessage);
        }
    
        setError(errorMessage);
      } else {
        setError("An unexpected error occurred. Please try again.");
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  }
    
  

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <>
    <Toaster position="top-right" />
    <div className="min-h-screen lg:mt-24 md:mt-16 sm:mt-10 mt-10 flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8">
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

        <div ref={containerRef} className="relative bg-[#AA947B0D] p-1.5 rounded-2xl">
          <div 
            ref={tabsRef}
            className="grid grid-cols-2 gap-1 relative z-10"
          >
            <button
              className={`p-2 sm:p-3 text-xs sm:text-sm cursor-pointer rounded-xl ${!isLogin ? "text-red-600" : "text-gray-600"}`}
              onClick={() => handleTabChange(false)}
            >
              Sign Up
            </button>
            <button
              className={`p-2 sm:p-3 text-xs sm:text-sm cursor-pointer rounded-xl ${isLogin ? "text-red-600" : "text-gray-600"}`}
              onClick={() => handleTabChange(true)}
            >
              Login
            </button>
          </div>
          <div
            ref={slideRef}
            className="absolute top-1.5 left-1.5 h-[calc(100%-12px)] bg-white rounded-xl shadow-md transition-colors duration-300"
          />
        </div>

        <div className="form-content">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-lg text-xs sm:text-sm mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
            {!isLogin && (
              <div>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="Full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="appearance-none relative block bg-[#E3E3E380] outline-none text-xs sm:text-sm rounded-xl sm:rounded-2xl w-full px-3 py-2.5 sm:py-3 placeholder-gray-500 text-gray-900"
                />
              </div>
            )}

            <div>
              <input
                type="email"
                name="email"
                required
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                className="appearance-none relative block bg-[#E3E3E380] outline-none text-xs sm:text-sm rounded-xl sm:rounded-2xl w-full px-3 py-2.5 sm:py-3 placeholder-gray-500 text-gray-900"
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder={isLogin ? "Password" : "Create password"}
                value={formData.password}
                onChange={handleChange}
                className="appearance-none relative block bg-[#E3E3E380] outline-none text-xs sm:text-sm rounded-xl sm:rounded-2xl w-full px-3 py-2.5 sm:py-3 placeholder-gray-500 text-gray-900"
              />
             
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
              >
                {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 mb-6" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5 mb-6" />}
              </button>
              
              {isLogin && (
                <div>
                  <Link to={"/forgot-password"} className="text-red-600 flex justify-end items-center mt-1 cursor-pointer text-sm">
                    Forgot Password?
                  </Link>
                </div>
              )}
              
              {!isLogin && formData.password && (
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
                      {validatePassword(formData.password).message}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full outline-none flex justify-center py-2.5 sm:py-3 cursor-pointer border border-transparent text-xs sm:text-sm font-medium rounded-xl sm:rounded-2xl text-white bg-[#2F456C] hover:bg-[#374b73] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B3B5C] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? 
                  isLogin ? "Logging in..." : "Creating Account..." : 
                  isLogin ? "Login" : "Create Account"
                }
              </button>
            </div>

            <div className="relative py-2 sm:py-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-xs sm:text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <button
                type="button"
                className="inline-flex justify-center items-center text-xs sm:text-sm font-medium gap-1 py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl sm:rounded-2xl bg-[#E3E3E380] hover:bg-gray-200 cursor-pointer transition-all duration-500 ease-in-out"
              >
                <img src={Google} alt="Google" className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">Google</span>
              </button>
              <button
                type="button"
                className="inline-flex justify-center items-center text-xs sm:text-sm font-medium gap-1 py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl sm:rounded-2xl bg-[#E3E3E380] hover:bg-gray-200 cursor-pointer transition-all duration-500 ease-in-out"
              >
                <img src={Facebook} alt="Facebook" className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">Facebook</span>
              </button>
              <button
                type="button"
                className="inline-flex justify-center items-center text-xs sm:text-sm font-medium gap-1 py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl sm:rounded-2xl bg-[#E3E3E380] hover:bg-gray-200 cursor-pointer transition-all duration-500 ease-in-out"
              >
                <img src={Apple} alt="Apple" className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">Apple</span>
              </button>
            </div>
          </form>
        </div>

        <div className="text-center text-xs sm:text-sm">
          <p className="text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => handleTabChange(!isLogin)} 
              className="text-red-600 underline underline-offset-3 hover:text-[#a66832] font-medium"
            >
              {isLogin ? "Sign up" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
    </>
  )
}