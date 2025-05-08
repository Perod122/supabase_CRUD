import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LogOutIcon, 
  NotebookPen, 
  NotepadText, 
  SettingsIcon, 
  ShoppingBagIcon, 
  ShoppingCartIcon, 
  User2Icon,
  ChevronDown,
  Menu
} from "lucide-react";
import { fLogic } from '../store/fLogic';
import { useProductStore } from '@/store/useProductStore';
import { useOrderStore } from '@/store/useOrder';
import { motion, AnimatePresence } from 'framer-motion';

// Animation variants
const navItemVariants = {
  hover: { scale: 1.1 },
  tap: { scale: 0.95 }
};

const dropdownVariants = {
  hidden: { opacity: 0, y: -5, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 22 
    } 
  },
  exit: { 
    opacity: 0, 
    y: -5, 
    scale: 0.95,
    transition: { duration: 0.2 }
  }
};

// NavIcon component for consistent styling and animations
const NavIcon = ({ children, badge, title, onClick, to }) => {
  const content = (
    <motion.button
      whileHover="hover"
      whileTap="tap"
      variants={navItemVariants}
      onClick={onClick}
      className="btn btn-ghost btn-circle relative"
      title={title}
    >
      {children}
      {badge > 0 && (
        <motion.span 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="badge badge-sm badge-primary absolute top-2 right-0 translate-x-1/2 -translate-y-1/2"
        >
          {badge}
        </motion.span>
      )}
    </motion.button>
  );
  
  return to ? <Link to={to}>{content}</Link> : content;
};

function Navbar() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const handleSignOut = fLogic((state) => state.handleSignOut);
  const fetchUser = fLogic((state) => state.fetchUser);
  const user = fLogic((state) => state.user);
  const { cart } = useProductStore();
  const creds = fLogic((state) => state.creds);
  const { AllOrder, UserOrder } = useOrderStore();
  
  // Close dropdown when route changes
  useEffect(() => {
    setIsProfileOpen(false);
    setIsMenuOpen(false);
  }, [location]);
  
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);
  
  const getInitials = () => {
    if (!user?.firstname && !user?.lastname) return '?';
    const firstInitial = user?.firstname ? user.firstname.charAt(0).toUpperCase() : '';
    const lastInitial = user?.lastname ? user.lastname.charAt(0).toUpperCase() : '';
    return `${firstInitial}${lastInitial}`;
  };

  const isAdmin = user?.role === "admin";
  const homeRoute = isAdmin ? "/home" : "/user";

  return (
    <div className="bg-base-100/80 backdrop-blur-lg border-b border-base-content/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto">
        <div className="navbar px-4 min-h-[4rem] justify-between">
          {/* Logo */}
          <div className="flex-1 lg:flex-none">
            <Link to={homeRoute} className="hover:opacity-80 transition-opacity">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-2"
              >
                <motion.div 
                  whileHover={{ rotate: -10, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <ShoppingBagIcon className="size-9 text-blue-400" />
                </motion.div>
                <motion.span 
                  className="hidden sm:inline font-semibold font-mono tracking-widest text-2xl bg-clip-text bg-gradient-to-r from-primary to-secondary"
                  whileHover={{ scale: 1.05 }}
                >
                  Shopperod
                </motion.span>
              </motion.div>
            </Link>
          </div>

          {/* Mobile menu button - only shown on small screens */}
          <div className="lg:hidden">
            <button 
              className="btn btn-ghost btn-circle"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="size-6" />
            </button>
          </div>

          {/* Right Section - Desktop */}
          <div className="hidden lg:flex items-center gap-2">
            {!isAdmin ? (
              <>
                <NavIcon 
                  to="/myorders" 
                  title="My Orders" 
                  badge={UserOrder.length}
                >
                  <NotebookPen className="size-5" />
                </NavIcon>
                
                <NavIcon 
                  to="/mycart" 
                  title="My Cart" 
                  badge={cart.length}
                >
                  <ShoppingCartIcon className="size-5" />
                </NavIcon>
              </>
            ) : (
              <NavIcon 
                to="/orders" 
                title="All Orders" 
                badge={AllOrder.length}
              >
                <NotepadText className="size-5" />
              </NavIcon>
            )}
            
            {/* Profile dropdown */}
            <div className="relative">
              <motion.button 
                whileHover="hover"
                whileTap="tap"
                variants={navItemVariants}
                className="btn btn-ghost btn-circle" 
                title="My Profile"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="flex items-center justify-center border border-base-content size-8 rounded-full bg-base-200 text-base-content font-medium"
                >
                  {getInitials()}
                </motion.div>
              </motion.button>
              
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.ul 
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute right-0 mt-3 shadow-xl bg-base-200 text-base-content rounded-box w-56 p-2 space-y-2 z-[1] border border-base-content/10"
                  >
                    {creds && (
                      <motion.li 
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex items-center gap-3 px-3 py-2 rounded-md transition"
                      >
                        <User2Icon className="text-base-content" />
                        <span className="font-mono font-medium text-base-content text-sm truncate">
                          {creds?.email}
                        </span>
                      </motion.li>
                    )}
                    <motion.li 
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Link
                        to="/settings"
                        className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-base-300 transition"
                      >
                        <SettingsIcon className="text-base-content" />
                        <span className="font-mono font-medium text-base-content text-sm">Settings</span>
                      </Link>
                    </motion.li>
                    <motion.li 
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 w-full px-3 py-2 rounded-md hover:bg-base-300 transition text-left"
                      >
                        <LogOutIcon className="text-base-content" />
                        <span className="font-mono font-medium text-base-content text-sm">Logout</span>
                      </button>
                    </motion.li>
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        
        {/* Mobile menu - only shown on small screens */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-base-300"
            >
              <div className="flex flex-col p-4 space-y-3">
                {!isAdmin ? (
                  <>
                    <Link to="/myorders" className="flex items-center gap-2 p-2 hover:bg-base-200 rounded-md">
                      <NotebookPen className="size-5" />
                      <span>My Orders</span>
                      {UserOrder.length > 0 && (
                        <span className="badge badge-sm badge-primary ml-auto">{UserOrder.length}</span>
                      )}
                    </Link>
                    
                    <Link to="/mycart" className="flex items-center gap-2 p-2 hover:bg-base-200 rounded-md">
                      <ShoppingCartIcon className="size-5" />
                      <span>My Cart</span>
                      {cart.length > 0 && (
                        <span className="badge badge-sm badge-primary ml-auto">{cart.length}</span>
                      )}
                    </Link>
                  </>
                ) : (
                  <Link to="/orders" className="flex items-center gap-2 p-2 hover:bg-base-200 rounded-md">
                    <NotepadText className="size-5" />
                    <span>All Orders</span>
                    {AllOrder.length > 0 && (
                      <span className="badge badge-sm badge-primary ml-auto">{AllOrder.length}</span>
                    )}
                  </Link>
                )}
                
                <Link to="/settings" className="flex items-center gap-2 p-2 hover:bg-base-200 rounded-md">
                  <SettingsIcon className="size-5" />
                  <span>Settings</span>
                </Link>
                
                <button 
                  onClick={handleSignOut}
                  className="flex items-center gap-2 p-2 hover:bg-base-200 rounded-md text-left"
                >
                  <LogOutIcon className="size-5" />
                  <span>Logout</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Navbar;