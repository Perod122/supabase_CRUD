import { supabase } from "../config/db.js";

const checkSession = async (req, res, next) => {
    const token = req.cookies?.access_token;
    
    if (!token) return res.status(401).json({ success: false, message: 'Not authenticated' });
  
    const { data: { user }, error } = await supabase.auth.getUser(token);
  
    if (error || !user) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
  
    req.user = user;
    next(); // Pass to next route
  };
  
  export default checkSession;