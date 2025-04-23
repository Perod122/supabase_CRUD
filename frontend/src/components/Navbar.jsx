import React from 'react'
import { useResolvedPath } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { LogOutIcon, LucideTabletSmartphone, Menu, MenuIcon, Settings, SettingsIcon, ShoppingCartIcon} from "lucide-react";
import { fLogic } from '../store/fLogic';

function Navbar() {
    const handleSignOut = fLogic((state) => state.handleSignOut);
    const {pathname} = useResolvedPath();
    const isHomePage = pathname === "/home";
    return (
        <div className="bg-base-100/80 backdrop-blur-lg border-b border-base-content/10 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto">
            <div className="navbar px-4 min-h-[4rem] justify-between">
              {/* Logo */}
              <div className="flex-1 lg:flex-none">
                <div className="flex items-stretch">
                  <Link to="/home" className="hover:opacity-80 transition-opacity">
                    <div className="flex items-center space-x-2">
                      <LucideTabletSmartphone className="size-9 text-primary" />
                      <span className="font-semibold font-mono tracking-widest text-2xl bg-clip-text text-gray-600 bg-gradient-to-r from-primary to-secondary">
                        Perodize
                      </span>
                    </div>
                  </Link>
                </div>
              </div>
      
              {/* Right Section */}
              <div className="flex items-center gap-4">
                {isHomePage && (
                  <div className="dropdown dropdown-end">
                    <button className="btn btn-ghost btn-circle">
                      <MenuIcon className="size-7" />
                    </button>
      
                    <ul className="dropdown-content mt-3 shadow-xl bg-white rounded-box w-56 p-2 space-y-2 z-[1]">
                      <li>
                        <Link
                          to="/settings"
                          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 transition"
                        >
                          <SettingsIcon className="text-gray-600" />
                          <span className="font-mono font-medium text-sm">Settings</span>
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-3 w-full px-3 py-2 rounded-md hover:bg-gray-100 transition text-left"
                        >
                          <LogOutIcon className="text-gray-600" />
                          <span className="font-mono font-medium text-sm">Logout</span>
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
      
}

export default Navbar
