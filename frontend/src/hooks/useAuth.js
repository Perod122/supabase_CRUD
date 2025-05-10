// hooks/useAuth.js
import { useEffect, useState } from "react";
import axios from "axios";
import { fLogic } from "@/store/fLogic";
import { useLocation } from "react-router-dom";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "";

export default function useAuth() {
  const [authenticated, setAuthenticated] = useState(null);
  const setUser = fLogic((state) => state.setUser); // assumes your store has this
  const location = useLocation();

  useEffect(() => {
    // Don't check session if we're on the login page
    if (location.pathname === "/") {
      setAuthenticated(false);
      return;
    }

    axios
      .get(`${BASE_URL}/api/products/session`, { withCredentials: true })
      .then(res => {
        if (res.data.success && res.data.user) {
          setUser(res.data.user); // store user with role in Zustand
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
      })
      .catch(() => {
        setAuthenticated(false);
      });
  }, [location.pathname]);

  return authenticated;
}
