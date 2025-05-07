// src/components/LoadingScreen.jsx
import React from "react";

const LoadingScreen = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-base-100">
      <div className="loading loading-spinner loading-lg text-base-content mb-4"></div>
      <p className="text-base font-medium text-base-content">{message}</p>
    </div>
  );
};

export default LoadingScreen;
