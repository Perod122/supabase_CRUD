// src/components/AuthRedirect.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function AuthRedirect({ children }) {
  const authenticated = useAuth();

  if (authenticated === null) return <div>Loading...</div>;
  if (authenticated) return <Navigate to="/home" replace />;
  return children;
}

export default AuthRedirect;
