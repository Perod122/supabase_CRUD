// src/components/PrivateRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { fLogic } from "@/store/fLogic";
import LoadingScreen from "./LoadingScreen";

function PrivateRoute({ children, allowedRoles }) {
  const authenticated = useAuth();
  const user = fLogic((state) => state.user);

  if (authenticated === null) {
    return <LoadingScreen message="Loading Initialized...." />;
  }

  if (!allowedRoles.includes(user?.role)) {
    // Logged in but role not allowed → redirect based on role
    if (user?.role === "admin") {
      return <Navigate to="/home" replace />;
    } else if (user?.role === "user") {
      return <Navigate to="/user" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  // All good
  return children;
}

export default PrivateRoute;
