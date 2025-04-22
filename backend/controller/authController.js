import { supabase } from "../config/db.js"
import { setAuthCookie } from "../utils/authHelper.js";
export const signUp = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Please provide all fields" });
    }

    try {
        const { user, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) throw error;

        console.log("User signed up:", user);
        res.status(201).json({ success: true, data: user });
    } catch (error) {
        console.error("Error signUp:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

export const signIn = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ success: false, message: "All fields required" });

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    const access_token = data.session?.access_token;
    if (!access_token) throw new Error("No access token received");

    // Use the cookie helper
    setAuthCookie(res, access_token);

    res.status(200).json({ success: true, user: data.user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};
    // GET /api/session
  export const checkSession = async (req, res) => {
    const access_token = req.cookies?.access_token;

    if (!access_token) {
      return res.status(401).json({ success: false, message: "No token found" });
    }

    try {
      // Validate token with Supabase
      const { data: { user }, error } = await supabase.auth.getUser(access_token);

      if (error || !user) {
        return res.status(401).json({ success: false, message: "Invalid token" });
      }

      // ROLL the cookie — refresh expiry
      res.cookie("access_token", access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        maxAge: 60 * 60 * 1000, // reset to 1 hour
      });

      return res.status(200).json({ success: true, user });
    } catch (err) {
      return res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
  };


    export const signOut = async (req, res) => {
        res.clearCookie('access_token');
        res.status(200).json({ success: true, message: "Logged out" });
        };

