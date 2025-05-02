import { supabase } from "../config/db.js";
import { setAuthCookie } from "../utils/authHelper.js";

/**
 * Handle user registration
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const signUp = async (req, res) => {
  const { firstName, lastName, phone, gender, email, password } = req.body;

  try {
    // Validate required fields
    if (!validateRequiredFields(firstName, lastName, phone, email, password)) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide all fields" 
      });
    }

    // Register user with Supabase Auth
    const user = await registerUser(email, password);
    
    // Sign in to get session
    const session = await signInUser(email, password);
    
    // Create user profile
    await createUserProfile(session.user.id, firstName, lastName, phone, gender);
    
    // Set authentication cookie
    setAuthCookieResponse(res, session.access_token);

    // Return success response
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

/**
 * Handle user authentication
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields required" 
      });
    }

    // Authenticate user with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    });
    
    if (error) throw error;

    const access_token = data.session?.access_token;
    if (!access_token) throw new Error("No access token received");

    // Get user profile
    const profile = await getUserProfile(data.user.id);
    
    // Set auth cookie
    setAuthCookie(res, access_token);

    // Return success response
    return res.status(200).json({ 
      success: true, 
      user: {
        ...data.user,
        role: profile.role
      } 
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

/**
 * Verify user session and return user data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const checkSession = async (req, res) => {
  const access_token = req.cookies?.access_token;

  if (!access_token) {
    return res.status(401).json({ 
      success: false, 
      message: "No token found" 
    });
  }

  try {
    // Verify token and get user
    const user = await verifyAccessToken(access_token);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid token" 
      });
    }

    // Get user profile
    const profile = await getUserProfile(user.id);
    
    // Refresh cookie expiry
    setAuthCookieResponse(res, access_token);

    // Return user data
    return res.status(200).json({
      success: true, 
      user: { role: profile.role }, 
      profile,
      creds: {
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

/**
 * Sign out user and clear auth cookie
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const signOut = async (req, res) => {
  try {
    // Clear auth cookie
    clearAuthCookie(res);
    
    // Sign out from Supabase
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    return res.status(200).json({ 
      success: true, 
      message: "Logged out successfully" 
    });
  } catch (error) {
    console.error("Error in signOut:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Server error during sign out" 
    });
  }
};

/**
 * Update user profile information
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateProfile = async (req, res) => {
  const { firstname, lastname, phone } = req.body;
  const access_token = req.cookies?.access_token;
  
  try {
    if (!access_token) {
      return res.status(401).json({ 
        success: false, 
        message: "Unauthorized" 
      });
    }

    // Verify token and get user
    const user = await verifyAccessToken(access_token);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    // Update profile
    const updatedProfile = await updateUserProfile(user.id, firstname, lastname, phone);
    
    return res.status(200).json({ 
      success: true, 
      message: "Profile updated successfully", 
      updatedProfile 
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Failed to update profile", 
      error: error.message 
    });
  }
};

/* ===== Helper Functions ===== */

/**
 * Validate required signup fields
 * @param {string} firstName - User's first name
 * @param {string} lastName - User's last name
 * @param {string} phone - User's phone number
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {boolean} - Validation result
 */
function validateRequiredFields(firstName, lastName, phone, email, password) {
  return Boolean(email && password && firstName && lastName && phone);
}

/**
 * Register a new user with Supabase Auth
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Object} - Created user object
 */
async function registerUser(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;
  return data.user;
}

/**
 * Sign in user to get session
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Object} - User session
 */
async function signInUser(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data.session;
}

/**
 * Create user profile in database
 * @param {string} userId - User ID
 * @param {string} firstName - User's first name
 * @param {string} lastName - User's last name
 * @param {string} phone - User's phone number
 * @param {string} gender - User's gender
 */
async function createUserProfile(userId, firstName, lastName, phone, gender) {
  const { error } = await supabase
    .from("profiles")
    .insert([
      {
        id: userId,
        firstname: firstName,
        lastname: lastName,
        phone,
        gender,
      },
    ]);

  if (error) throw error;
}

/**
 * Set authentication cookie in response
 * @param {Object} res - Express response object
 * @param {string} accessToken - User access token
 */
function setAuthCookieResponse(res, accessToken) {
  res.cookie("access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    maxAge: 60 * 60 * 1000, // 1 hour
  });
}

/**
 * Clear authentication cookie
 * @param {Object} res - Express response object
 */
function clearAuthCookie(res) {
  res.clearCookie('access_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
  });
}

/**
 * Verify access token and get user
 * @param {string} accessToken - User access token
 * @returns {Promise<Object|null>} - User object or null
 */
async function verifyAccessToken(accessToken) {
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user) return null;
  return user;
}

/**
 * Get user profile from database
 * @param {string} userId - User ID
 * @returns {Object} - User profile
 */
async function getUserProfile(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  if (!data) throw new Error("User profile not found");
  
  return data;
}

/**
 * Update user profile in database
 * @param {string} userId - User ID
 * @param {string} firstname - User's first name
 * @param {string} lastname - User's last name
 * @param {string} phone - User's phone number
 * @returns {Object} - Updated profile
 */
async function updateUserProfile(userId, firstname, lastname, phone) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ firstname, lastname, phone })
    .eq('id', userId)
    .select();

  if (error) throw error;
  return data;
}