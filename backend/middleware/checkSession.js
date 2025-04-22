import { supabase } from "../config/db.js";

const checkSession = async (req, res, next) => {
    const token = req.cookies['access_token'];
    if (!token) return res.status(401).json({ success: false, message: 'Not authenticated' });
  
    const { data, error } = await supabase.auth.getUser(token);
  
    if (error || !data?.user) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
  
    req.user = data.user;
    next(); // Pass to next route
  };
  
  export default checkSession;