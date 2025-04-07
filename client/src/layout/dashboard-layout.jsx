/* eslint-disable no-unused-vars */
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/dashboard-sidebar";
import DashboardNavbar from "../components/dashboard-navbar";

const Dashboardlayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <DashboardNavbar />
      <Sidebar />
      <main className=" ml-0 mt-16 w-full overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboardlayout;