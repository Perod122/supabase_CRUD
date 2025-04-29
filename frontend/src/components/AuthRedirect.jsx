// src/components/AuthRedirect.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { fLogic } from "@/store/fLogic";
import LoadingScreen from "./LoadingScreen";

function AuthRedirect({ children }) {
  const authenticated = useAuth();
  const user = fLogic((state) => state.user);

  if (authenticated === null) {
    return <LoadingScreen message="Checking authentication..." />;
  }


  if (user?.role === "admin") {
    return <Navigate to="/home" replace />;
  }

  if (user?.role === "user") {
    return <Navigate to="/user" replace />;
  }

  // If role is missing or unexpected, fallback to children
  return children;
}

export default AuthRedirect;
