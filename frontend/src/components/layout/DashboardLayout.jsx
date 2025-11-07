import { useState, useEffect } from "react";
import { Album } from "lucide-react";
import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import ProfileDropdown from "./ProfileDropdown";

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  // Close dropdowns when clicking outside
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
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
          {/* Left - Logo */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="h-9 w-9 bg-gradient-to-br from-violet-400 to-violet-500 rounded-lg flex items-center justify-center shadow-md shadow-violet-400/30 group-hover:shadow-violet-400/50 transition-all duration-300">
                <Album className="h-5 w-5 text-white" />
              </div>
              <span className="text-black font-semibold text-xl tracking-tight group-hover:text-violet-600 transition-colors duration-300">
                eBook-Forge
              </span>
            </Link>
          </div>

          {/* Right - Profile Dropdown */}
          <div className="flex items-center space-x-3">
            <ProfileDropdown
              isOpen={profileDropdownOpen}
              onToggle={(e) => {
                e.stopPropagation();
                setProfileDropdownOpen(!profileDropdownOpen);
              }}
              avatar={user?.avatar || ""}
              name={user?.name || ""}
              email={user?.email || ""}
              onLogout={logout}
            />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6 bg-transparent">
          {children}
        </main>
      </div>
    </div>
  );
};
export default DashboardLayout;
