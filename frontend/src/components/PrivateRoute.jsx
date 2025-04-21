// src/components/PrivateRoute.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "";

function PrivateRoute({ children }) {
  const [authenticated, setAuthenticated] = useState(null);

  useEffect(() => {
    axios.get(`${BASE_URL}/api/session`, { withCredentials: true })
      .then(res => setAuthenticated(res.data.success))
      .catch(() => setAuthenticated(false));
  }, []);

  if (authenticated === null) return <div>Loading...</div>;

  if (!authenticated) return <Navigate to="/" replace />;
  return children;
}

export default PrivateRoute;
