import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import Navbar from "../navigation/Navbar";

const ProtectedRoutes = () => {
  const isAuthenticated = true;

  if (isAuthenticated) {
    return (
      <>
        <Navbar />
        <div className="pt-[60px] min-h-[calc(100vh-60px)] h-full">
          <Outlet />
        </div>
      </>
    );
  }
  return <Navigate to="/login" />;
};

export default ProtectedRoutes;
