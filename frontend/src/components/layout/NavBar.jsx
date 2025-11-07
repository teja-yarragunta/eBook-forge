import React, { useEffect, useState } from "react";
import { BookOpen, LogOut, X, Menu } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import ProfileDropdown from "./ProfileDropdown";

const NavBar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navLinks = [{ name: "Features", href: "#features" }];

  // close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (profileDropdownOpen) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [profileDropdownOpen]);

  return (
    <header>
      <div className="max-w-7xl mx-auto px-8 lg:px-10 ">
        <div className="flex items-center justify-between h-20">
          {/* logo */}
          <a href="/" className="flex items-center space-x-3.5 group">
            <div className="w-11 h-11 bg-linear-to-br from-violet-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-all duration-300 group-hover:scale-110">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900 tracking-tight">
              eBook-Forge
            </span>
          </a>
          {/* desktop navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-5 py-3 text-sm font-medium text-gray-600 hover:text-violet-600 rounded-lg"
              >
                {link.name}
              </a>
            ))}
          </nav>
          {/* auth buttons and profile */}
          <div className="hidden lg:flex items-center space-x-4">
            {isAuthenticated ? (
              <ProfileDropdown
                isOpen={profileDropdownOpen}
                onToggle={(e) => {
                  e.stopPropagation();
                  setProfileDropdownOpen(!profileDropdownOpen);
                }}
                avatar={user?.avatar || ""}
                name={user?.name || ""}
                email={user?.email || ""}
                userRole={user?.role || ""}
                onLogout={logout}
                showDashboardLink={true}
              />
            ) : (
              <>
                <a
                  href="/login"
                  className="px-5 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg hover:bg-purple-400 transition-all duration-200"
                >
                  Login
                </a>
                <a
                  href="/signup"
                  className="px-5 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg hover:bg-purple-400 transition-all duration-200"
                >
                  Get Started
                </a>
              </>
            )}
          </div>
          {/* mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-3 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-purple-400 transition-all duration-200"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* mobile menu */}
      {isOpen && (
        <div className="lg:hidden fixed inset-x-0 top-20 bg-white border-b border-gray-100 shadow-lg transform transition-all duration-300 ease-in-out z-50">
          <nav className="px-5 py-5 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-5 py-3 text-sm font-medium text-gray-600 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors duration-200"
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="px-4 py-4 border-t border-gray-100">
            {isAuthenticated ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 px-2">
                  <div className="h-10 w-10 bg-gradient-to-br from-violet-400 to-violet-500 rounded-xl flex items-center justify-center">
                    <span className="text-white font-semibold text-base">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {user?.name}
                    </div>
                    <div className="text-xs text-gray-600">{user?.email}</div>
                  </div>
                </div>

                {/* Dashboard Link */}
                <a
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-violet-700 bg-gray-50 hover:bg-violet-50 rounded-lg transition-colors duration-200"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Dashboard</span>
                </a>

                {/* View Profile button */}
                <a
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-violet-700 bg-gray-50 hover:bg-violet-50 rounded-lg transition-colors duration-200"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>View Profile</span>
                </a>

                {/* Sign out button */}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-red-600 bg-gray-50 hover:bg-red-50 rounded-lg transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <a
                  href="/login"
                  className="block w-full text-center px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-violet-600 bg-gray-50 hover:bg-violet-50 rounded-lg transition-colors duration-200"
                >
                  Login
                </a>
                <a
                  href="/signup"
                  className="block w-full text-center px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-br from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 rounded-lg transition-colors duration-200"
                >
                  Get Started
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;
