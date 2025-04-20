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

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Please provide all fields" });
    }

    try {
        const { user, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;

        console.log("User signed in:", user);
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error("Error signIn:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}