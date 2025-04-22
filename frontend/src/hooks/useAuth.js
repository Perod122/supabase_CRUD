import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "";

export default function useAuth() {
  const [authenticated, setAuthenticated] = useState(null);

  useEffect(() => {
    axios.get(`${BASE_URL}/api/session`, { withCredentials: true })
      .then(res => setAuthenticated(res.data.success))
      .catch(() => setAuthenticated(false));
  }, []);

  return authenticated;
}
