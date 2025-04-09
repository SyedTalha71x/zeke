/* eslint-disable no-unused-vars */
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken"); 
    navigate("/login-signup"); 
  };

  const links = [
    { to: "/user-profile/dashboard", label: "Dashboard" },
    { to: "/user-profile/account-details", label: "Account Details" },
    { to: "/user-profile/my-orders", label: "My Orders" },
    { to: "/user-profile/my-rewards", label: "My Rewards" },
    { to: "/user-profile/billing", label: "Billing Address" },
    { to: "/login-signup", label: "Logout", isLogout: true },
  ];

  return (
    <nav className="w-full md:w-64 flex-shrink-0 sticky top-4">
      <div className="bg-[#FFFFFF] rounded-lg shadow-sm">
        <div className="flex flex-col">
          {links.map((link) =>
            link.isLogout ? (
              <button
                key={link.to}
                onClick={handleLogout}
                className="p-4 border-b border-slate-500/30 cursor-pointer text-gray-700 text-left"
              >
                {link.label}
              </button>
            ) : (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `p-4 border-b border-slate-500/30 cursor-pointer ${
                    isActive ? "bg-[#2F456C] text-white" : "text-gray-700"
                  }`
                }
              >
                {link.label}
              </NavLink>
            )
          )}
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
