// src/components/AuthRedirect.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function AuthRedirect({ children }) {
  const authenticated = useAuth();

  if (authenticated === null){
    return (
      <div className="flex justify-center items-center h-64">
          <div className="loading loading-spinner loading-lg"/>
          </div>
    );
  }
  if (authenticated) return <Navigate to="/home" replace />;
  return children;
}

export default AuthRedirect;
