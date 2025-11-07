import React from "react";
import { ChevronDown, LogOut, User, LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfileDropdown = ({
  isOpen = false,
  onToggle = () => {},
  avatar = "",
  name = "",
  email = "",
  userRole = "",
  onLogout = () => {},
  showDashboardLink = false, // ✅ new prop
}) => {
  const navigate = useNavigate();

  const firstLetter =
    typeof name === "string" && name.trim().length > 0
      ? name.charAt(0).toUpperCase()
      : "U";

  return (
    <div className="relative">
      {/* Dropdown Trigger */}
      <button
        onClick={onToggle}
        type="button"
        aria-expanded={isOpen}
        className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-violet-50 transition-colors"
      >
        {avatar ? (
          <img
            src={avatar}
            alt="avatar"
            className="h-10 w-10 rounded-xl object-cover ring-2 ring-white shadow"
          />
        ) : (
          <div className="h-10 w-10 bg-gradient-to-br from-violet-400 to-violet-500 rounded-xl flex items-center justify-center shadow">
            <span className="text-white font-semibold text-base">
              {firstLetter}
            </span>
          </div>
        )}

        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-gray-900 leading-tight">
            {name || "User"}
          </p>
          <p className="text-xs text-gray-600 leading-tight">{email || "—"}</p>
        </div>

        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-72 bg-white border border-gray-100 rounded-xl shadow-lg z-50"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              {avatar ? (
                <img
                  src={avatar}
                  alt="avatar"
                  className="h-10 w-10 rounded-xl object-cover ring-2 ring-white shadow"
                />
              ) : (
                <div className="h-10 w-10 bg-gradient-to-br from-violet-400 to-violet-500 rounded-xl flex items-center justify-center shadow">
                  <span className="text-white font-semibold text-base">
                    {firstLetter}
                  </span>
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {name || "User"}
                </p>
                <p className="text-xs text-gray-600 truncate">
                  {email || "example@email.com"}
                </p>
                {userRole && (
                  <span className="mt-1 inline-block text-[10px] font-medium text-violet-700 bg-violet-50 px-2 py-0.5 rounded">
                    {userRole}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Links Section */}
          <div className="py-1">
            {showDashboardLink && (
              <button
                onClick={() => navigate("/dashboard")}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:text-violet-700 hover:bg-violet-50 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
            )}

            <button
              onClick={() => navigate("/profile")}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:text-violet-700 hover:bg-violet-50 transition-colors"
            >
              <User className="w-4 h-4" />
              <span>View Profile</span>
            </button>
          </div>

          {/* Logout Section */}
          <div className="py-1 border-t border-gray-100">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
