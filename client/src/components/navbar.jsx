/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import NavLogo from "../../public/nav_logo.svg";
import WhiteNavLogo from "../../public/white-nav-logo.svg";
import  { jwtDecode } from 'jwt-decode'

export default function Navbar() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [UserRole, setUserRole] = useState("")
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        
        setUserRole(decoded.role || null);
      } catch (error) {
        console.error("Invalid token:", error);
        setUserRole(null);
      }
    }
  }, []);

  const isStyledAuthPage =
    location.pathname.includes("login-signup") ||
    location.pathname.includes("forgot-password") ||
    location.pathname.includes("verify-otp") ||
    location.pathname.includes("reset-password") ||
    location.pathname.includes("card-details") ||
    location.pathname.includes("user-profile") ||
    location.pathname.includes("faqs") ||
    location.pathname.includes("privacy-policy") ||
    location.pathname.includes("add-payment-method") ||
    location.pathname.includes("admin-register") || 
    location.pathname.includes("all-cards");

  const showLoginSignup =
    location.pathname.includes("login-signup") ||
    location.pathname.includes("forgot-password") ||
    location.pathname.includes("add-payment-method") ||
    location.pathname.includes("verify-otp") ||
    location.pathname.includes("reset-password") || 
    location.pathname.includes("admin-register") ||
    location.pathname.includes("all-cards");

  const isSingleCardDetail =
    location.pathname.includes("card-details") ||
    location.pathname.includes("user-profile") ||
    location.pathname.includes("faqs") ||
    location.pathname.includes("privacy-policy");

    
  const redirectToDashboard = () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      navigate("/user-profile/dashboard");
    } else {
      navigate("/login-signup");
    }
  };

  const redirectToHomePage = () => {
    navigate("/");
  };

  const redirectToLoginSignup = () => {
    navigate("/login-signup");
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 ${isStyledAuthPage ? "shadow-2xl" : ""} z-50 transition-colors duration-300 ${
        isStyledAuthPage ? "bg-white" : isScrolled ? "bg-black" : "bg-transparent"
      }`}
    >
      <div className={`max-w-7xl mx-auto ${isStyledAuthPage ? "p-3" : "p-7"}`}>
        <div className="flex justify-between items-center h-16">
          <div
            onClick={redirectToHomePage}
            className="flex items-center cursor-pointer space-x-4"
          >
            <img
              src={isStyledAuthPage ? WhiteNavLogo : NavLogo}
              alt="Navigation Logo"
            />
          </div>
          <div className="flex items-center gap-2 md:flex-row flex-col ">
            <div>

            {showLoginSignup ? (
              <button
                onClick={redirectToLoginSignup}
                className="inline-flex items-center px-4 py-2 bg-[#2F456C] rounded-2xl text-sm font-medium text-white cursor-pointer"
              >
                Login/Signup
              </button>
            ) : (
              <button
                onClick={redirectToDashboard}
                className={`inline-flex items-center px-4 py-2 ${
                  isSingleCardDetail
                    ? "bg-[#2F456C] text-white"
                    : "bg-[#FFFFFF] text-black"
                } rounded-2xl text-sm font-medium text-[#2F456C] cursor-pointer`}
              >
                My Account
              </button>
            )}
             </div>  
            { UserRole === "admin" && <div>
              <Link to={"/dashboard/overview"}>
            <button
             className="inline-flex items-center px-4 py-2 bg-[#2F456C] rounded-2xl text-sm font-medium text-white cursor-pointer">Admin Dashboard</button>
             </Link>
          </div>}
          </div>
       
        </div>
      </div>
    </nav>
  );
}
