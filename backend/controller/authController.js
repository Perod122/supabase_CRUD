import { supabase } from "../config/db.js"

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
  
      // Get session token
      const access_token = data.session?.access_token;
  
      // Set it as HTTP-only cookie
      res.cookie('access_token', access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
        maxAge: 60 * 60 * 1000, // 7 days
      });
  
      res.status(200).json({ success: true, user: data.user });
    } catch (err) {
      res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
  };
    export const checkSession = async (req, res) => {
        const token = req.cookies?.access_token;

        if (!token) {
            return res.status(401).json({ success: false, message: "No token found" });
        }

        const { data, error } = await supabase.auth.getUser(token);

        if (error || !data?.user) {
            return res.status(401).json({ success: false, message: "Invalid session" });
        }

        res.status(200).json({ success: true, user: data.user });
        };

    export const signOut = async (req, res) => {
        res.clearCookie('access_token');
        res.status(200).json({ success: true, message: "Logged out" });
        };

