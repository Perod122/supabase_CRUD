import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LogOutIcon, NotepadText, SettingsIcon, ShoppingBagIcon, ShoppingCartIcon, User2Icon, } from "lucide-react";
import { fLogic } from '../store/fLogic';
import ThemeSelector from './ThemeSelector';
import { useProductStore } from '@/store/useProductStore';


function Navbar() {
  const handleSignOut = fLogic((state) => state.handleSignOut);
  const fetchUser = fLogic((state) => state.fetchUser);
  const user = fLogic((state) => state.user);
  const {cart} = useProductStore();
  const creds = fLogic((state) => state.creds);

  const getInitials = () => {
    if (!user?.firstname && !user?.lastname) return '?';
    const firstInitial = user?.firstname ? user.firstname.charAt(0).toUpperCase() : '';
    const lastInitial = user?.lastname ? user.lastname.charAt(0).toUpperCase() : '';
    return `${firstInitial}${lastInitial}`;
  };
  
  useEffect(() => {
    fetchUser(); 
  }, [fetchUser]);
  

  return (
    <div className="bg-base-100/80 backdrop-blur-lg border-b border-base-content/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto">
        <div className="navbar px-4 min-h-[4rem] justify-between">
          {/* Logo */}
          <div className="flex-1 lg:flex-none">
            <div className="flex items-stretch">
            <Link to={user?.role === "admin" ? "/home" : "/user"} className="hover:opacity-80 transition-opacity">
                <div className="flex items-center space-x-2">
                  <ShoppingBagIcon className="size-9 text-blue-400" />
                  <span className="hidden sm:inline font-semibold font-mono tracking-widest text-2xl bg-clip-text bg-gradient-to-r from-primary to-secondary">
                    Shopperod
                  </span>
                </div>
              </Link>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
          {user?.role !== "admin" ? (
            <div className="indicator">
            <Link to="/mycart">
              <button
                tabIndex={0}
                className="btn btn-ghost btn-circle relative"
                title="My Cart"
              >
                <ShoppingCartIcon className="size-5" />
                { cart.length > 0 && (
                <span className="badge badge-sm badge-primary absolute top-2 right-0 translate-x-1/2 -translate-y-1/2">
                  {cart.length}
                </span>
                )} 
              </button>
            </Link>
          </div>
          
          ) : (
            <Link to="/orders">
              <button
                tabIndex={0}
                className="btn btn-ghost btn-circle relative"
                title="My Cart"
              >
                <NotepadText className="size-5" />
              </button>
              </Link>
          )}
              <div className="dropdown dropdown-end">
                <button className="btn btn-ghost btn-circle" title="Select Theme">
                  <div className="flex items-center justify-center border border-base-content size-8 rounded-full bg-base-200 text-base-content font-medium">
                          {getInitials()}
                        </div>
                </button>

                <ul className="dropdown-content mt-3 shadow-xl bg-base-200 text-base-content rounded-box w-56 p-2 space-y-2 z-[1] border border-base-content/10">
                  {creds && (
                      <li className="flex items-center gap-3 px-3 py-2 rounded-md transition">
                        <User2Icon className="text-base-content" />
                        <span className="font-mono font-medium text-base-content text-sm">
                          {creds?.email}
                        </span>
                      </li>
                    )}
                  <li>
                    <Link
                      to="/settings"
                      className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-base-300 transition"
                    >
                      <SettingsIcon className="text-base-content" />
                      <span className="font-mono font-medium text-base-content text-sm">Settings</span>
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 w-full px-3 py-2 rounded-md hover:bg-base-300 transition text-left"
                    >
                      <LogOutIcon className="text-base-content" />
                      <span className="font-mono font-medium text-base-content text-sm">Logout</span>
                    </button>
                  </li>
              </ul>

              </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;