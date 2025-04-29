import { supabase } from "../config/db.js"
import { setAuthCookie } from "../utils/authHelper.js"; // make sure this is correctly imported

export const signUp = async (req, res) => {
  const { firstName, lastName, phone, gender, email, password } = req.body;

  if (!email || !password || !firstName || !lastName || !phone) {
    console.log("Missing fields in signUp request:", req.body);
    return res.status(400).json({ success: false, message: "Please provide all fields" });
  }

  try {
    // Step 1: Sign up the user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) throw signUpError;

    const user = signUpData.user;

    // Step 2: Manually sign in the user to get the access token (needed for setting cookie)
    const { data: sessionData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) throw signInError;

    const session = sessionData.session;
    const userId = session.user.id;

    // Step 3: Insert into profiles table
    const { error: insertError } = await supabase
      .from("profiles")
      .insert([
        {
          id: userId, // match auth.users.id
          firstname: firstName,
          lastname: lastName,
          phone,
          gender,
        },
      ]);

    if (insertError) throw insertError;

    // Step 4: Set the access_token in HTTP-only cookie
    res.cookie("access_token", session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    console.log("User and profile created:", user);
    return res.status(201).json({
      success: true,
      message: "User signed up and logged in",
      user,
      profile: {
        firstname: firstName,
        lastname: lastName,
        phone,
        gender,
      },
    });
  } catch (error) {
    console.error("Error during signUp:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


export const signIn = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ success: false, message: "All fields required" });

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    const access_token = data.session?.access_token;
    if (!access_token) throw new Error("No access token received");

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();

    if (profileError) throw profileError;
    if (!profile) throw new Error("User profile not found");

    // Use the cookie helper  
    setAuthCookie(res, access_token);

    res.status(200).json({ success: true, 
      user: {
      ...data.user,
      role: profile.role
    } 
  });
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

       // Fetch profile from "profiles" table based on user.id
        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

        if (profileError) {
            console.error("Error fetching profile:", profileError.message);
            return res.status(500).json({ success: false, message: "Failed to fetch profile" });
        }
        
      // ROLL the cookie — refresh expiry
      res.cookie("access_token", access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        maxAge: 60 * 60 * 1000, // reset to 1 hour
      });

      return res.status(200).json({
         success: true, 
         user:{role: profile.role}, profile,
            creds: {
                email: user.email,
                phone: user.phone,
            },
        });
    } catch (err) {
      return res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
  };


  export const signOut = async (req, res) => {
    try {
      // Clear the cookie that stores the access token
      res.clearCookie('access_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
      });
  
      // Optional: Invalidate session via Supabase if using server-side auth management
      const { error } = await supabase.auth.signOut();
  
      if (error) {
        console.error("Supabase signOut error:", error.message);
        return res.status(500).json({ success: false, message: "Error logging out" });
      }
  
      res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (err) {
      console.error("Error in signOut:", err);
      res.status(500).json({ success: false, message: "Server error during sign out" });
    }
  };

  export const updateProfile = async (req, res) => {
    try {
      const { firstname, lastname, phone } = req.body;
      
      const access_token = req.cookies?.access_token;
      if (!access_token) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }
  
      const { data: { user }, error: userError } = await supabase.auth.getUser(access_token);
      if (userError) throw userError;
      console.log(user)
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      console.log("Updating profile for user:", user.id);
      console.log("New profile data:", { firstname, lastname, phone });
  
      const { data, error: updateError } = await supabase
        .from('profiles')
        .update({
          firstname,
          lastname,
          phone,
        })
        .eq('id', user.id)
        .select(); // optional, to fetch updated data
  
      if (updateError) throw updateError;
  
      console.log("Update success:", data);
  
      return res.status(200).json({ success: true, message: "Profile updated successfully", updatedProfile: data });
    } catch (error) {
      console.error("Error updating profile:", error);
      return res.status(500).json({ success: false, message: "Failed to update profile", error: error.message });
    }
  }
  
  
  

